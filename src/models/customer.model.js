import mongoose from "mongoose";
const { Schema } = mongoose;
import { EmploymentStatusSchema } from "./employmentStatus.model.js";

const addressSchema = new Schema(
    {
        street: {
            type: String,
            required: [true, "Street is required"],
            trim: true,
            minlength: [3, "Street must be at least 3 characters long"],
            maxlength: [50, "Street must be less than 50 characters long"],
        },
        locality: {
            type: String,
            required: [true, "Locality is required"],
            trim: true,
            minlength: [3, "Locality must be at least 3 characters long"],
            maxlength: [50, "Locality must be less than 50 characters long"],
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
            minlength: [3, "State must be at least 3 characters long"],
            maxlength: [50, "State must be less than 50 characters long"],
        },
        district: {
            type: String,
            required: [true, "District is required"],
            trim: true,
            minlength: [3, "District must be at least 3 characters long"],
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

const customerSchema = new Schema(
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
        fatherName: {
            type: String,
            required: [true, "Father's name is required"],
            trim: true,
            match: [
                /^[A-Za-z\s]+$/,
                "Father's name can only contain alphabetic characters and spaces",
            ],
            minlength: [3, "Father's name must be at least 3 characters long"],
            maxlength: [
                50,
                "Father's name must be less than 50 characters long",
            ],
        },
        motherName: {
            type: String,
            required: [true, "Mother's name is required"],
            trim: true,
            match: [
                /^[A-Za-z\s]+$/,
                "Mother's name can only contain alphabetic characters and spaces",
            ],
            minlength: [3, "Mother's name must be at least 3 characters long"],
            maxlength: [
                50,
                "Mother's name must be less than 50 characters long",
            ],
        },
        maritalStatus: {
            type: String,
            enum: ["yes", "no"],
            required: [true, "Marital status is required"],
        },
        spouseName: {
            type: String,
            required: function () {
                return this.maritalStatus === "yes";
            },
            trim: true,
            match: [
                /^[A-Za-z\s]+$/,
                "Spouse's name can only contain alphabetic characters and spaces",
            ],
            minlength: [3, "Spouse's name must be at least 3 characters long"],
            maxlength: [
                50,
                "Spouse's name must be less than 50 characters long",
            ],
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
        permanentAddress: {
            type: addressSchema,
            required: [true, "Permanent address is required"],
        },
        avatar: {
            type: String,
            trim: true,
            match: [
                /^.*\.(jpg|jpeg|png)$/,
                "Avatar must be a valid image file (jpg, jpeg, png)",
            ],
        },
        nominee: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomerNominee",
            },
        ],
        witness: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomerWitness",
            },
        ],
        loans: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CustomerLoan",
            },
        ],
        customerID: {
            type: String,
            unique: true,
            required: true,
            match: [/^LMS\d{6}$/, "Customer ID must be a valid LMS ID"],
        },
        employmentStatus: {
            type: EmploymentStatusSchema,
            // required: [true, "Employment status is required"]
        },
    },
    { timestamps: true }
);

customerSchema.pre("validate", async function (next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            this.customerID = `LMS${randomNumber}`;

            const existingCustomer = await mongoose.models.Customer.findOne({
                customerID: this.customerID,
            });
            if (!existingCustomer) {
                isUnique = true;
            }
        }
    }
    next();
});

export const Customer = mongoose.model("Customer", customerSchema);
