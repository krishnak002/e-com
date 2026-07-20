import { body } from "express-validator";

const validation = [
  body("name").trim().notEmpty().withMessage("please enter your name"),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("please enter valid email"),
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword()
    .withMessage(
      "please enter stromg password that can contain atlest one capital letter(A-Z),one special symbol,and numbers(1,2,3...) and password must have 8 character",
    ),
];

export default validation;
