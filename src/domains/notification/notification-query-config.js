const notificationQueryConfig = {
  searchFields: ["title", "message"],
  filterFields: {
    type: { field: "type", operator: "equals" },
    isRead: { field: "isRead", operator: "equals", transform: (v) => v === "true" },
    employeeId: { field: "employeeId", operator: "equals" },
  },
  sortFields: ["created_at", "updated_at"],
  defaultSort: [{ created_at: "desc" }],
  includeRelations: {
    employee: {
      select: { id: true, name: true, nik: true },
    },
  },
};

export default notificationQueryConfig;
