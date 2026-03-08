const attendanceQueryConfig = {
  searchableFields: ["employee.name", "employee.nik"],
  filterableFields: ["isActive", "status", "date", "branchId", "employeeId"],
  orderableFields: ["createdAt", "updatedAt", "date"],
  relations: { employee: true, branch: true },
  dateFields: { createdAt: "createdAt", updatedAt: "updatedAt" },
  select: {
    employee: {
      id: true,
      name: true,
      nik: true,
      phone: true,
      role: true,
      avatar: true,
    },
    branch: {
      id: true,
      name: true,
    },
  },
};

export default attendanceQueryConfig;
