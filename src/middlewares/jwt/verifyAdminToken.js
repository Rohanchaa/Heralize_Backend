import jsonwebtoken from "jsonwebtoken";
import config from "../../config/index.js";

const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jsonwebtoken.verify(token, config.token.adminSecret, (error, data) => {
      if (error) {
        return res.status(401).json({
          message: error.message,
          error,
        });
      } else {
        res.locals.user = data;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
};

export default verifyAdminToken;
