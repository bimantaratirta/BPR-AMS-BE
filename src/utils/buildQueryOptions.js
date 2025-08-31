// utils/buildQueryOptions.js
/**
 * @param {Object} modelConfig
 *  - searchableFields: string[]           // e.g. ['name','ktp_number','user.email']
 *  - filterableFields: string[]           // simple equals filter
 *  - orderableFields: string[]            // whitelist order_by fields
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
    dateFields = { created_at: 'created_at', updated_at: 'updated_at' },
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

  // 🔍 Search (OR across searchableFields)
  if (search != null && searchableFields.length > 0) {
    const searchTerm = String(search);
    where.OR = searchableFields.map((fieldPath) => {
      const parts = fieldPath.split('.');
      const leaf = parts.pop();
      // Nested builder: e.g. { user: { email: { contains: searchTerm, mode: 'insensitive' } } }
      const condition = {
        [leaf]: { contains: searchTerm, mode: 'insensitive' },
      };
      return parts.reduceRight((acc, curr) => ({ [curr]: acc }), condition);
    });
  }

  // 🎯 Filtering by equals for simple fields
  if (filter && filterableFields.length > 0) {
    for (const field of filterableFields) {
      const val = filter[field];
      if (val !== undefined) where[field] = val;
    }
  }

  // ⏱️ Date exact & ranges
  const createdField = dateFields.created_at || 'created_at';
  const updatedField = dateFields.updated_at || 'updated_at';

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
  if (Array.isArray(include_relation)) {
    for (const rel of include_relation) {
      if (relations[rel]) include[rel] = relations[rel];
      else if (relations[rel] === true) include[rel] = true;
    }
  }

  // 📊 Order By (whitelist fields)
  let orderBy = [];
  if (Array.isArray(order_by)) {
    orderBy = order_by
      .filter(
        ({ field }) =>
          orderableFields.length === 0 || orderableFields.includes(field)
      )
      .map(({ field, direction = 'asc' }) => ({
        [field]: direction.toLowerCase() === 'desc' ? 'desc' : 'asc',
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
    include,
    ...(take !== undefined ? { take } : {}),
    ...(skip !== undefined ? { skip } : {}),
  };
}
