import express from "express";
import controller from "../controllers/ReportedUserController.js";
import verifyAdminOrUserToken from "../middlewares/jwt/verifyAdminOrUserToken.js";
import verifyAdminToken from "../middlewares/jwt/verifyAdminToken.js";

const route = express.Router();

route
  .route("")
  .post(verifyAdminOrUserToken, controller.store)
  .get(verifyAdminToken, controller.get);

route.delete("/:_id", verifyAdminToken, controller.destroy);

export default route;
