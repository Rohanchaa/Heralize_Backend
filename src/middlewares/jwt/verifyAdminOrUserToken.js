import jsonwebtoken from "jsonwebtoken";
import config from "../../config/index.js";

const verifyAdminOrUserToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jsonwebtoken.verify(token, config.token.adminSecret, (error, data) => {
      if (error) {
        jsonwebtoken.verify(token, config.token.userSecret, (err, data1) => {
          if (err) {
            return res.status(401).json({
              message: error.message,
              error,
            });
          } else {
            res.locals.user = data1;
            next();
          }
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

export default verifyAdminOrUserToken;
