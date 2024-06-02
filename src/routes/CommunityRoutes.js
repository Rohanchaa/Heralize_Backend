import express from "express";
import controller from "../controllers/CommunityController.js";
import CommunityAdd from "../middlewares/validators/CommunityAdd.js";
import validate from "../middlewares/validators/index.js";
import verifyAdminToken from "../middlewares/jwt/verifyAdminToken.js";
import verifyUserSecret from "../middlewares/jwt/verifyUserToken.js";
import verifyAdminOrUserToken from "../middlewares/jwt/verifyAdminOrUserToken.js";

const route = express.Router();

route
  .route("")
  .post(verifyAdminToken, CommunityAdd(), validate, controller.store)
  .get(controller.get);

route
  .route("/Request")
  .post(
    verifyAdminOrUserToken,
    CommunityAdd(),
    validate,
    controller.storeCommunityRequest
  )
  .get(controller.getCommunityRequest);
route.route("/find/:_id").get(verifyAdminOrUserToken, controller.find);

route.get(
  "/joined-communities",
  verifyAdminOrUserToken,
  controller.getMyCommunities
);

route.post("/join/:_id", verifyAdminOrUserToken, controller.joinCommunity);
route.post("/leave/:_id", verifyAdminOrUserToken, controller.leaveCommunity);

export default route;
