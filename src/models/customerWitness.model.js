import mongoose from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema(
    {
        street: {
            type: String,
            required: [true, "Street is required"],
            trim: true,
            minlength: [3, "Street must be at least 3 characters long"],
            maxlength: [100, "Street must be less than 100 characters long"],
        },
        locality: {
            type: String,
            required: [true, "Locality is required"],
            trim: true,
            minlength: [3, "Locality must be at least 3 characters long"],
            maxlength: [100, "Locality must be less than 100 characters long"],
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
            minlength: [2, "State must be at least 2 characters long"],
            maxlength: [50, "State must be less than 50 characters long"],
        },
        district: {
            type: String,
            required: [true, "District is required"],
            trim: true,
            minlength: [2, "District must be at least 2 characters long"],
            maxlength: [50, "District must be less than 50 characters long"],
        },
        pin: {
            type: String,
            required: [true, "PIN code is required"],
            match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code"],
        },
    },
    { _id: false }
);

const customerWitnessSchema = new Schema(
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
        currentAddress: {
            type: addressSchema,
            required: [true, "Current address is required"],
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer ID is required"],
        },
    },
    { timestamps: true }
);

export const CustomerWitness = mongoose.model(
    "CustomerWitness",
    customerWitnessSchema
);
