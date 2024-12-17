import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; //token is the name of the cookie I set in the generateTokenAndSetCookie function
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - no token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Unauthorized - invalid token' })
        }        

        req.userId = decoded.userId
        next();

    } catch (error) {
        console.log('Error in verifying token:', error.message);
        res.status(401).json({ success: false, message: 'Server error' })
    }
}