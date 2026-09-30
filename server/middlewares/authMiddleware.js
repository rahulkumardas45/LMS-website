import { clerkClient } from "@clerk/express";

// middleware ( protect educator Routes )
export const protectEducator = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized Access: Please log in' });
        }

        const user = await clerkClient.users.getUser(userId);

        if (user?.publicMetadata?.role !== 'educator') {
            return res.status(403).json({ success: false, message: 'Unauthorized Access: Educator role required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};