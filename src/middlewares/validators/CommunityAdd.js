import { body } from "express-validator";

const CommunityAdd = () => {
  return [
    body("name").notEmpty().withMessage("Community name is required"),
    body("description")
      .notEmpty()
      .withMessage("Community description is required"),
  ];
};

export default CommunityAdd;
