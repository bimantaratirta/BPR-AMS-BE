const branchQueryConfig = {
  searchableFields: ['branch'],
  filterableFields: ['branch'],
  orderableFields: ['branch'],
  relations: {
    region: true,
  },
  dateFields: { created_at: 'created_at', updated_at: 'updated_at' },
};

export default branchQueryConfig;
