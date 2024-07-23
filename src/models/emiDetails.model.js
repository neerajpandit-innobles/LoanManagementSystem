import mongoose from "mongoose";
const { Schema } = mongoose;

const emiDetailSchema = new Schema(
    {
        loanId: {
            type: Schema.Types.ObjectId,
            ref: "CustomerLoan",
            required: [true, "Loan ID is required"],
        },
        emiDate: {
            type: Date,
            required: [true, "EMI date is required"],
            validate: {
                validator: function (value) {
                    return value >= new Date(); // Ensures the EMI date is in the future or today
                },
                message: "EMI date must be today or in the future",
            },
        },
        emiAmount: {
            type: Number,
            required: [true, "EMI amount is required"],
            min: [0, "EMI amount must be a positive number"],
        },
        status: {
            type: String,
            enum: ["Paid", "Upcoming","Overdue"],
            default: "Upcoming",
            required: [true, "Status is required"],
        },
        submissionDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value || value <= new Date(); // Allows null/undefined or date up to today
                },
                message: "Submission date must be today or in the past",
            },
        },
        penalty: {
            type: String,
            enum: ["Yes", "No"],
            required: [true, "Penalty status is required"],
        },
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
            min: [0, "Total amount must be a positive number"],
        },
    },
    { timestamps: true }
);

export const EMIDetail = mongoose.model("EMIDetail", emiDetailSchema);
