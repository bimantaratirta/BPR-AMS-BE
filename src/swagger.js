const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "AMS - Attendance Management System",
    description:
      "API untuk sistem manajemen kehadiran karyawan BPR Sahabat Sejati. Mencakup autentikasi, kehadiran, cuti, poin, dan laporan.",
    version: "1.0.0",
    contact: {
      name: "BPR Sahabat Sejati",
    },
  },
  servers: [
    {
      url: "http://localhost:3001/api/v1",
      description: "Local Development",
    },
    {
      url: "https://api.bpr.ashakita.net/api/v1",
      description: "Production",
    },
  ],
  tags: [
    { name: "Auth", description: "Autentikasi admin dan karyawan" },
    { name: "Dashboard", description: "Ringkasan statistik dashboard" },
    { name: "Branch", description: "Manajemen kantor cabang & geofencing" },
    { name: "Employee", description: "Manajemen data karyawan" },
    { name: "Admin", description: "Manajemen akun admin" },
    { name: "Attendance", description: "Pencatatan kehadiran & absensi otomatis" },
    { name: "Leave Request", description: "Permohonan cuti/izin karyawan" },
    { name: "Point Record", description: "Log poin kehadiran (read-only)" },
    { name: "Notification", description: "Notifikasi karyawan" },
    { name: "App Settings", description: "Pengaturan aplikasi global" },
    { name: "Report", description: "Upload & manajemen laporan" },
    { name: "Generate Report", description: "Generate laporan Excel" },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token. Login terlebih dahulu untuk mendapatkan token.",
      },
    },
    schemas: {
      // ─── Generic ───────────────────────────────────────────────────
      SuccessResponse: {
        type: "object",
        properties: {
          code: { type: "integer", example: 200 },
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Berhasil" },
          data: { type: "object" },
        },
      },
      PaginatedResponse: {
        type: "object",
        properties: {
          code: { type: "integer", example: 200 },
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Berhasil" },
          pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 100 },
              totalPages: { type: "integer", example: 10 },
            },
          },
          data: { type: "array", items: { type: "object" } },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          code: { type: "integer", example: 400 },
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Validasi gagal" },
          errors: { type: "array", items: { type: "string" } },
        },
      },
      // ─── Pagination Params ─────────────────────────────────────────
      PaginationQuery: {
        type: "object",
        properties: {
          get_all: { type: "boolean", description: "Ambil semua data tanpa pagination" },
          "pagination[page]": { type: "integer", minimum: 1, default: 1 },
          "pagination[limit]": { type: "integer", minimum: 1, maximum: 100, default: 10 },
          search: { type: "string", description: "Kata kunci pencarian" },
        },
      },
      // ─── Auth ──────────────────────────────────────────────────────
      LoginBody: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@bpr.com" },
          password: { type: "string", minLength: 6, example: "password123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          code: { type: "integer", example: 200 },
          status: { type: "string", example: "success" },
          message: { type: "string", example: "Login berhasil" },
          data: {
            type: "object",
            properties: {
              access_token: { type: "string" },
              refresh_token: { type: "string" },
              user: { type: "object" },
            },
          },
        },
      },
      RegisterAdminBody: {
        type: "object",
        required: ["name", "email", "password", "password_confirmation", "role", "status"],
        properties: {
          name: { type: "string", minLength: 3, example: "Budi Santoso" },
          email: { type: "string", format: "email", example: "budi@bpr.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          password_confirmation: { type: "string", example: "password123" },
          role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "VIEWER"], example: "ADMIN" },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"], example: "ACTIVE" },
        },
      },
      RegisterEmployeeBody: {
        type: "object",
        required: ["nik", "name", "email", "password", "password_confirmation", "branchId", "isActive"],
        properties: {
          nik: { type: "string", pattern: "^\\d{16}$", example: "1234567890123456", description: "16 digit NIK" },
          name: { type: "string", minLength: 3, example: "Andi Wijaya" },
          email: { type: "string", format: "email", example: "andi@bpr.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          password_confirmation: { type: "string", example: "password123" },
          branchId: { type: "string", format: "uuid", example: "uuid-branch" },
          isActive: { type: "boolean", example: true },
        },
      },
      RefreshTokenBody: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: { type: "string" },
        },
      },
      // ─── Branch ────────────────────────────────────────────────────
      BranchCreate: {
        type: "object",
        required: ["name", "address", "latitude", "longitude", "radius"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100, example: "Kantor Pusat" },
          address: { type: "string", minLength: 5, maxLength: 255, example: "Jl. Merdeka No. 1, Jakarta" },
          latitude: { type: "number", example: -6.2088 },
          longitude: { type: "number", example: 106.8456 },
          radius: { type: "integer", minimum: 0, example: 100, description: "Radius geofencing dalam meter" },
          isActive: { type: "boolean", default: true },
        },
      },
      BranchUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3, maxLength: 100 },
          address: { type: "string", minLength: 5, maxLength: 255 },
          latitude: { type: "number" },
          longitude: { type: "number" },
          radius: { type: "integer", minimum: 0 },
          isActive: { type: "boolean" },
        },
      },
      // ─── Employee ──────────────────────────────────────────────────
      EmployeeCreate: {
        type: "object",
        required: ["nik", "name", "email", "password", "branchId"],
        properties: {
          nik: { type: "string", pattern: "^\\d{16}$", example: "1234567890123456" },
          name: { type: "string", minLength: 3, maxLength: 100, example: "Sari Dewi" },
          email: { type: "string", format: "email", example: "sari@bpr.com" },
          password: { type: "string", minLength: 6, example: "password123" },
          branchId: { type: "string", format: "uuid" },
          phone: { type: "string", pattern: "^08\\d{7,11}$", example: "081234567890" },
          role: { type: "string", example: "Teller" },
          isActive: { type: "boolean", default: true },
        },
      },
      EmployeeUpdate: {
        type: "object",
        properties: {
          nik: { type: "string", pattern: "^\\d{16}$" },
          name: { type: "string", minLength: 3, maxLength: 100 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          isActive: { type: "boolean" },
          branchId: { type: "string", format: "uuid" },
          deviceId: { type: "string", nullable: true },
          phone: { type: "string", nullable: true },
          role: { type: "string", nullable: true },
          deviceModel: { type: "string" },
          deviceOs: { type: "string" },
        },
      },
      // ─── Admin ─────────────────────────────────────────────────────
      AdminCreate: {
        type: "object",
        required: ["name", "email", "password", "role", "status"],
        properties: {
          name: { type: "string", minLength: 3, example: "Super Admin" },
          email: { type: "string", format: "email", example: "superadmin@bpr.com" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "VIEWER"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
        },
      },
      AdminUpdate: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 3 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN", "VIEWER"] },
          status: { type: "string", enum: ["ACTIVE", "INACTIVE"] },
        },
      },
      // ─── Attendance ────────────────────────────────────────────────
      AttendanceStatus: {
        type: "string",
        enum: ["HADIR", "TERLAMBAT", "IZIN_CUTI", "IZIN_SAKIT", "IZIN_SETENGAH_HARI", "ALPHA"],
      },
      AttendanceUpdate: {
        type: "object",
        properties: {
          status: { $ref: "#/components/schemas/AttendanceStatus" },
          points: { type: "number", minimum: 0 },
          checkInTime: { type: "string", format: "date-time" },
          checkOutTime: { type: "string", format: "date-time" },
          durationMinutes: { type: "integer", minimum: 0 },
        },
      },
      // ─── Leave Request ─────────────────────────────────────────────
      LeaveType: {
        type: "string",
        enum: ["IZIN_CUTI", "IZIN_SAKIT", "IZIN_SETENGAH_HARI"],
      },
      LeaveRequestCreate: {
        type: "object",
        required: ["startDate", "endDate", "reason", "type", "employeeId"],
        properties: {
          startDate: { type: "string", format: "date-time", example: "2026-03-10T00:00:00.000Z" },
          endDate: { type: "string", format: "date-time", example: "2026-03-10T00:00:00.000Z" },
          reason: { type: "string", minLength: 5, maxLength: 255, example: "Keperluan keluarga" },
          type: { $ref: "#/components/schemas/LeaveType" },
          employeeId: { type: "string", format: "uuid" },
        },
      },
      LeaveRequestUpdate: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", enum: ["APPROVED", "REJECTED"] },
          rejectReason: {
            type: "string",
            minLength: 5,
            maxLength: 255,
            description: "Wajib diisi jika status REJECTED",
          },
        },
      },
    },
    parameters: {
      PathId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "ID resource",
      },
      QueryGetAll: {
        name: "get_all",
        in: "query",
        schema: { type: "boolean" },
        description: "Ambil semua data tanpa pagination",
      },
      QueryPage: {
        name: "pagination[page]",
        in: "query",
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      QueryLimit: {
        name: "pagination[limit]",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      },
      QuerySearch: {
        name: "search",
        in: "query",
        schema: { type: "string" },
        description: "Kata kunci pencarian",
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    // ═══════════════════════════════════════════════════════════════
    // AUTH
    // ═══════════════════════════════════════════════════════════════
    "/auth/admin/login": {
      post: {
        tags: ["Auth"],
        summary: "Login Admin",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
        },
        responses: {
          200: { description: "Login berhasil", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          401: { description: "Email atau password salah", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/admin/register": {
      post: {
        tags: ["Auth"],
        summary: "Register Admin",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterAdminBody" } } },
        },
        responses: {
          201: { description: "Admin berhasil dibuat", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          400: { description: "Validasi gagal", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/admin/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh Token Admin",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenBody" } } },
        },
        responses: {
          200: { description: "Token diperbarui", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          401: { description: "Token tidak valid atau expired" },
        },
      },
    },
    "/auth/employee/login": {
      post: {
        tags: ["Auth"],
        summary: "Login Karyawan",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } },
        },
        responses: {
          200: { description: "Login berhasil", content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } } },
          401: { description: "Kredensial tidak valid" },
        },
      },
    },
    "/auth/employee/register": {
      post: {
        tags: ["Auth"],
        summary: "Register Karyawan",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterEmployeeBody" } } },
        },
        responses: {
          201: { description: "Karyawan berhasil didaftarkan" },
          400: { description: "Validasi gagal" },
        },
      },
    },
    "/auth/employee/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh Token Karyawan",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshTokenBody" } } },
        },
        responses: {
          200: { description: "Token diperbarui" },
          401: { description: "Token tidak valid atau expired" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // DASHBOARD
    // ═══════════════════════════════════════════════════════════════
    "/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Ringkasan Dashboard",
        description: "Mengembalikan total karyawan, statistik kehadiran hari ini, grafik mingguan, check-in terbaru, dan jumlah permohonan cuti pending.",
        responses: {
          200: {
            description: "Data dashboard berhasil diambil",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalEmployees: { type: "integer" },
                    todayHadir: { type: "integer" },
                    todayTerlambat: { type: "integer" },
                    todayAlpha: { type: "integer" },
                    weeklyAttendance: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          day: { type: "string", example: "Sen" },
                          hadir: { type: "integer" },
                          alpha: { type: "integer" },
                        },
                      },
                    },
                    recentCheckins: { type: "array", items: { type: "object" } },
                    pendingLeaveRequests: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // BRANCH
    // ═══════════════════════════════════════════════════════════════
    "/branch": {
      get: {
        tags: ["Branch"],
        summary: "List Kantor Cabang",
        description: "Endpoint publik — tidak memerlukan autentikasi.",
        security: [],
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
          { name: "filter[isActive]", in: "query", schema: { type: "boolean" } },
        ],
        responses: {
          200: { description: "List cabang", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Branch"],
        summary: "Buat Kantor Cabang",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BranchCreate" } } },
        },
        responses: {
          201: { description: "Cabang berhasil dibuat" },
          400: { description: "Validasi gagal" },
          409: { description: "Nama cabang sudah ada" },
        },
      },
    },
    "/branch/{id}": {
      get: {
        tags: ["Branch"],
        summary: "Detail Kantor Cabang",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail cabang" },
          404: { description: "Cabang tidak ditemukan" },
        },
      },
      put: {
        tags: ["Branch"],
        summary: "Update Kantor Cabang",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/BranchUpdate" } } },
        },
        responses: {
          200: { description: "Cabang berhasil diperbarui" },
          404: { description: "Cabang tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Branch"],
        summary: "Hapus Kantor Cabang",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Cabang berhasil dihapus" },
          404: { description: "Cabang tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // EMPLOYEE
    // ═══════════════════════════════════════════════════════════════
    "/employees": {
      get: {
        tags: ["Employee"],
        summary: "List Karyawan",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
          { name: "filter[isActive]", in: "query", schema: { type: "boolean" } },
          { name: "filter[branchId]", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "List karyawan", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Employee"],
        summary: "Tambah Karyawan",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeCreate" } } },
        },
        responses: {
          201: { description: "Karyawan berhasil dibuat" },
          400: { description: "Validasi gagal" },
          409: { description: "NIK atau email sudah terdaftar" },
        },
      },
    },
    "/employees/{id}": {
      get: {
        tags: ["Employee"],
        summary: "Detail Karyawan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail karyawan" },
          404: { description: "Karyawan tidak ditemukan" },
        },
      },
      put: {
        tags: ["Employee"],
        summary: "Update Karyawan",
        description: "Gunakan `multipart/form-data` jika mengupload avatar. Kirim JSON biasa jika tidak ada file.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/EmployeeUpdate" },
                  { properties: { avatar: { type: "string", format: "binary", description: "File gambar avatar (PNG/JPG, maks 5MB)" } } },
                ],
              },
            },
            "application/json": { schema: { $ref: "#/components/schemas/EmployeeUpdate" } },
          },
        },
        responses: {
          200: { description: "Karyawan berhasil diperbarui" },
          404: { description: "Karyawan tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Employee"],
        summary: "Hapus Karyawan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Karyawan berhasil dihapus" },
          404: { description: "Karyawan tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // ADMIN
    // ═══════════════════════════════════════════════════════════════
    "/admins": {
      get: {
        tags: ["Admin"],
        summary: "List Admin",
        description: "Hanya SUPER_ADMIN, ADMIN, VIEWER yang boleh akses.",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
        ],
        responses: {
          200: { description: "List admin", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Admin"],
        summary: "Buat Admin",
        description: "Hanya SUPER_ADMIN yang boleh membuat admin.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AdminCreate" } } },
        },
        responses: {
          201: { description: "Admin berhasil dibuat" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    "/admins/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Detail Admin",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail admin" },
          404: { description: "Admin tidak ditemukan" },
        },
      },
      put: {
        tags: ["Admin"],
        summary: "Update Admin",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AdminUpdate" } } },
        },
        responses: {
          200: { description: "Admin berhasil diperbarui" },
          404: { description: "Admin tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Hapus Admin",
        description: "Hanya SUPER_ADMIN yang boleh menghapus admin.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Admin berhasil dihapus" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // ATTENDANCE
    // ═══════════════════════════════════════════════════════════════
    "/attendances": {
      get: {
        tags: ["Attendance"],
        summary: "List Kehadiran",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
          {
            name: "filter[status]",
            in: "query",
            schema: { $ref: "#/components/schemas/AttendanceStatus" },
            description: "Filter berdasarkan status kehadiran",
          },
          { name: "filter[date]", in: "query", schema: { type: "string", format: "date" }, description: "Filter berdasarkan tanggal (YYYY-MM-DD)" },
          { name: "filter[branchId]", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "filter[employeeId]", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "List kehadiran", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
    },
    "/attendances/report-summary": {
      get: {
        tags: ["Attendance"],
        summary: "Ringkasan Laporan Kehadiran",
        description: "Mengembalikan agregasi statistik kehadiran per tanggal/cabang.",
        parameters: [
          { name: "filter[startDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[endDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[branchId]", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "Ringkasan kehadiran" },
        },
      },
    },
    "/attendances/export-xlsx": {
      get: {
        tags: ["Attendance"],
        summary: "Export Kehadiran ke XLSX",
        description: "Hanya SUPER_ADMIN dan ADMIN yang boleh akses. Mengembalikan file XLSX.",
        parameters: [
          { name: "filter[startDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[endDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[branchId]", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: {
            description: "File XLSX",
            content: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/attendances/checkin": {
      post: {
        tags: ["Attendance"],
        summary: "Check In Karyawan",
        description: "Hanya EMPLOYEE yang boleh akses. Gunakan `multipart/form-data` karena ada upload foto.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["date", "checkInTime", "checkInLat", "checkInLong", "checkInInsideRadius", "status", "points", "isAutoGenerated", "employeeId", "branchId"],
                properties: {
                  date: { type: "string", format: "date-time" },
                  checkInTime: { type: "string", format: "date-time" },
                  checkInLat: { type: "number" },
                  checkInLong: { type: "number" },
                  checkInPhoto: { type: "string", format: "binary", description: "File foto check-in (PNG/JPG, maks 5MB)" },
                  checkInInsideRadius: { type: "boolean" },
                  status: { $ref: "#/components/schemas/AttendanceStatus" },
                  points: { type: "integer", minimum: 0 },
                  isAutoGenerated: { type: "boolean" },
                  employeeId: { type: "string", format: "uuid" },
                  branchId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Check in berhasil" },
          400: { description: "Validasi gagal atau di luar radius" },
          409: { description: "Sudah check in hari ini" },
        },
      },
    },
    "/attendances/checkout": {
      post: {
        tags: ["Attendance"],
        summary: "Check Out Karyawan",
        description: "Hanya EMPLOYEE yang boleh akses.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["checkOutTime", "checkOutLat", "checkOutLong", "durationMinutes"],
                properties: {
                  checkOutTime: { type: "string", format: "date-time" },
                  checkOutLat: { type: "number" },
                  checkOutLong: { type: "number" },
                  durationMinutes: { type: "integer", minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Check out berhasil" },
          400: { description: "Belum check in atau validasi gagal" },
        },
      },
    },
    "/attendances/auto-generate-absent-employees": {
      post: {
        tags: ["Attendance"],
        summary: "Generate Absensi Otomatis",
        description: "Hanya ADMIN yang boleh akses. Memicu job untuk generate status ALPHA bagi karyawan yang belum absen.",
        responses: {
          200: { description: "Job berhasil dijalankan" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    "/attendances/{id}": {
      get: {
        tags: ["Attendance"],
        summary: "Detail Kehadiran",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail kehadiran" },
          404: { description: "Data kehadiran tidak ditemukan" },
        },
      },
      put: {
        tags: ["Attendance"],
        summary: "Update Kehadiran",
        description: "Hanya SUPER_ADMIN dan ADMIN yang boleh akses.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AttendanceUpdate" } } },
        },
        responses: {
          200: { description: "Kehadiran berhasil diperbarui" },
          403: { description: "Akses ditolak" },
          404: { description: "Data tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Attendance"],
        summary: "Hapus Kehadiran",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Kehadiran berhasil dihapus" },
          404: { description: "Data tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // LEAVE REQUEST
    // ═══════════════════════════════════════════════════════════════
    "/leave-requests": {
      get: {
        tags: ["Leave Request"],
        summary: "List Permohonan Cuti/Izin",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
          { name: "filter[status]", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] } },
        ],
        responses: {
          200: { description: "List permohonan cuti", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Leave Request"],
        summary: "Ajukan Permohonan Cuti/Izin",
        description: "Hanya EMPLOYEE yang boleh akses. Gunakan `multipart/form-data` jika ada lampiran.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/LeaveRequestCreate" },
                  { properties: { attachment: { type: "string", format: "binary", description: "File lampiran (PNG/JPG, maks 5MB)" } } },
                ],
              },
            },
          },
        },
        responses: {
          201: { description: "Permohonan berhasil diajukan" },
          400: { description: "Validasi gagal atau tanggal sudah ada permohonan" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    "/leave-requests/{id}": {
      get: {
        tags: ["Leave Request"],
        summary: "Detail Permohonan Cuti",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail permohonan" },
          404: { description: "Permohonan tidak ditemukan" },
        },
      },
      put: {
        tags: ["Leave Request"],
        summary: "Approve/Reject Permohonan",
        description: "Hanya ADMIN dan SUPER_ADMIN yang boleh akses.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LeaveRequestUpdate" } } },
        },
        responses: {
          200: { description: "Permohonan berhasil diproses" },
          400: { description: "rejectReason wajib diisi jika REJECTED" },
          403: { description: "Akses ditolak" },
          404: { description: "Permohonan tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Leave Request"],
        summary: "Hapus Permohonan",
        description: "Hanya ADMIN dan SUPER_ADMIN yang boleh akses.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Permohonan berhasil dihapus" },
          403: { description: "Akses ditolak" },
          404: { description: "Permohonan tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // POINT RECORD
    // ═══════════════════════════════════════════════════════════════
    "/point-records": {
      get: {
        tags: ["Point Record"],
        summary: "List Log Poin",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
          { name: "filter[employeeId]", in: "query", schema: { type: "string", format: "uuid" } },
          { name: "filter[startDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[endDate]", in: "query", schema: { type: "string", format: "date" } },
        ],
        responses: {
          200: { description: "List log poin", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
    },
    "/point-records/summary": {
      get: {
        tags: ["Point Record"],
        summary: "Ringkasan Poin Karyawan",
        description: "Mengembalikan agregasi total poin per karyawan.",
        parameters: [
          { name: "filter[startDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[endDate]", in: "query", schema: { type: "string", format: "date" } },
          { name: "filter[branchId]", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: { description: "Ringkasan poin" },
        },
      },
    },
    "/point-records/{id}": {
      get: {
        tags: ["Point Record"],
        summary: "Detail Log Poin",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail log poin" },
          404: { description: "Data tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // NOTIFICATION
    // ═══════════════════════════════════════════════════════════════
    "/notifications": {
      get: {
        tags: ["Notification"],
        summary: "List Notifikasi",
        parameters: [
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
        ],
        responses: {
          200: { description: "List notifikasi", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
    },
    "/notifications/unread-count": {
      get: {
        tags: ["Notification"],
        summary: "Jumlah Notifikasi Belum Dibaca",
        responses: {
          200: {
            description: "Jumlah notifikasi belum dibaca",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "object", properties: { count: { type: "integer" } } },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/notifications/read-all": {
      put: {
        tags: ["Notification"],
        summary: "Tandai Semua Notifikasi Sudah Dibaca",
        responses: {
          200: { description: "Semua notifikasi ditandai sudah dibaca" },
        },
      },
    },
    "/notifications/{id}/read": {
      put: {
        tags: ["Notification"],
        summary: "Tandai Notifikasi Sudah Dibaca",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Notifikasi ditandai sudah dibaca" },
          404: { description: "Notifikasi tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // APP SETTINGS
    // ═══════════════════════════════════════════════════════════════
    "/app-settings": {
      get: {
        tags: ["App Settings"],
        summary: "List Pengaturan Aplikasi",
        description: "Hanya ADMIN dan SUPER_ADMIN yang boleh akses.",
        parameters: [
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
        ],
        responses: {
          200: { description: "List pengaturan", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["App Settings"],
        summary: "Buat Pengaturan",
        description: "Hanya ADMIN dan SUPER_ADMIN. Gunakan `multipart/form-data` jika upload logo.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  defaultCheckIn: { type: "string", example: "08:00", description: "Jam masuk default (HH:mm)" },
                  halfPointEnd: { type: "string", example: "08:30", description: "Batas jam setengah poin (HH:mm)" },
                  defaultRadius: { type: "integer", example: 100, description: "Radius geofencing default (meter)" },
                  companyLogo: { type: "string", format: "binary", description: "File logo perusahaan (PNG/JPG, maks 5MB)" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Pengaturan berhasil dibuat" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    "/app-settings/{id}": {
      get: {
        tags: ["App Settings"],
        summary: "Detail Pengaturan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail pengaturan" },
          404: { description: "Pengaturan tidak ditemukan" },
        },
      },
      put: {
        tags: ["App Settings"],
        summary: "Update Pengaturan",
        description: "Hanya ADMIN dan SUPER_ADMIN. Gunakan `multipart/form-data` jika upload logo.",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  defaultCheckIn: { type: "string", example: "08:00" },
                  halfPointEnd: { type: "string", example: "08:30" },
                  defaultRadius: { type: "integer", example: 100 },
                  companyLogo: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Pengaturan berhasil diperbarui" },
          403: { description: "Akses ditolak" },
          404: { description: "Pengaturan tidak ditemukan" },
        },
      },
      delete: {
        tags: ["App Settings"],
        summary: "Hapus Pengaturan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Pengaturan berhasil dihapus" },
          403: { description: "Akses ditolak" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // REPORT
    // ═══════════════════════════════════════════════════════════════
    "/report": {
      get: {
        tags: ["Report"],
        summary: "List Laporan",
        parameters: [
          { $ref: "#/components/parameters/QueryGetAll" },
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
          { $ref: "#/components/parameters/QuerySearch" },
        ],
        responses: {
          200: { description: "List laporan", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedResponse" } } } },
        },
      },
      post: {
        tags: ["Report"],
        summary: "Upload Laporan",
        description: "Upload laporan dengan gambar pendukung. Gunakan `multipart/form-data`.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                    description: "Maksimal 5 gambar (PNG/JPG, maks 5MB per gambar)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Laporan berhasil diupload" },
          400: { description: "Validasi gagal" },
        },
      },
    },
    "/report/{id}": {
      get: {
        tags: ["Report"],
        summary: "Detail Laporan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Detail laporan" },
          404: { description: "Laporan tidak ditemukan" },
        },
      },
      delete: {
        tags: ["Report"],
        summary: "Hapus Laporan",
        parameters: [{ $ref: "#/components/parameters/PathId" }],
        responses: {
          200: { description: "Laporan berhasil dihapus" },
          404: { description: "Laporan tidak ditemukan" },
        },
      },
    },
    // ═══════════════════════════════════════════════════════════════
    // GENERATE REPORT
    // ═══════════════════════════════════════════════════════════════
    "/generate-report/generate-xlsx-direksi": {
      get: {
        tags: ["Generate Report"],
        summary: "Generate XLSX Direksi",
        description: "Generate file Excel laporan kehadiran untuk level direksi.",
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "branchId", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: {
            description: "File XLSX",
            content: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/generate-report/generate-xlsx": {
      get: {
        tags: ["Generate Report"],
        summary: "Generate XLSX Kehadiran",
        description: "Generate file Excel laporan kehadiran umum.",
        parameters: [
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "branchId", in: "query", schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          200: {
            description: "File XLSX",
            content: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { schema: { type: "string", format: "binary" } } },
          },
        },
      },
    },
    "/generate-report/list-dereksi": {
      get: {
        tags: ["Generate Report"],
        summary: "List Laporan Direksi",
        parameters: [
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
        ],
        responses: {
          200: { description: "List laporan direksi" },
        },
      },
    },
    "/generate-report/list": {
      get: {
        tags: ["Generate Report"],
        summary: "List Generate Report",
        parameters: [
          { $ref: "#/components/parameters/QueryPage" },
          { $ref: "#/components/parameters/QueryLimit" },
        ],
        responses: {
          200: { description: "List generate report" },
        },
      },
    },
  },
};

export default swaggerSpec;
