import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the EmploymentStatusSchema
export const EmploymentStatusSchema = new Schema({
    type: {
        type: String,
        enum: ["Salary", "Government", "Private", "Business"],
        required: [true, "Employment type is required"],
    },
    organizationName: {
        type: String,
        required: [true, "Organization name is required"],
        trim: true,
        minlength: [2, "Organization name must be at least 2 characters long"],
        maxlength: [
            100,
            "Organization name must be less than 100 characters long",
        ],
    },
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        minlength: [2, "Job title must be at least 2 characters long"],
        maxlength: [100, "Job title must be less than 100 characters long"],
    },
    designation: {
        type: String,
        required: [true, "Designation is required"],
        trim: true,
        minlength: [2, "Designation must be at least 2 characters long"],
        maxlength: [100, "Designation must be less than 100 characters long"],
    },
    joiningDate: {
        type: Date,
        required: [true, "Joining date is required"],
        validate: {
            validator: function (value) {
                return value instanceof Date && !isNaN(value.valueOf());
            },
            message: "Joining date must be a valid date",
        },
    },
    salarySlip: {
        type: String,
        match: [
            /^.*\.(jpg|jpeg|png|pdf)$/,
            "Salary slip must be a valid image or PDF file (jpg, jpeg, png, pdf)",
        ],
    },
    currentOrLastAnnualSalary: {
        type: Number,
        required: [true, "Current or last annual salary is required"],
        min: [0, "Salary must be a positive number"],
    },
});
