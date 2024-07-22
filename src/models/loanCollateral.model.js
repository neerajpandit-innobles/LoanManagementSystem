import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CollateralDetailsSchema = new Schema(
    {
        loanId: {
            type: Schema.Types.ObjectId,
            ref: "CustomerLoan",
            required: [true, "Loan ID is required"],
        },
        collateral: [
            {
                text: {
                    type: String,
                    required: [true, "Collateral description is required"],
                    trim: true,
                    minlength: [
                        1,
                        "Collateral description must be at least 1 character long",
                    ],
                    maxlength: [
                        500,
                        "Collateral description cannot exceed 500 characters",
                    ],
                },
                file: {
                    type: String,
                    required: [true, "Collateral file is required"],
                    match: [
                        /^(?:[a-zA-Z0-9\s_\\.\-():])+$/,
                        "File name contains invalid characters",
                    ], // Example regex for allowed characters
                    minlength: [
                        1,
                        "File name must be at least 1 character long",
                    ],
                    maxlength: [255, "File name cannot exceed 255 characters"],
                },
            },
        ],
    },
    { timestamps: true }
);

export const CollateralDetails = mongoose.model(
    "CollateralDetails",
    CollateralDetailsSchema
);
