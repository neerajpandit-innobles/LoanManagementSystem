import { CustomerLoan } from "../models/customerLoan.model.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMIDetail } from "../models/emiDetails.model.js";
import { CollateralDetails } from "../models/loanCollateral.model.js";
import mongoose from "mongoose";

//calculateEMI
export const calculateEMI = asyncHandler(async (req, res) => {
    const loanDetails = JSON.parse(req.body.loanDetails);
    const {
        loanType,
        loanAmount,
        interest,
        tenure,
        firstEMIDate,
        latePaymentPenalty,
        collateral,
    } = loanDetails;
    let isUnique = false;
    let loanID;
    while (!isUnique) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        loanID = `LN${randomNumber}`;
        const existingLoan = await CustomerLoan.findOne({ loanID });
        if (!existingLoan) {
            isUnique = true;
        }
    }

    // Calculate interest by monthly
    const intrest = (loanAmount * interest * tenure) / 1200;

    const loanAmountAfterInterest =
        parseFloat(loanAmount) + parseFloat(intrest);
    let monthlyEMI = (loanAmountAfterInterest / tenure).toFixed(2);
    const loanIssueDate = new Date();

    // Create EMI details
    const emiDetails = [];
    let emiDate = new Date(firstEMIDate);
    for (let i = 0; i < tenure; i++) {
        const emiDetail = {
            emiDate: new Date(emiDate),
            emiAmount: monthlyEMI,
            status: "Upcoming",
            submissionDate: null,
            penalty: "No",
            totalAmount: monthlyEMI,
        };
        emiDetails.push(emiDetail);

        // Move to next month
        emiDate.setMonth(emiDate.getMonth() + 1);
    }
    //  console.log(loanAmountAfterInterest)
    res.status(200).json(
        new ApiResponse(200, {
            loanID,
            loanType,
            loanIssueDate,
            loanAmount,
            interest,
            firstEMIDate,
            loanAmountAfterInterest,
            tenure,
            monthlyEMI,
            latePaymentPenalty,
            emiDetails,
            collateral,
        })
    );
});

//loan Issue
export const issueLoan = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { customerIDOrcustomerId } = req.params;
    //console.log(customerIDOrcustomerId)
    let collateralDetails;

    try {
        const loanDetails = JSON.parse(req.body.loanDetails);

        const {
            loanType,
            loanAmount,
            interest,
            tenure,
            firstEMIDate,
            loanIssueDate,
            latePaymentPenalty,
            collateral,
        } = loanDetails; //req.body;

        const customer = await Customer.findOne({
            $or: [
                { customerID: customerIDOrcustomerId },
                { customerId: customerIDOrcustomerId },
            ],
        });
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }
        // Calculate interest by monthly
        const intrest = (loanAmount * interest * tenure) / 1200;

        const loanAmountAfterInterest =
            parseFloat(loanAmount) + parseFloat(intrest);
        let monthlyEMI = (loanAmountAfterInterest / tenure).toFixed(2);
        // Create loan
        const loan = new CustomerLoan({
            loanType,
            loanAmount,
            interest,
            loanAmountAfterInterest,
            tenure,
            monthlyEMI,
            loanIssueDate,
            firstEMIDate,
            latePaymentPenalty,
            customerId: customer._id,
            customerID: customer.customerID,
        });

        await loan.validate();
        await loan.save({ session });

        // Add loan ID to the customer's loans array
        customer.loans.push(loan._id);
        await customer.save({ session });

        // Create EMI details
        const emiDetails = [];
        let emiDate = new Date(firstEMIDate);
        for (let i = 0; i < tenure; i++) {
            const emiDetail = {
                loanId: loan._id,
                emiDate: new Date(emiDate),
                emiAmount: monthlyEMI,
                status: "Upcoming",
                submissionDate: null,
                penalty: "No",
                totalAmount: monthlyEMI,
            };
            emiDetails.push(emiDetail);

            // Move to next month
            emiDate.setMonth(emiDate.getMonth() + 1);
        }

        await EMIDetail.insertMany(emiDetails, { session });

        // Save collateral details if provided

        // console.log('Files:', req.files);
        // console.log('Collateral:', collateral);
        // if (collateral) {
        //     collateralDetails = new CollateralDetails({
        //         loanId: loan._id,
        //         collateral
        //     });
        //     await collateralDetails.save({ session });
        // }
        // Assuming req.files is an array of file objects
        const files = req.files;

        // console.log("Files:", files);
        // console.log("Collateral:", collateral);

        if (collateral && Array.isArray(collateral)) {
            const formattedCollateral = collateral.map((item) => {
                // Find the file object that matches the file name in the collateral item
                const file = files.find((f) => f.originalname === item.file);
                return {
                    text: item.text,
                    file: file ? file.path : "", // Save the file path or an empty string if no file found
                };
            });
            console.log("coll-", formattedCollateral);
            // Create a new CollateralDetails instance
            const collateralDetails = new CollateralDetails({
                loanId: loan._id,
                collateral: formattedCollateral,
            });

            // Save the collateral details to the database
            await collateralDetails.save({ session });
            console.log("Collateral details saved successfully");
        }

        await session.commitTransaction();

        res.status(201).json(
            new ApiResponse(
                201,
                collateralDetails,
                "Loan issued and EMI details saved successfully"
            )
        );
    } catch (error) {
        await session.abortTransaction();
        console.error("Error issuing loan:", error);
        throw new ApiError(500, "An error occurred during loan issuance");
    } finally {
        session.endSession();
    }
});

export const getLoanDetails = asyncHandler(async (req, res) => {
    const { loanId } = req.params;

    // Validate loan ID
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
        throw new ApiError(400, "Invalid loan ID");
    }

    // Fetch loan details using aggregation pipeline
    const loanDetails = await CustomerLoan.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(loanId) } },
        {
            $lookup: {
                from: "emidetails", // Ensure this matches your collection name in the database
                localField: "_id",
                foreignField: "loanId",
                as: "emiDetails",
            },
        },
        {
            $project: {
                _id: 1,
                loanID: 1,
                loanType: 1,
                loanAmount: 1,
                interest: 1,
                loanAmountAfterInterest: 1,
                tenure: 1,
                monthlyEMI: 1,
                firstEMIDate: 1,
                latePaymentPenalty: 1,
                isActive: 1,
                customerID: 1,
                emiDetails: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    if (!loanDetails.length) {
        throw new ApiError(404, "Loan not found");
    }
    console.log(loanDetails);

    // Respond with loan details
    res.status(200).json(
        new ApiResponse(
            200,
            "Loan details retrieved successfully",
            loanDetails[0]
        )
    );
});

// Update Loan Status
export const updateLoanStatus = asyncHandler(async (req, res) => {
    const { loanID } = req.params;
    const { isActive } = req.body; // Assuming you pass the status in the request body

    // Validate request body fields
    if (typeof isActive !== "boolean") {
        throw new ApiError(
            400,
            "isActive field is required and should be a boolean"
        );
    }

    // Find the loan by loanID
    const loan = await CustomerLoan.findOne({ loanID });
    if (!loan) {
        throw new ApiError(404, "Loan not found");
    }

    // Update the loan status
    loan.isActive = isActive;
    await loan.save();

    // Respond with success message and updated document
    res.status(200).json(
        new ApiResponse(200, "Loan status updated successfully", loan)
    );
});

// Controller function to update EMI status
export const updateEMIStatus = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const { status, submissionDate } = req.body;

        // Find the EMI detail by ID
        const emiDetail = await EMIDetail.findById(id);
        console.log(emiDetail);
        if (!emiDetail) {
            return res.status(404).json({ message: "EMI detail not found" });
        }
        console.log("Before", emiDetail.status);
        emiDetail.status = "Paid";
        // (emiDetail.status = status),
        console.log("After", emiDetail.status);
        emiDetail.submissionDate = submissionDate || new Date();

        // Update the status and submission date if the status is 'Paid'
        // if (status === 'Paid') {
        //     emiDetail.status = 'Paid';
        //     emiDetail.submissionDate = submissionDate || new Date();
        // } else {
        //     return res.status(400).json({ message: 'Invalid status update' });
        // }

        // Save the updated EMI detail
        await emiDetail.save();
        console.log("After", emiDetail.status);
        res.status(200).json({
            message: "EMI status updated successfully",
            emiDetail,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the EMI status",
            error,
        });
    }
};

export const updateEMIOverdueStatus = async () => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Update documents where the emiDate is past and status is not already 'Overdue'
        const result = await EMIDetail.updateMany(
            {
                emiDate: { $lt: currentDate }, // Compare emiDate with the current date
                status: { $ne: "Overdue" },
            },
            {
                $set: {
                    status: "Overdue",
                    penalty: "Yes", 
                    // You can also update penalty amount here if needed, e.g., penaltyAmount: <value>
                },
            }
        );

        console.log(
            `Updated ${result.nModified} EMIDetails to Overdue with penalty`
        );
    } catch (error) {
        console.error("Error updating EMI status and penalty:", error);
    }
};
