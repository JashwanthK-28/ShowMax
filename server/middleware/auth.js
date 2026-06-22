import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) {
      return res.json({
        success: false,
        message: "Not authorized: No session found",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.privateMetadata.role !== "admin") {
      return res.json({ success: false, message: "Not authorized" });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: "Authorization failed" });
  }
};
