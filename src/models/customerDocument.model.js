import mongoose from "mongoose";

const Schema = mongoose.Schema;

const customerDocumentsSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer reference is required"],
        },
        AadharCard: {
            number: {
                type: String,
                required: [true, "Aadhar card number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "Aadhar card number can only contain alphanumeric characters",
                ],
                minlength: [
                    12,
                    "Aadhar card number must be at least 12 characters long",
                ],
                maxlength: [
                    12,
                    "Aadhar card number must be at most 12 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "Aadhar card file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "Aadhar card file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "Aadhar card file path must be less than 255 characters long",
                ],
            },
        },
        PANCard: {
            number: {
                type: String,
                required: [true, "PAN card number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "PAN card number can only contain alphanumeric characters",
                ],
                minlength: [
                    10,
                    "PAN card number must be at least 10 characters long",
                ],
                maxlength: [
                    10,
                    "PAN card number must be at most 10 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "PAN card file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "PAN card file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "PAN card file path must be less than 255 characters long",
                ],
            },
        },
        VoterID: {
            number: {
                type: String,
                required: [true, "Voter ID number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "Voter ID number can only contain alphanumeric characters",
                ],
                minlength: [
                    10,
                    "Voter ID number must be at least 10 characters long",
                ],
                maxlength: [
                    10,
                    "Voter ID number must be at most 10 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "Voter ID file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "Voter ID file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "Voter ID file path must be less than 255 characters long",
                ],
            },
        },
        DrivingLicense: {
            number: {
                type: String,
                required: [true, "Driving license number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "Driving license number can only contain alphanumeric characters",
                ],
                minlength: [
                    15,
                    "Driving license number must be at least 15 characters long",
                ],
                maxlength: [
                    15,
                    "Driving license number must be at most 15 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "Driving license file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "Driving license file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "Driving license file path must be less than 255 characters long",
                ],
            },
        },
        Passport: {
            number: {
                type: String,
                required: [true, "Passport number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "Passport number can only contain alphanumeric characters",
                ],
                minlength: [
                    9,
                    "Passport number must be at least 9 characters long",
                ],
                maxlength: [
                    12,
                    "Passport number must be at most 9 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "Passport file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "Passport file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "Passport file path must be less than 255 characters long",
                ],
            },
        },
        ITRNo: {
            number: {
                type: String,
                required: [true, "ITR number is required"],
                match: [
                    /^[A-Za-z0-9]+$/,
                    "ITR number can only contain alphanumeric characters",
                ],
                minlength: [
                    10,
                    "ITR number must be at least 10 characters long",
                ],
                maxlength: [
                    15,
                    "ITR number must be at most 10 characters long",
                ],
            },
            file: {
                type: String,
                required: [true, "ITR file is required"],
                match: [
                    /^.*\.(jpg|jpeg|png|pdf)$/,
                    "ITR file must be a valid image or PDF file (jpg, jpeg, png, pdf)",
                ],
                maxlength: [
                    255,
                    "ITR file path must be less than 255 characters long",
                ],
            },
        },
    },
    { timestamps: true }
);

export const CustomerDocuments = mongoose.model(
    "CustomerDocuments",
    customerDocumentsSchema
);
