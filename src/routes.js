import express from "express";

// V1
import AuthRoutes from "./domains/auth/auth-routes.js";
import BranchRoutes from "./domains/branch/branch-routes.js";
import LeaveRequestRoutes from "./domains/leaveRequest/leaveRequest-routes.js";
import AppsettingsRoutes from "./domains/appSettings/appSettings-routes.js";
import AttandeceRoutes from "./domains/attendance/attendance-routes.js";
import PointRecordRoutes from "./domains/pointRecord/pointRecord-routes.js";
import EmployeeRoutes from "./domains/employee/employee-routes.js";
import AdminRoutes from "./domains/admin/admin-routes.js";
import DashboardRoutes from "./domains/dashboard/dashboard-routes.js";
import NotificationRoutes from "./domains/notification/notification-routes.js";

const router = express.Router();

const appsRoutesV1 = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/branch",
    route: BranchRoutes,
  },
  {
    path: "/leave-requests",
    route: LeaveRequestRoutes,
  },
  {
    path: "/app-settings",
    route: AppsettingsRoutes,
  },
  {
    path: "/attendances",
    route: AttandeceRoutes,
  },
  {
    path: "/point-records",
    route: PointRecordRoutes,
  },
  {
    path: "/employees",
    route: EmployeeRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
];

appsRoutesV1.forEach(({ path, route }) => {
  router.use(`/v1${path}`, route);
});

export default router;
