import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import {  createCustomerWitness, createCustomerNominee, getCustomers, registerCustomer, updateAvatar } from "../controllers/customer.controller.js";
import { createEmploymentStatus } from "../controllers/employMentStatus.controller.js";
import { createBankDetails } from "../controllers/bankDetails.controller.js";
import { getAllCustomersWithLoanDetails, getCustomerDetails } from "../controllers/customerProfile.controller.js";
import { createCustomerDocuments } from "../controllers/customerDocument.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route("/register").post(registerCustomer)

router.route('/update-avatar/:customerId').post(upload.single('avatar'),updateAvatar)

router.route("/getCustomer").get(getCustomers)
router.route("/addNominee").post(createCustomerNominee);
router.route("/createCustomerWitness").post(createCustomerWitness)

router.route("/:customerId/createEmployStatus").put(createEmploymentStatus)

router.route("/:customerId/bankDetails").post(createBankDetails)

// router.route("/:customerId/details").get(getCustomerDetails)

router.route("/customerProfiles").get(getAllCustomersWithLoanDetails)

router.route("/:customerId/document").post(createCustomerDocuments)

router.route("/:customerIDOrcustomerId").get(getCustomerDetails)


export default router;