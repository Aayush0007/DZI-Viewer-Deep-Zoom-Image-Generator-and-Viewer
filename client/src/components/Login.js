import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (otpSent && otpResendTime > 0) {
      timer = setInterval(() => {
        setOtpResendTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpResendTime]);

  const handleClose = () => {
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setOtpResendTime(0);
    onClose();
  };

  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/send-otp`, { email });

      setOtpSent(true);
      setOtpResendTime(90);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (otpResendTime <= 0) {
      await sendOtp();
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a 4-digit OTP!");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, { email, otp });

      toast.success("Login successful!");
      onLoginSuccess();
      handleClose();
      navigate("/welcome");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-btn" onClick={handleClose}>×</button>
        <h2 className="login-heading">Login</h2>
        <p className="sub-heading">Enter your email to receive an OTP</p>
        
        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
            <button 
              onClick={sendOtp} 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, '').slice(0, 4))}
              className="input-field"
            />
            <button 
              onClick={verifyOtp} 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="resend-otp">
              {otpResendTime > 0 ? (
                <span>Resend OTP in {otpResendTime}s</span>
              ) : (
                <button onClick={resendOtp} className="resend-btn">
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;