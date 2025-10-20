// utils/buildQueryOptions.js
/**
 * @param {Object} modelConfig
 *  - searchableFields: string[]           // e.g. ['name','ktp_number','user.email']
 *  - filterableFields: string[]           // simple equals filter
 *  - orderableFields: string[]            // whitelist order_by fields
 *
 *  - relations: Record<string, any>       // include configs
 *  - dateFields: { created_at?: string, updated_at?: string } // map if field names differ
 * @param {Object} query
 * @param {Object} fixedWhere              // e.g. { created_by: userId }
 */
export function buildQueryOptions(modelConfig, query = {}, fixedWhere = {}) {
  const {
    searchableFields = [],
    filterableFields = [],
    orderableFields = [],
    relations = {},
    select = {},
    dateFields = { created_at: "created_at", updated_at: "updated_at" },
    jsonSearchableFields = [], // Menambahkan jsonSearchableFields untuk mendukung pencarian JSON
  } = modelConfig;

  const {
    get_all = false,
    pagination,
    order_by,
    include_relation = [],
    search,
    filter = {},
  } = query;

  // WHERE dasar (mis. scoping by user)
  const where = { ...(fixedWhere || {}) };

  // 🔍 Search (gabungkan pencarian string biasa dan JSON)
  if (search != null) {
    const searchTerm = String(search);

    // Pencarian di field string biasa (menggunakan contains)
    const stringSearchConditions = searchableFields.map((fieldPath) => {
      const parts = fieldPath.split(".");
      const leaf = parts.pop();

      const condition = isEnumField(modelConfig, fieldPath)
        ? { [leaf]: { equals: searchTerm.toUpperCase() } }
        : { [leaf]: { contains: searchTerm, mode: "insensitive" } };

      return parts.reduceRight((acc, curr) => ({ [curr]: acc }), condition);
    });

    // Pencarian di field JSON (menggunakan path dan equals)
    const jsonSearchConditions = jsonSearchableFields.map((jsonFieldConfig) => {
      const { field, path } = jsonFieldConfig;

      return {
        [field]: {
          path: path, // Gunakan path dinamis untuk mencari di dalam JSON
          equals: searchTerm, // Nilai yang dicari di dalam JSON
          mode: "insensitive",
        },
      };
    });

    // Gabungkan kondisi pencarian string biasa dan JSON
    where.OR = [...stringSearchConditions, ...jsonSearchConditions];
  }

  console.log("where : ", JSON.stringify(where, null, 2));

  // 🎯 Filtering by equals for simple fields
  if (filter && filterableFields.length > 0) {
    for (const field of filterableFields) {
      const val = filter[field];
      if (val !== undefined) where[field] = val;
    }
  }

  // ⏱️ Date exact & ranges
  const createdField = dateFields.created_at || "created_at";
  const updatedField = dateFields.updated_at || "updated_at";

  if (filter?.created_at) {
    where[createdField] = new Date(filter.created_at);
  } else if (filter?.created_range) {
    const r = {};
    if (filter.created_range.start)
      r.gte = new Date(filter.created_range.start);
    if (filter.created_range.end) r.lte = new Date(filter.created_range.end);
    if (Object.keys(r).length) where[createdField] = r;
  }

  if (filter?.updated_at) {
    where[updatedField] = new Date(filter.updated_at);
  } else if (filter?.updated_range) {
    const r = {};
    if (filter.updated_range.start)
      r.gte = new Date(filter.updated_range.start);
    if (filter.updated_range.end) r.lte = new Date(filter.updated_range.end);
    if (Object.keys(r).length) where[updatedField] = r;
  }

  // 🧼 Handle is_null & is_not_null (as arrays)
  if (Array.isArray(filter?.is_null) && filter.is_null.length) {
    where.AND = where.AND || [];
    for (const field of filter.is_null) {
      where.AND.push({ [field]: null });
    }
  }

  if (Array.isArray(filter?.is_not_null) && filter.is_not_null.length) {
    // Prisma mendukung NOT sebagai array kondisi
    where.NOT = where.NOT || [];
    for (const field of filter.is_not_null) {
      where.NOT.push({ [field]: null });
    }
  }

  // 📦 Include Relations (whitelist via config)
  const include = {};

  include_relation.forEach((rel) => {
    const relation = relations[rel];

    if (relation) {
      // Cek apakah relasi mengandung sub-relasi (nested)
      if (typeof relation === "object" && !Array.isArray(relation)) {
        include[rel] = {
          include: handleNestedInclude(relation, select[rel]), // Apply select untuk kolom tertentu
        };
      } else if (select[rel]) {
        // Jika relasi tidak nested, hanya menggunakan select
        include[rel] = {
          select: select[rel], // Menambahkan select kolom sesuai konfigurasi
        };
      } else {
        include[rel] = true; // Jika hanya relasi tanpa sub-relasi
      }
    }
  });

  // 📊 Order By (same logic as before)
  let orderBy = [];
  if (Array.isArray(order_by)) {
    orderBy = order_by
      .filter(
        ({ field }) =>
          orderableFields.length === 0 || orderableFields.includes(field)
      )
      .map(({ field, direction = "asc" }) => ({
        [field]: direction.toLowerCase() === "desc" ? "desc" : "asc",
      }));
  }

  // 📄 Pagination
  let take, skip;
  if (!get_all && pagination) {
    const page = Number(pagination.page ?? 1);
    const limit = Number(pagination.limit ?? 10);
    take = limit;
    skip = (page - 1) * limit;
  }

  return {
    where,
    orderBy,
    include, // Return the include object with relations
    ...(take !== undefined ? { take } : {}),
    ...(skip !== undefined ? { skip } : {}),
  };
}

function isEnumField(modelConfig, fieldPath) {
  // Cek apakah fieldPath termasuk dalam enum
  const enumFields = ["status", "process"];
  return enumFields.some((enumField) => fieldPath.includes(enumField));
}

function handleNestedInclude(nestedRelations, selectColumns) {
  const result = {};

  Object.keys(nestedRelations).forEach((key) => {
    const value = nestedRelations[key];

    // Jika relasi adalah objek dan memiliki sub-relasi, rekursifkan
    if (typeof value === "object" && !Array.isArray(value)) {
      result[key] = {
        include: handleNestedInclude(value, selectColumns), // Rekursif untuk nested include
      };
    } else {
      // Jika hanya field saja, set sesuai kolom yang dipilih
      if (selectColumns && selectColumns[key] !== undefined) {
        result[key] = { select: selectColumns[key] }; // Apply select untuk kolom tertentu
      } else {
        result[key] = true; // Semua kolom dimasukkan
      }
    }
  });

  return result;
}
