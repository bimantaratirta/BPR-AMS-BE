const reportQueryConfig = {
  searchableFields: ['status', 'process'],
  filterableFields: ['status', 'process'],
  orderableFields: ['created_at', 'updated_at'],
  relations: {
    lo: true,
    slo: true,
    am: true,
    customer: true,
    report_photo: true,
  },
  dateFields: { created_at: 'created_at', updated_at: 'updated_at' },
};

export default reportQueryConfig;
