import cron from "node-cron";
import attendanceService from "./attendance-service.js";

class AttendanceJob {
  start() {
    cron.schedule(
      "0 16 * * *",
      async () => {
        console.log("Running auto absent generation...");
        try {
          await attendanceService.generateAutoAbsent();
          console.log("Auto absent success");
        } catch (err) {
          console.error("Auto absent error:", err);
        }
      },
      {
        timezone: "UTC",
      },
    );
    cron.schedule(
      "0 16 * * *",
      async () => {
        console.log("Running auto checkout...");
        try {
          await attendanceService.generateAutoCheckout();
          console.log("Auto checkout success");
        } catch (err) {
          console.error("Auto checkout error:", err);
        }
      },
      { timezone: "UTC" },
    );
  }
}

export default new AttendanceJob();
