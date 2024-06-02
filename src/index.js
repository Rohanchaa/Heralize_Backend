import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/index.js";
import http from "http";
import path, { dirname } from "path";

import { fileURLToPath } from "url";

import userRoutes from "./routes/UserRoutes.js";
import communityRoutes from "./routes/CommunityRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import reportRoutes from "./routes/ReportedPostRoutes.js";
import joinRoutes from "./routes/JoinRequestRoutes.js";
import reportUserRoutes from "./routes/ReportedUserRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());

mongoose
  .connect(config.mongo.url, { retryWrites: true })
  .then(() => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const directory = path.join(__dirname, "../public");
    app.use(express.static(directory));

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method == "OPTIONS") {
        res.header(
          "Access-Control-Allow-Method",
          "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
      }
      next();
    });

    app.use("/api/user", userRoutes);
    app.use("/api/community", communityRoutes);
    app.use("/api/post", postRoutes);
    app.use("/api/report-post", reportRoutes);
    app.use("/api/report-user", reportUserRoutes);
    app.use("/api/join-request", joinRoutes);

    http.createServer(app).listen(config.server.port, () => {
      console.log("server running on " + config.server.port);
    });
  })
  .catch((err) => {
    console.log("err during connection", err);
  });
