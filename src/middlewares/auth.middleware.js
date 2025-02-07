import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user; // Get user information attached to the request

    // Check if the user is an admin
    if (user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next(); // User is admin, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});

export const isLoanmanager = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user; // Get user information attached to the request

    // Check if the user is an admin
    if (user.role !== "loanmanager") {
      throw new ApiError(403, "You are not authorized to perform this action");
    }

    next(); // User is admin, proceed to the next middleware or route handler
  } catch (error) {
    next(error); // Pass any errors to the error handler middleware
  }
});
