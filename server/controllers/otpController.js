const otpService = require("../services/otpService");
const transporter = require("../config/nodemailer");
const pool = require("../config/db");

const otpController = {
    sendOtp: async (req, res) => {
        const { email } = req.body;

        try {
            const result = await pool.query("SELECT * FROM users WHERE userEmail = $1", [email]);

            if (result.rows.length === 0) {
                return res.status(400).json({ message: "Email not registered" });
            }

            const otp = otpService.generateOtp();
            otpService.storeOtp(email, otp);

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP Code",
                text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            });

            res.json({ message: "OTP sent to your email" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    },

    verifyOtp: (req, res) => {
        const { email, otp } = req.body;

        const isValidOtp = otpService.verifyOtp(email, otp);
        if (isValidOtp) {
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Login Notification",
                text: "You have successfully logged in to our system.",
            });

            return res.json({ message: "Login successful" });
        }

        res.status(400).json({ message: "Invalid OTP" });
    }
};

module.exports = otpController;
