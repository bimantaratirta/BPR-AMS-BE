const attendanceQueryConfig = {
  searchableFields: ["name"],
  filterableFields: ["isActive", "status"],
  orderableFields: ["createdAt", "updatedAt"],
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
