import React, { useEffect, useRef, useState } from "react";
import "./OtpScreen.css";
import logo from "../../assets/LOGO/TV-BG.png";
import bgImage from "../../assets/HOMEBG/BG.jpeg"; // ✅ background import

export default function OtpScreen({
  phone,
  rawMobile,
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

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

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
    if (noAccount) return onCreateAccount?.(rawMobile || phone);
    return handleVerify();
  };

  const handleResend = () => {
    if (seconds > 0 || verifying) return;
    onResend?.();
    setSeconds(30);
  };

  return (
    <div
      className="otpPage"
      style={{ backgroundImage: `url(${bgImage})` }} // ✅ background apply
    >
      {/* TOP TOAST */}
      <div className={`topToast ${toastOpen ? "show" : ""}`}>
        <div className="topToastInner">
          {noAccount ? "You have no account" : "Invalid OTP"}
          <button className="toastClose" onClick={() => setToastOpen(false)}>
            ✕
          </button>
        </div>
      </div>

      {/* BRAND */}
      <div className="topBrand">
        <div className="logoWrap">
          <img src={logo} alt="Logo" className="brandLogo" />
        </div>

        <div className="brandTextWrap">
          <h2 className="brandName">TRUVISH</h2>
          <p className="brandTagline">Performance Rewards Simplified</p>
        </div>
      </div>

      {/* CONTENT */}
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
            {verifying
              ? "Verifying..."
              : noAccount
              ? "Create Account"
              : "Verify OTP"}
          </button>

          <div className="otpUnderRow">
            <button
              className="otpLinkBtn"
              onClick={() => !verifying && onBack?.()}
            >
              ← Change number
            </button>

            <button
              className="otpLinkBtn"
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
            <span>Secure & Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}