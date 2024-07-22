import mongoose from "mongoose";
const { Schema } = mongoose;

const customerLoanSchema = new Schema(
    {
        loanID: {
            type: String,
            required: [true, "Loan ID is required"],
            unique: [true, "Loan ID must be unique"],
            match: [
                /^LN\d{6}$/,
                "Loan ID must be in the format 'LN' followed by a 6-digit number",
            ],
            minlength: [8, "Loan ID must be at least 8 characters long"],
            maxlength: [8, "Loan ID must be at most 8 characters long"],
        },
        loanType: {
            type: String,
            enum: [
                "Personal Loan",
                "Mortgages Loan",
                "Home Equity Loan",
                "Auto Loan",
            ],
            required: [true, "Loan type is required"],
        },
        loanAmount: {
            type: Number,
            required: [true, "Loan amount is required"],
            min: [0, "Loan amount must be a positive number"],
            max: [1000000000, "Loan amount cannot exceed 1 billion"], // Example upper limit
        },
        interest: {
            type: Number,
            required: [true, "Interest rate is required"],
            min: [0, "Interest rate must be a positive number"],
            max: [100, "Interest rate cannot exceed 100%"],
        },
        loanAmountAfterInterest: {
            type: Number,
            required: [true, "Loan amount after interest is required"],
            min: [0, "Loan amount after interest must be a positive number"],
        },
        tenure: {
            type: Number,
            required: [true, "Loan tenure is required"],
            min: [1, "Loan tenure must be at least 1 month"],
            max: [360, "Loan tenure cannot exceed 360 months"], // Example upper limit for tenure in months
        },
        monthlyEMI: {
            type: Number,
            required: [true, "Monthly EMI is required"],
            min: [0, "Monthly EMI must be a positive number"],
        },
        firstEMIDate: {
            type: Date,
            required: [true, "First EMI date is required"],
            validate: {
                validator: function (value) {
                    return value > new Date(); // Ensures the first EMI date is in the future
                },
                message: "First EMI date must be in the future",
            },
        },
        loanIssueDate: {
            type: Date,
            required: [true, "Loan issue date is required"],
        },
        latePaymentPenalty: {
            type: Number,
            required: [true, "Late payment penalty is required"],
            min: [0, "Late payment penalty must be a positive number"],
        },
        isActive: {
            type: Boolean,
            default: true, // Assuming loans are active when created
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: [true, "Customer reference is required"],
        },
        customerID: {
            type: String,
            required: [true, "Customer ID is required"],
        },
    },
    { timestamps: true }
);

// Pre-validate hook to generate unique loanID
customerLoanSchema.pre("validate", async function (next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            this.loanID = `LN${randomNumber}`;

            const existingLoan = await mongoose
                .model("CustomerLoan")
                .findOne({ loanID: this.loanID });
            if (!existingLoan) {
                isUnique = true;
            }
        }
    }
    next();
});

export const CustomerLoan = mongoose.model("CustomerLoan", customerLoanSchema);
