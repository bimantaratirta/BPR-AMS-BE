const branchQueryConfig = {
  searchableFields: ["name"],
  filterableFields: ["isActive"],
  orderableFields: ["createdAt", "updatedAt"],
  relations: { _count: { select: { employees: true } } },
  dateFields: { createdAt: "createdAt", updatedAt: "updatedAt" },
};

export default branchQueryConfig;
