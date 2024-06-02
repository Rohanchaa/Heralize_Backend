import express from "express";
import controller from "../controllers/UserController.js";
import UserRegister from "../middlewares/validators/UserRegister.js";
import validate from "../middlewares/validators/index.js";
import verifyAdminOrUserToken from "../middlewares/jwt/verifyAdminOrUserToken.js";
import verifyAdminToken from "../middlewares/jwt/verifyAdminToken.js";

const route = express.Router();

route.post("/register", UserRegister(), validate, controller.register);
route.post("/login", controller.login);
route.put(
  "/change-password",
  verifyAdminOrUserToken,
  controller.updatePassword
);

route.delete("/:_id", verifyAdminToken, controller.destroy);

export default route;
