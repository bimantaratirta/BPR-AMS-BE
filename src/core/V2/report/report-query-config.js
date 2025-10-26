const reportQueryConfig = {
  searchableFields: ["lo.name"],
  jsonSearchableFields: [{ field: "customer_snapshot", path: ["name"] }],
  filterableFields: ["process", "status"],
  orderableFields: ["created_at", "updated_at"],
  relations: {
    lo: true,
    slo: true,
    am: true,
    customer: true,
    report_photo: true,
    review_customer: true,
    evaluation: { review_evaluation: true },
  },
  dateFields: { created_at: "created_at", updated_at: "updated_at" }, // Penyesuaian nama kolom tanggal
  select: {
    lo: {
      id: true,
      name: true,
      username: true,
    },
    slo: {
      id: true,
      name: true,
      username: true,
    },
    am: {
      id: true,
      name: true,
      username: true,
    },
  },
};

export default reportQueryConfig;
