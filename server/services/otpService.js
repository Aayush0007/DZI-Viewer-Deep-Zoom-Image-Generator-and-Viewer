const otpStore = require("../utils/otpStore");

const otpService = {
    generateOtp: () => {
        // Generates a random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);  // Generates a random number between 1000 and 9999
        return otp.toString(); // Return OTP as a string
    },

    storeOtp: (email, otp) => {
        otpStore[email] = { otp, expiry: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes
    },

    verifyOtp: (email, otp) => {
        const storedOtp = otpStore[email];
        if (storedOtp) {
            const { otp: storedOtpValue, expiry } = storedOtp;

            // OTP expired
            if (Date.now() > expiry) {
                delete otpStore[email]; // Clean up expired OTP
                return false;
            }

            // Validate OTP
            if (storedOtpValue === otp) {
                delete otpStore[email]; // Remove OTP after successful verification
                return true;
            }
        }
        return false;
    }
};

module.exports = otpService;
