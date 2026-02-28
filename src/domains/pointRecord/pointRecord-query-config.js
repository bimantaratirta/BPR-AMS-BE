const pointRecordQueryConfig = {
  searchableFields: ["employee.name"],
  filterableFields: ["type", "employeeId"],
  orderableFields: ["createdAt", "updatedAt"],
  relations: { employee: true },
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
  },
};

export default pointRecordQueryConfig;
