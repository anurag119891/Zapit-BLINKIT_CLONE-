import React, { useEffect, useRef, useState } from "react";
import { X, Smartphone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import "../css/LoginModal.css";

const API_BASE_URL = "http://localhost:5000/api/auth";

export default function LoginModal({
  open = true,
  onClose = () => {},
  onLoginSuccess,
}) {
  const [step, setStep] = useState("PHONE");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (open) {
      setStep("PHONE");
      setMobile("");
      setOtp(["", "", "", ""]);
      setError("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    let interval;
    if (step === "OTP" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!open) return null;

  const isBtnDisabled =
    loading ||
    (step === "PHONE" && mobile.length !== 10) ||
    (step === "OTP" && otp.join("").length !== 4);

  const sendOtpApi = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobile }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("OTP");
        setTimer(30);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobile, otp: otp.join("") }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onLoginSuccess) onLoginSuccess(data.user);
        onClose();
      } else {
        setError("Invalid code. Please check and try again.");
      }
    } catch (err) {
      setError("Verification failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

 const handleOtpChange = (value, index) => {
  // Only allow numbers
  const sanitizedValue = value.replace(/\D/g, "");
  if (!sanitizedValue && value !== "") return;

  const newOtp = [...otp];
  newOtp[index] = sanitizedValue.slice(-1);
  setOtp(newOtp);

  // Move to next input if value is entered
  if (sanitizedValue && index < 3) {
    otpRefs[index + 1].current.focus();
  }
};
  return (
    <div className="login-overlay" onMouseDown={onClose}>
      <div className="login-card" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="login-visual">
          <div className="visual-icon">
            {step === "PHONE" ? (
              <Smartphone size={32} />
            ) : (
              <ShieldCheck size={32} />
            )}
          </div>
          <div className="logo-brand">
            <span className="zap">Zap</span>
            <span className="it">it</span>
          </div>
        </div>

        <div className="login-body">
          <h2 className="login-heading">
            {step === "PHONE" ? "Welcome to Zapit" : "Verification Code"}
          </h2>
          <p className="login-subtext">
            {step === "PHONE"
              ? "Enter your mobile number to get started"
              : `Enter the 4-digit code sent to +91 ${mobile}`}
          </p>

          <div className="input-frame">
            {step === "PHONE" ? (
              <div className="phone-input-group">
                <span className="prefix">+91</span>
                <input
                  ref={inputRef}
                  className={error ? "error" : ""}
                  type="tel"
                  placeholder="Enter mobile number"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            ) : (
              <div className="otp-input-group">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="tel"
                    maxLength={1}
                    value={digit}
                    autoFocus={idx === 0} // Auto focus the first box
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => {
                      // Backspace Logic: Move to previous box if empty
                      if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                        otpRefs[idx - 1].current.focus();
                      }
                    }}
                    className={error ? "error" : ""}
                  />
                ))}
              </div>
            )}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            className="action-button"
            disabled={isBtnDisabled}
            onClick={step === "PHONE" ? sendOtpApi : handleVerify}
          >
            {loading ? (
              <Loader2 className="spinner" />
            ) : (
              <>
                {step === "PHONE" ? "Send OTP" : "Verify & Login"}
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {step === "OTP" && (
            <div className="otp-footer">
              <p>Didn't receive the code?</p>
              {timer > 0 ? (
                <span className="timer">Resend in {timer}s</span>
              ) : (
                <button className="resend-btn" onClick={sendOtpApi}>
                  Resend Now
                </button>
              )}
              <button className="change-num" onClick={() => setStep("PHONE")}>
                Change Phone Number
              </button>
            </div>
          )}
        </div>

        <div className="login-legal">
          By continuing, you agree to our
          <a href="/terms">Terms</a> & <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
