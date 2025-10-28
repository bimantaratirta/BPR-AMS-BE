const customerQueryConfig = {
  searchableFields: [
    "name",
    "ktp_number",
    "phone_number",
    "village",
    "address",
  ],
  filterableFields: ["name", "ktp_number", "status"],
  orderableFields: ["id", "name", "created_at", "updated_at"],
  relations: {
    user: true,
    employee: true,
    non_employee: true,
    business: true,
    update_logs: true,
  },
  dateFields: { created_at: "created_at", updated_at: "updated_at" },
  select: {
    user: {
      id: true,
      name: true,
      role: true,
    },
  },
};

export default customerQueryConfig;
