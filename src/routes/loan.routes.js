import { Router } from "express";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";

import {
    calculateEMI,
    getLoanDetails,
    updateEMIStatus,
} from "../controllers/customerLoan.controller.js";
import { issueLoan } from "../controllers/customerLoan.controller.js";

router.route("/:loanId").get(getLoanDetails);
router.route("/emiUpdate/:id").put(updateEMIStatus);

//calculateEMI',
router
    .route("/calculateEMI/:customerID")
    .post(upload.array("file", 10), calculateEMI);
//issueLoan
router
    .route("/issueLoan/:customerIDOrcustomerId")
    .post(upload.array("file", 10), issueLoan);

export default router;
