import {asyncHandler }from "../utils/asyncHandler.js"; 

export const roleVerification = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  });
};
