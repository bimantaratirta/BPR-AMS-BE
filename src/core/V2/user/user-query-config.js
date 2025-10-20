const userQueryConfig = {
  searchableFields: ["name"],
  filterableFields: ["role", "supervisor_id", "status"],
  orderableFields: ["id", "name", "email", "created_at", "updated_at"],
  relations: {
    // Add any relations if required, like 'user', 'employee', etc.
  },
  dateFields: {
    created_at: "created_at",
    updated_at: "updated_at",
  },
  select: {
    id: true,
    name: true,
    username: true,
    email: true,
    region_id: true,
    branch_id: true,
    supervisor_id: true,
    role: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  },
};

export default userQueryConfig;
