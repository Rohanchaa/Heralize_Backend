import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = "mongodb://localhost:27017/heralize";

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 8000;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISADMIN = process.env.SERVER_TOKEN_ISADMIN || "isAdmin";
const SERVER_TOKEN_ISUSER = process.env.SERVER_TOKEN_ISNURSE || "isUser";

const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencrypt";

const SERVER_TOKEN_ADMIN_SECRET =
  process.env.SERVER_TOKEN_ADMIN_SECRET || "adminKey";

const SERVER_TOKEN_USER_SECRET =
  process.env.SERVER_TOKEN_USER_SECRET || "userKey";

const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: SERVER_PORT,
  },
  token: {
    expireTime: SERVER_TOKEN_EXPIRETIME,
    isAdmin: SERVER_TOKEN_ISADMIN,
    isUser: SERVER_TOKEN_ISUSER,
    secret: SERVER_TOKEN_SECRET,
    adminSecret: SERVER_TOKEN_ADMIN_SECRET,
    userSecret: SERVER_TOKEN_USER_SECRET,
  },
};

export default config;
