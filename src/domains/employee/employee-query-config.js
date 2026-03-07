const employeeQueryConfig = {
  searchableFields: ["name", "nik", "email", "role", "branch.name"],
  filterableFields: ["isActive", "branchId"],
  orderableFields: ["createdAt", "updatedAt"],
  relations: { branch: true },
  dateFields: { createdAt: "createdAt", updatedAt: "updatedAt" },
  select: {
    branch: {
      id: true,
      name: true,
      address: true,
      latitude: true,
      longitude: true,
      radius: true,
      isActive: true,
    },
  },
};

export default employeeQueryConfig;
