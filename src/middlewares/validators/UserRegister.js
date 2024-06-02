import { body } from "express-validator";
import User from "../../models/User.js";

const UserRegister = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .bail()
      .isLength({ min: 3 })
      .withMessage("Name must have at least 3 characters"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Invalid email format")
      .bail()
      .custom(async (value) => {
        const user = await User.findOne({ email: value });

        if (user) {
          return Promise.reject("User with this email already exists");
        }
      })
      .bail()
      .custom(async (value) => {
        if (!value.endsWith("@heraldcollege.edu.np")) {
          return Promise.reject("Email must be under college domain");
        }
      }),
    body("contact_number")
      .notEmpty()
      .withMessage("Contact number is required")
      .bail()
      .isLength({ min: 10, max: 10 })
      .withMessage("Contact number must have 10 digits"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 characters"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("type").notEmpty().withMessage("User type is required"),
    body("confirm_password")
      .notEmpty()
      .withMessage("Confirm password is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .bail()
      .custom((value, { req }) => {
        const { password } = req.body;

        if (password !== value) {
          throw new Error("Passwords must match");
        }
        return true;
      }),
  ];
};

export default UserRegister;
