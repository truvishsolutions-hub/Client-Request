import React, { useEffect, useRef, useState } from "react";
import "./OtpScreen.css";
import logo from "../../assets/LOGO/TRV.png";

export default function OtpScreen({
  phone,
  rawMobile, // ✅ NEW (10 digit mobile for CreateAccount)
  onVerify,
  onResend,
  onBack,
  onCreateAccount,
  onSuccess,
}) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [touched, setTouched] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);

  const [noAccount, setNoAccount] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const otpValue = otp.join("");
  const isValid = otpValue.length === 4 && otp.every((d) => d !== "");

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  // ✅ 1 second countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // ✅ Auto hide toast
  useEffect(() => {
    if (!toastOpen) return;
    const t = setTimeout(() => setToastOpen(false), 2800);
    return () => clearTimeout(t);
  }, [toastOpen]);

  const setDigit = (index, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 3) refs[index + 1].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...otp];

      if (next[index]) {
        next[index] = "";
        setOtp(next);
        return;
      }
      if (index > 0) {
        refs[index - 1].current?.focus();
        next[index - 1] = "";
        setOtp(next);
      }
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!text) return;

    const next = ["", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setOtp(next);

    const focusIndex = Math.min(text.length, 4) - 1;
    refs[focusIndex]?.current?.focus();
  };

  const handleVerify = async () => {
    setTouched(true);
    if (!isValid || verifying) return;

    try {
      setVerifying(true);

      const res = await Promise.resolve(onVerify?.(otpValue));
      // expected: { ok:true } OR { ok:false, reason:"NO_ACCOUNT" }

      if (res?.ok) {
        setNoAccount(false);
        onSuccess?.();
        return;
      }

      if (res?.reason === "NO_ACCOUNT") {
        setNoAccount(true);
        setToastOpen(true);
        return;
      }

      setNoAccount(false);
      setToastOpen(true);
    } finally {
      setVerifying(false);
    }
  };

  const handlePrimary = () => {
    // ✅ FIX: return to prevent double execution
    if (noAccount) return onCreateAccount?.(rawMobile || phone);
    return handleVerify();
  };

  const handleResend = () => {
    if (seconds > 0 || verifying) return;
    onResend?.();
    setSeconds(30);
  };

  return (
    <div className="otpPage">
      {/* ✅ TOP SLIDE NOTIFICATION */}
      <div className={`topToast ${toastOpen ? "show" : ""}`}>
        <div className="topToastInner">
          {noAccount ? "You have no account" : "Invalid OTP"}
          <button className="toastClose" onClick={() => setToastOpen(false)}>
            ✕
          </button>
        </div>
      </div>

      <div className="topBrand">
        <img src={logo} alt="Logo" className="brandLogo" />
      </div>

      <div className="content">
        <h1 className="title">OTP Verification</h1>

        <p className="subtitle">
          Enter 4-digit OTP sent to{" "}
          <span className="phoneText">{phone || "+91 **********"}</span>
        </p>

        <div className="otpCard">
          <div className="otpRow" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={refs[i]}
                className={`otpBox ${touched && !isValid ? "error" : ""}`}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onBlur={() => setTouched(true)}
                disabled={verifying}
              />
            ))}
          </div>

          {touched && !isValid && (
            <div className="errText">Please enter a valid 4-digit OTP.</div>
          )}

          <button
            className={`primaryBtn ${verifying ? "loading" : ""}`}
            onClick={handlePrimary}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : noAccount ? "Create Account" : "Verify OTP"}
          </button>

          <div className="otpUnderRow">
            <button
              type="button"
              className={`otpLinkBtn ${verifying ? "disabled" : ""}`}
              onClick={() => !verifying && onBack?.()}
              disabled={verifying}
            >
              ← Change number
            </button>

            <button
              type="button"
              className={`otpLinkBtn ${seconds > 0 || verifying ? "disabled" : ""}`}
              onClick={handleResend}
              disabled={seconds > 0 || verifying}
            >
              {seconds > 0
                ? `Resend in 00:${String(seconds).padStart(2, "0")}`
                : "Resend OTP"}
            </button>
          </div>

          <div className="secure">
            <span className="lock">🔒</span>
            <span>Secure &amp; Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
