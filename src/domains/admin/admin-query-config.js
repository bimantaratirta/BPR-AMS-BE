const adminQueryConfig = {
  searchableFields: ["name"],
  filterableFields: ["status", "role"],
  orderableFields: ["createdAt", "updatedAt"],
  dateFields: { createdAt: "createdAt", updatedAt: "updatedAt" },
};

export default adminQueryConfig;
