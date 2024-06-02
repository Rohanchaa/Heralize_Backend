import express from "express";
import controller from "../controllers/PostController.js";
import verifyUserSecret from "../middlewares/jwt/verifyUserToken.js";
import PostAdd from "../middlewares/validators/PostAdd.js";
import validate from "../middlewares/validators/index.js";
import verifyAdminOrUserToken from "../middlewares/jwt/verifyAdminOrUserToken.js";

const route = express.Router();

route
  .route("/:_id")
  .get(verifyAdminOrUserToken, controller.find)
  .delete(verifyAdminOrUserToken, controller.destroy)
  .put(verifyAdminOrUserToken, controller.update);

route.get("/community/:_id", verifyAdminOrUserToken, controller.getByCommunity);

route
  .route("")
  .get(verifyAdminOrUserToken, controller.get)
  .post(verifyAdminOrUserToken, PostAdd(), validate, controller.store);

route.post("/like", verifyAdminOrUserToken, controller.likePost);
route.post("/dislike", verifyAdminOrUserToken, controller.dislikePost);
route.post("/add-comment", verifyAdminOrUserToken, controller.addComment);

route.delete("/comment/:_id", verifyAdminOrUserToken, controller.deleteComment);

export default route;
