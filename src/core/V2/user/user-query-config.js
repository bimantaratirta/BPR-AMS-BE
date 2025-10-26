const userQueryConfig = {
  searchableFields: ["name", "role"],
  filterableFields: ["role", "branch_id", "region_id"],
  orderableFields: ["created_at", "updated_at"],
  relations: {
    region: { branches: true },
    branch: true,
  },
  dateFields: {
    created_at: "created_at",
    updated_at: "updated_at",
  },
};

export default userQueryConfig;
