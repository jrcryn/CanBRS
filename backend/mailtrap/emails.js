import { mailTrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, 
         PASSWORD_RESET_REQUEST_TEMPLATE, 
         PASSWORD_RESET_SUCCESS_TEMPLATE,
         TWO_FA_EMAIL_TEMPLATE 
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification", //helper function in mailtrap client
        })

        console.log("Email verification email sent successfully: ", response);

    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Forgot Password", //helper function in mailtrap client
        })

        console.log("Forgot password email sent successfully: ", response);

    } catch (error) {
        console.error("Error sending forgot password email:", error);
        throw new Error(`Error sending forgot password email: ${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset", //helper function in mailtrap client
        })

        console.log("Password reset success email sent successfully: ", response);

    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}

export const sendLoginOtpEmail = async (email, otp) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Login OTP",
            html: TWO_FA_EMAIL_TEMPLATE.replace("{otpCode}", otp),
            category: "Login OTP", //helper function in mailtrap client
        })

        console.log("Login OTP email sent successfully: ", response, otp);

    } catch (error) {
        console.error("Error sending login OTP email:", error);
        throw new Error(`Error sending login OTP email: ${error}`);
    }
}