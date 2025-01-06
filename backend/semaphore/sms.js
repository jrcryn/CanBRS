import  { sendSMS } from "./semaphore.config.js";

export const sendPasswordResetSMS = async (phone, resetURL) => {
    try {
        const message = `Go to this link to reset your password: ${resetURL}.`;
        await sendSMS(phone, message);
        console.log("Password reset SMS sent successfully");
    } catch (error) {
        console.error("Error sending password reset SMS:", error);
        throw new Error(`Error sending password reset SMS: ${error}`);
    }
};

export const sendResetSuccessSMS = async (phone) => {
    try {
        const message = `Your password has been reset is successfully. If this wasn't you, contact support immediately.`;
        await sendSMS(phone, message);
        console.log("Password reset success SMS sent successfully");
    } catch (error) {
        console.error("Error sending password reset success SMS :", error);
        throw new Error(`Error sending password reset success SMS: ${error}`);
    }
};

export const sendLoginOtpSMS = async (phone, verificationCode) => {
    try {
        const message = `Your CanBRS login OTP is ${verificationCode}.`;
        await sendSMS(phone, message);
        console.log("Login OTP SMS sent successfully");
    } catch (error) {
        console.error("Error sending login OTP SMS:", error);
        throw new Error(`Error sending login OTP SMS: ${error}`);
    }
};

export const sendReservationRequestApprovedSMS = async (phone) => {
    try {
        const message = `Your reservation has been approved. For more details login, then go to track reservations page.`;
        await sendSMS(phone, message);
        console.log("Reservation confirmation SMS sent successfully");
    } catch (error) {
        console.error("Error sending reservation confirmation SMS:", error);
        throw new Error(`Error sending reservation confirmation SMS: ${error}`);
    }
};

export const sendReservationRequestDeclinedSMS = async (phone, reason) => {
    try {
        const message = `Reservation declined: ${reason}. For more details login, then go to track reservations page.`;
        await sendSMS(phone, message);
        console.log("Reservation declined SMS sent successfully");
    } catch (error) {
        console.error("Error sending reservation declined SMS:", error);
        throw new Error(`Error sending reservation declined SMS: ${error}`);
    }
}

export const sendResidentAccountApprovedSMS = async (phone) => {
    try {
        const message = `Your resident account has been approved. You can now login to your account.`;
        await sendSMS(phone, message);
        console.log("Resident account approval SMS sent successfully");
    } catch (error) {
        console.error("Error sending resident account approval SMS:", error);
        throw new Error(`Error sending resident account approval SMS: ${error}`);
    }
};

export const sendResidentAccountDeclinedSMS = async (phone, reason) => {
    try {
        const message = `Registration declined: ${reason}. Retry by creating a new account.`;
        await sendSMS(phone, message);
        console.log("Resident account declined SMS sent successfully");
    } catch (error) {
        console.error("Error sending resident account declined SMS:", error);
        throw new Error(`Error sending resident account declined SMS: ${error}`);
    }
}


