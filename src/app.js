import "dotenv/config";

import { __dirname, __filename } from "./utils/path.js";

import apicache from "apicache";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middlewares/error-handler-middleware.js";
import express from "express";
import helmet from "helmet";
import logger from "./utils/logger.js";
import multer from "multer";
import path from "path";
import morgan from "morgan";

import BaseError from "./base_classes/base-error.js";
import router from "./routes.js";
import corsMiddleware from "./middlewares/cors-middleware.js";
import attendanceJob from "./domains/attendance/attendance.job.js";

class ExpressApplication {
  app;
  fileStorage;
  fileFilter;
  constructor(port) {
    this.app = express();
    this.port = port;

    this.app.use(express.json({ type: "application/json" }));

    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(corsMiddleware);

    //  __init__
    this.configureAssets();
    this.setupRoute();
    this.setupMiddlewares([
      errorHandler,
      express.json(),
      express.urlencoded(),
      apicache.middleware("5 minutes"),
    ]);
    this.setupLibrary([
      process.env.NODE_ENV === "development" ? morgan("dev") : "",
      compression(),
      helmet(),
      // cors(),
    ]);

    this.fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
      },
    });
    this.fileFilter = (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
    this.app.use(
      multer({
        storage: this.fileStorage,
        fileFilter: this.fileFilter,
      }).fields([
        {
          name: "image",
          maxCount: 1,
        },
      ]),
    );

    attendanceJob.start();
  }

  setupMiddlewares(middlewaresArr) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  setupRoute() {
    // this.app.use("/api/v1/menu", menuRoutes);

    // this.app.use("/api/v1/auth", authRoutes);
    // this.app.use("/api/v1/kssm", KSSMRoutes);
    // this.app.use("/api/v1/kss", KSSRoutes);
    // this.app.use("/api/v1/pinek", PINEKRoutes);
    // this.app.use("/api/v1/fleksi", FLEKSIRoutes);
    // this.app.use("/api/v1/procim", PROCIMRoutes);
    // this.app.use("/api/v1/ksm", KSMRoutes);
    // this.app.use("/api/v1/kmsm", KMSMRoutes);
    // this.app.use("/api/v1/krs", KRSRoutes);
    // this.app.use("/api/v1/kmm", KMMRoutes);
    // this.app.use("/api/v1/kms", KMSRoutes);
    // this.app.use("/api/v1/kef", KEFRoutes);
    // this.app.use("/api/v1/kar", KARRoutes);
    // this.app.use("/api/v1/dashboard", dashboardRoutes);

    // this.app.use("/*", () => {
    //   throw BaseError.notFound("Route not found");
    // });
    this.app.get("/hello-world", (req, res) => {
      res.status(200).json({
        message: "Hello World",
      });
    });

    this.app.use("/api/", router);

    this.app.use("/*", () => {
      throw BaseError.notFound("Route not found");
    });
  }

  configureAssets() {
    this.app.use(express.static(path.join(__filename, "public")));
  }

  setupLibrary(libraries) {
    libraries.forEach((library) => {
      if (library != "" && library != null) {
        this.app.use(library);
      }
    });
  }

  start() {
    return this.app.listen(this.port, () => {
      logger.info(`Application running on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
