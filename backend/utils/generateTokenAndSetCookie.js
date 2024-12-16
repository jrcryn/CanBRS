import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
        httpsOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Lax for localhost
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
    });

    return token;
}