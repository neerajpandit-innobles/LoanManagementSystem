import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import cron from "node-cron";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from 'xss-clean';
import {logReqRes} from '../src/middlewares/logger.middleware.js'
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name from the module URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
    cors(
        {
        origin: process.env.CORS_ORIGIN, // Replace with your specific origin or wildcard '*'
        credentials: true, // Enable credentials (cookies, authorization headers) in cross-origin requests
    })
);


// app.use(morganMiddleware);
// app.use(logRequestResponse);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: "96kb" }));
app.use(sanitize());
// app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(xss());
app.use(express.urlencoded({ extended: true, limit: "96kb" }));
app.use("/public", express.static(path.join(__dirname, "../public")));
// console.log(`Serving static files from: ${path.join(__dirname, "../public/temp")}`);

// console.log(__dirname,"../public");

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET, // Replace with your secret key
        resave: false,
        saveUninitialized: false,
    })
);

app.use(logReqRes("log.txt"))
app.get('/', function (req, res) { 
    res.redirect('/api/v1/'); 
}); 
app.get('/api/v1/', (req, res) => {
    res.status(200).json({
      message: 'Welcome to the Node.js server!'
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

// app.use((err, req, res, next) => {
//     if (err) {
//         // Log the error to the console
//         console.error('Security error detected:', err.message);

//         // You can send a response to the client if needed
//         res.status(500).json({
//             status: 'error',
//             message: 'A security error occurred. Please try again later.'
//         });
//     } else {
//         next();
//     }
// });
app.use('*', (req, res) => {
        res.status(404).send('<h1>404! Page not found</h1>');
      });


export { app };
