import React, { useEffect, useRef, useState } from "react";
import "./OtpScreen.css";

import logo from "../../assets/LOGO/TVBG.png";
import bgImage from "../../assets/HOMEBG/BG2.png";

import { FiRefreshCw } from "react-icons/fi";

const OtpScreen = ({
  phone,
  rawMobile,
  onVerify,
  onResend,
  onBack,
  onCreateAccount,
  onSuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [touched, setTouched] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [verifying, setVerifying] = useState(false);

  const [noAccount, setNoAccount] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const refs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const otpValue = otp.join("");

  const isValid =
    otpValue.length === 4 &&
    otp.every((d) => d !== "");

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;

    const t = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [seconds]);

  useEffect(() => {
    if (!toastOpen) return;

    const t = setTimeout(() => {
      setToastOpen(false);
    }, 2800);

    return () => clearTimeout(t);
  }, [toastOpen]);

  const setDigit = (index, val) => {
    const digit = val
      .replace(/\D/g, "")
      .slice(-1);

    const next = [...otp];

    next[index] = digit;

    setOtp(next);

    if (digit && index < 3) {
      refs[index + 1].current?.focus();
    }
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
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!text) return;

    const next = ["", "", "", ""];

    for (let i = 0; i < text.length; i++) {
      next[i] = text[i];
    }

    setOtp(next);

    const focusIndex =
      Math.min(text.length, 4) - 1;

    refs[focusIndex]?.current?.focus();
  };

  const handleVerify = async () => {
    setTouched(true);

    if (!isValid || verifying) return;

    try {
      setVerifying(true);

      const res = await Promise.resolve(
        onVerify?.(otpValue)
      );

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
    if (noAccount) {
      return onCreateAccount?.(
        rawMobile || phone
      );
    }

    return handleVerify();
  };

  const handleResend = () => {
    if (seconds > 0 || verifying) return;

    onResend?.();

    setSeconds(30);
  };

  return (
    <div
      className="verify-page"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* TOAST */}
      <div
        className={`topToast ${
          toastOpen ? "show" : ""
        }`}
      >
        <div className="topToastInner">
          {noAccount
            ? "You have no account"
            : "Invalid OTP"}

          <button
            className="toastClose"
            onClick={() =>
              setToastOpen(false)
            }
          >
            ✕
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div className="top-overlay"></div>

      {/* TOP DESIGN */}
      <div className="hero-section">
        <div className="feature feature-top-right"></div>

        <div className="gift-wrapper">
          <div className="gift-box"></div>
        </div>
      </div>

      {/* OTP CARD */}
      <div className="otp-card">
        {/* Logo */}
        <div className="logo-wrapper">
          <div className="logo-circle">
            <img
              src={logo}
              alt="Truvish Logo"
              className="logo-img"
            />

            <h3 className="logo-text">
              TRUVISH
            </h3>
          </div>
        </div>

        {/* Heading */}
        <h1 className="otp-title">
          Verify Your Phone Number
        </h1>

        <p className="otp-subtitle">
          Enter the 4-Digit code sent to
          your phone
        </p>

        {/* OTP */}
        <div className="otp-section">
          <p className="otp-label">
            Enter OTP Code
          </p>

          <div
            className="otp-inputs"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                className={
                  touched && !isValid
                    ? "error"
                    : ""
                }
                onChange={(e) =>
                  setDigit(i, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(i, e)
                }
                onBlur={() =>
                  setTouched(true)
                }
                disabled={verifying}
              />
            ))}
          </div>

          {touched && !isValid && (
            <p className="errText">
              Please enter a valid
              4-digit OTP.
            </p>
          )}

          <p className="phone-text">
            Sent to{" "}
            {phone || "+91 **********"}
          </p>
        </div>

        {/* Verify Button */}
        <button
          className={`verify-btn ${
            verifying ? "loading" : ""
          }`}
          onClick={handlePrimary}
          disabled={verifying}
        >
          {verifying
            ? "Verifying..."
            : noAccount
            ? "Create Account"
            : "Verify & Continue"}
        </button>

        {/* Resend */}
        <button
          className="resend-btn"
          onClick={handleResend}
          disabled={
            seconds > 0 || verifying
          }
        >
          {seconds > 0
            ? `Resend in 00:${String(
                seconds
              ).padStart(2, "0")}`
            : "Resend OTP"}
        </button>

        {/* Change Number */}
        <div
          className="change-number"
          onClick={() =>
            !verifying && onBack?.()
          }
        >
          <FiRefreshCw />

          <span>
            Change Phone Number
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;