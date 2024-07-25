import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import cron from "node-cron";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from 'xss-clean';
const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*", // Replace with your specific origin or wildcard '*'
        credentials: true, // Enable credentials (cookies, authorization headers) in cross-origin requests
    })
);

// app.use(morganMiddleware);
// app.use(logRequestResponse);
app.use(express.json({ limit: "16kb" }));
app.use(sanitize());
app.use(helmet());
app.use(xss());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/public", express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET, // Replace with your secret key
        resave: false,
        saveUninitialized: false,
    })
);

app.get('', (req, res) => {
    res.status(200).json({
      message: 'Welcome to Pandey Ji in the Node.js server!'
    });
  });



cron.schedule("* */12 * * *", () => {
    console.log(
        "Running cron job to update every 12 hours EMI status and add penalty..."
    );
    updateEMIOverdueStatus();
});

import userRouter from "./routes/user.routes.js";
import customerRouter from "./routes/customer.routes.js";
import loanRouter from "./routes/loan.routes.js";
import { updateEMIOverdueStatus } from "./controllers/customerLoan.controller.js";
// import { logRequestResponse, morganMiddleware } from "./middlewares/logger.middleware.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/loan", loanRouter);

app.use((err, req, res, next) => {
    if (err) {
        // Log the error to the console
        console.error('Security error detected:', err.message);

        // You can send a response to the client if needed
        res.status(500).json({
            status: 'error',
            message: 'A security error occurred. Please try again later.'
        });
    } else {
        next();
    }
});

export { app };
