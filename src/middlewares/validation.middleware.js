import { body, validationResult } from "express-validator";

export const validateCustomerData = [

    body("customerData.fullName")
        .isLength({ min: 3, max: 12 })
        .withMessage("Full name must be between 3 and 12 characters long"),
    // Add more validation rules as needed
    body("customerData.email").isEmail().withMessage("Invalid email address"),
    //bank validation
    body("bankDetailsData.ifscCode")
        .isString()
        .trim()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .withMessage(
            "IFSC code must be in the format ABCD0XXXXX, where ABCD are letters and XXXXX are letters or digits"
        ),
];

export const validateBody = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            errors: errors.array(),
        });
    }
    next();
};
