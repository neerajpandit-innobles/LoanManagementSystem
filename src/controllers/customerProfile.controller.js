import { Customer } from '../models/customer.model.js';
import { CustomerLoan } from '../models/customerLoan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';


// Get all customers with loan details
export const getAllCustomersWithLoanDetails1 = asyncHandler(async (req, res) => {
  // Fetch all customers
  const customers = await Customer.find({});

  // Prepare array to hold formatted customer data
  let customersWithLoanDetails = [];

  // Loop through each customer and fetch loan statistics
  for (let customer of customers) {
    const customerId = customer._id;

    // Fetch loan statistics for the customer
    const totalLoans = await CustomerLoan.countDocuments({ customerId });
    const activeLoans = await CustomerLoan.countDocuments({ customerId, isActive: true });
    const completedLoans = await CustomerLoan.countDocuments({ customerId, isActive: false });



    // Determine loan status based on active loans count
    let loanStatus = 'No loans';
    if (activeLoans > 0) {
      loanStatus = 'Active';
    } else if (completedLoans > 0) {
      loanStatus = 'Completed';
    }

    // Prepare formatted customer data with loan details
    const customerWithLoanDetails = {
      customerId: customer._id,
      name: customer.fullName,
      customerID: customer.customerID,
      gender: customer.gender,
      dob: customer.dob,
      fathersName: customer.fatherName,
      registrationDate: customer.createdAt, // Assuming registration date is createdAt
      loanStatistics: {
        totalLoans,
        activeLoans,
        completedLoans
      },
      loanStatus
    };

    customersWithLoanDetails.push(customerWithLoanDetails);
  }

  const apiResponse = new ApiResponse({
    message: 'All customers with loan details retrieved successfully',
    data: customersWithLoanDetails
  });

  res.status(200).json(apiResponse);
});


export const getAllCustomersWithLoanDetails = asyncHandler(async (req, res) => {
  try {
    // Fetch all customers
    const customers = await Customer.find({});

    // Prepare array to hold formatted customer data
    let customersWithLoanDetails = [];

    // Loop through each customer and fetch loan statistics
    for (let customer of customers) {
      const customerId = customer._id;

      // Fetch all loans for the customer
      const loans = await CustomerLoan.find({ customerId });

      // Fetch loan statistics for the customer
      const totalLoans = loans.length;
      const activeLoans = loans.filter(loan => loan.isActive).length;
      const completedLoans = loans.filter(loan => !loan.isActive).length;

      // Map loans to include loanId
      const loanDetails = loans.map(loan => ({
        loanId: loan._id,
        loanID: loan.loanID,
        amount: loan.amount,
        isActive: loan.isActive
        // Add other fields as needed
      }));

      // Determine loan status based on active loans count
      let loanStatus = 'No loans';
      if (activeLoans > 0) {
        loanStatus = 'Active';
      } else if (completedLoans > 0) {
        loanStatus = 'Completed';
      }

      // Prepare formatted customer data with loan details
      const customerWithLoanDetails = {
        customerId: customer._id,
        name: customer.fullName,
        customerID: customer.customerID,
        gender: customer.gender,
        dob: customer.dob,
        fathersName: customer.fatherName,
        registrationDate: customer.createdAt, // Assuming registration date is createdAt
        loanStatistics: {
          totalLoans,
          activeLoans,
          completedLoans
        },
        loanStatus,
        loans: loanDetails // Include all loan details for the customer
      };

      customersWithLoanDetails.push(customerWithLoanDetails);
    }

    const apiResponse = new ApiResponse({
      message: 'All customers with loan details retrieved successfully',
      data: customersWithLoanDetails
    });

    res.status(200).json(apiResponse);
  } catch (error) {
    console.error('Error retrieving customers with loan details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export const getCustomerDetails = asyncHandler(async (req, res) => {
    const { customerId } = req.params;

    // Validate customer ID
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
        throw new ApiError(400, "Invalid customer ID");
    }

    // Fetch customer details using aggregation pipeline
    const customerDetails = await Customer.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(customerId) } },
        {
            $lookup: {
                from: "customernominees",
                localField: "nominee",
                foreignField: "_id",
                as: "nomineeDetails"
            }
        },
        {
            $lookup: {
                from: "customerwitnesses",
                localField: "witness",
                foreignField: "_id",
                as: "witnessDetails"
            }
        },
        {
            $lookup: {
                from: "customerloans",
                localField: "loans",
                foreignField: "_id",
                as: "loanDetails"
            }
        },
        {
            $lookup: {
                from: "customerdocuments",
                localField: "_id",
                foreignField: "customer",
                as: "documentDetails"
            }
        },
        {
            $lookup: {
                from: "bankdetails",
                localField: "_id",
                foreignField: "customerId",
                as: "bankDetails"
            }
        },
        {
            $project: {
                _id: 1,
                fullName: 1,
                gender: 1,
                dob: 1,
                fatherName: 1,
                motherName: 1,
                maritalStatus: 1,
                spouseName: 1,
                phoneNo: 1,
                email: 1,
                currentAddress: 1,
                permanentAddress: 1,
                nominee: "$nomineeDetails",
                witness: "$witnessDetails",
                loans: "$loanDetails",
                employmentStatus: 1, // Embedded sub-document, no lookup needed
                documents: "$documentDetails",
                bankDetails: "$bankDetails",
                customerID: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!customerDetails.length) {
        throw new ApiError(404, "Customer not found");
    }

    // Respond with customer details
    res.status(200).json(new ApiResponse(200, 'Customer details retrieved successfully', customerDetails[0]));
});






