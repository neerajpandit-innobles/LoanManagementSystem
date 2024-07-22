import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BankDetailsSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: [true, "Customer ID is required"],
    },
    bankAccountNo: {
        type: String,
        required: [true, "Bank account number is required"],
        match: [/^\d+$/, "Bank account number can only contain digits"],
        minlength: [9, "Bank account number must be at least 9 digits long"],
        maxlength: [18, "Bank account number must be less than 18 digits long"],
    },
    bankName: {
        type: String,
        required: [true, "Bank name is required"],
        trim: true,
        match: [
            /^[A-Za-z\s]+$/,
            "Bank name can only contain alphabetic characters and spaces",
        ],
        minlength: [3, "Bank name must be at least 3 characters long"],
        maxlength: [50, "Bank name must be less than 50 characters long"],
    },
    ifscCode: {
        type: String,
        required: [true, "IFSC code is required"],
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code"],
    },
    branchName: {
        type: String,
        required: [true, "Branch name is required"],
        trim: true,
        match: [
            /^[A-Za-z\s]+$/,
            "Branch name can only contain alphabetic characters and spaces",
        ],
        minlength: [3, "Branch name must be at least 3 characters long"],
        maxlength: [50, "Branch name must be less than 50 characters long"],
    },
    accountHolderName: {
        type: String,
        required: [true, "Account holder name is required"],
        trim: true,
        match: [
            /^[A-Za-z\s]+$/,
            "Account holder name can only contain alphabetic characters and spaces",
        ],
        minlength: [
            3,
            "Account holder name must be at least 3 characters long",
        ],
        maxlength: [
            50,
            "Account holder name must be less than 50 characters long",
        ],
    },
});

export const BankDetails = mongoose.model("BankDetails", BankDetailsSchema);
