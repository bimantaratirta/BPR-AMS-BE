const reportQueryConfig = {
  searchableFields: ["status", "process"], // Kolom yang bisa dicari
  filterableFields: ["status", "process"], // Kolom yang bisa difilter
  orderableFields: ["created_at", "updated_at"], // Kolom yang bisa diurutkan
  relations: {
    // Relasi yang akan di-include
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
      username: true, // Pilih hanya kolom yang diinginkan
    },
    slo: {
      id: true,
      name: true,
      username: true, // Pilih hanya kolom yang diinginkan
    },
    am: {
      id: true,
      name: true,
      username: true, // Pilih hanya kolom yang diinginkan
    },
    // Anda dapat menambahkan pilihan select untuk relasi lain jika perlu
  },
};

export default reportQueryConfig;
