import express from "express";
import controller from "../controllers/JoinRequestController.js";
import verifyAdminOrUserToken from "../middlewares/jwt/verifyAdminOrUserToken.js";
import verifyAdminToken from "../middlewares/jwt/verifyAdminToken.js";

const route = express.Router();

route.post("", verifyAdminOrUserToken, controller.store);
route.get("", verifyAdminToken, controller.get);
route.post("/accept/:id", verifyAdminToken, controller.acceptRequest);
route.post("/reject/:id", verifyAdminToken, controller.rejectRequest);

export default route;
