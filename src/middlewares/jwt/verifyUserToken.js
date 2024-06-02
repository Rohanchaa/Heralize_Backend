import jsonwebtoken from "jsonwebtoken";
import config from "../../config/index.js";

const verifyUserSecret = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jsonwebtoken.verify(token, config.token.userSecret, (error, data) => {
      if (error) {
        return res.status(401).json({
          message: "Unauthorized",
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

export default verifyUserSecret;
