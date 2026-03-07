const branchQueryConfig = {
  searchableFields: ["name"],
  filterableFields: ["isActive"],
  orderableFields: ["createdAt", "updatedAt"],
  relations: {},
  dateFields: { createdAt: "createdAt", updatedAt: "updatedAt" },
};

export default branchQueryConfig;
