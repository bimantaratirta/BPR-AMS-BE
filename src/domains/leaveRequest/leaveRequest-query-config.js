const leaveRequestQueryConfig = {
  searchableFields: ["employee.name", "employee.nik", "approvedBy.name"],
  filterableFields: ["status", "type"],
  orderableFields: ["createdAt", "updatedAt"],
  relations: { employee: true, approvedBy: true },
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
    approvedBy: {
      id: true,
      name: true,
      role: true,
    },
  },
};

export default leaveRequestQueryConfig;
