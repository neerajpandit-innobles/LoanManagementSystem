import mongoose from "mongoose";
const { Schema } = mongoose;

const customerNomineeSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            match: [
                /^[A-Za-z\s]+$/,
                "Full name can only contain alphabetic characters and spaces",
            ],
            minlength: [3, "Full name must be at least 3 characters long"],
            maxlength: [50, "Full name must be less than 50 characters long"],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: [true, "Gender is required"],
        },
        dob: {
            type: Date,
            required: [true, "Date of birth is required"],
            validate: {
                validator: function (value) {
                    return value instanceof Date && !isNaN(value.valueOf());
                },
                message: "Date of birth must be a valid date",
            },
        },
        relation: {
            type: String,
            required: [true, "Relation is required"],
            trim: true,
            match: [
                /^[A-Za-z\s]+$/,
                "Relation can only contain alphabetic characters and spaces",
            ],
            minlength: [3, "Relation must be at least 3 characters long"],
            maxlength: [50, "Relation must be less than 50 characters long"],
        },
        phoneNo: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer ID is required"],
        },
    },
    { timestamps: true }
);

export const CustomerNominee = mongoose.model(
    "CustomerNominee",
    customerNomineeSchema
);
