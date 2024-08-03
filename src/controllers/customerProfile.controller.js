import { Customer } from '../models/customer.model.js';
import { CustomerLoan } from '../models/customerLoan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';




//without pagination
export const getAllCustomersWithLoanDetails2 = asyncHandler(async (req, res) => {
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
        avatar:customer.avatar,
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





    //end Pagination
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

//pagination with
export const getAllCustomersWithLoanDetails = asyncHandler(async (req, res) => {
  try {
    // Pagination start
    const pageNo = parseInt(req.query.pageNo) || 1;
    const rowSize = parseInt(req.query.rowSize) || 50;

    if (rowSize > 100) {
      throw new ApiError(400, 'Please Select rowSize less than or equal to 100');
    }

    const startIndex = (pageNo - 1) * rowSize;

    if (pageNo < 1) {
      throw new ApiError(400, 'Please Select a valid Page No');
    }

    const totalDocuments = await Customer.countDocuments();
    const totalPages = Math.ceil(totalDocuments / rowSize);

    if (pageNo > totalPages) {
      throw new ApiError(400, `Please Select Page No less than or equal to ${totalPages}`);
    }

    const customers = await Customer.find().skip(startIndex).limit(rowSize);

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
        avatar: customer.avatar,
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
// console.log(customersWithLoanDetails);
    // Pagination end
    const apiResponse = new ApiResponse({
      message: 'All customers with loan details retrieved successfully',
        customersWithLoanDetails,
        pagination: {
          totalDocuments,
          totalPages,
          currentPage: pageNo,
          rowSize
        }
      
    });
    //res.status(200).json(new ApiResponse(200, 'Customer details retrieved successfully', apiResponse));
    res.status(200).json(apiResponse);
  } catch (error) {
    console.error('Error retrieving customers with loan details:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});




export const getCustomerDetails = asyncHandler(async (req, res) => {
    // const { customerID } = req.params;
    const { customerIDOrcustomerId } = req.params;
    console.log(`Received parameter: ${customerIDOrcustomerId}`);
  //   const customer = await Customer.findOne({
  //     $or:[{customerID: customerIDOrcustomerId},{_id:customerIDOrcustomerId}]
  // });

  let customer;

  // Check if the param is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(customerIDOrcustomerId)) {
      // Find customer by _id
      customer = await Customer.findOne({ _id: customerIDOrcustomerId });
  } else {
      // Find customer by customerID
      customer = await Customer.findOne({ customerID: customerIDOrcustomerId });
  }

  if (!customer) {
      throw new ApiError(404, "Customer not found");
  }
  console.log(customer._id)
    // const customerId= await Customer.findOne({customerID})
    // Validate customer ID
    if (!mongoose.Types.ObjectId.isValid(customer._id)) {
        throw new ApiError(400, "Invalid customer ID");
    }

    // Fetch customer details using aggregation pipeline
    const customerDetails = await Customer.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(customer._id) } },
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
                avatar:1,
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






