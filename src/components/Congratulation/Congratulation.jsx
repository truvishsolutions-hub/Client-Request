// ✅ Congratulation.jsx (FINAL UPDATE WITH HOME BUTTON)

import React, { useEffect, useRef } from "react";
import "./Congratulation.css";
import logo from "../../assets/LOGO/TRV.png";

import { MdEmail } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { TbLocationCode } from "react-icons/tb";
import { IoIosHome } from "react-icons/io"; // ✅ NEW

import confetti from "canvas-confetti";

export default function Congratulation({
  voucherCode,
  onViewDetails,
  onRedeemNow,
  onShareGmail,
  onShareWhatsApp,
  onShareSMS,
  onCopy,
  onGoHome // ✅ NEW PROP
}) {
  const confettiCanvasRef = useRef(null);

  const handleCopy = async () => {
    try {
      if (!voucherCode) return;
      await navigator.clipboard.writeText(voucherCode);
      onCopy?.(voucherCode);
    } catch (e) {
      onCopy?.(voucherCode);
    }
  };

  const handleShareClick = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback && voucherCode) {
      callback();
    }
    return false;
  };

  useEffect(() => {
    if (!voucherCode) return;
    if (!confettiCanvasRef.current) return;

    const myConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 999,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = Math.max(12, 50 * (timeLeft / duration));

      myConfetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      myConfetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 100);

    return () => clearInterval(interval);
  }, [voucherCode]);

  return (
    <div className="cv-page">
      {/* ✅ HOME BUTTON */}
      <div className="cv-home-btn" onClick={onGoHome}>
        <IoIosHome />
      </div>

      <canvas ref={confettiCanvasRef} className="cv-confetti-canvas" />

      <div className="cv-wrap">
        <div className="cv-header">
          <img src={logo} alt="Logo" className="cv-logo" />
        </div>

        <h1 className="cv-title">Congratulations!</h1>

        <div className="cv-panel">
          <div className="cv-label">Your voucher code is</div>

          <button
            className="cv-code"
            type="button"
            onClick={handleCopy}
            disabled={!voucherCode}
          >
            <span className="cv-code-text">{voucherCode || "Loading..."}</span>
            <span className="cv-copy">📋</span>
          </button>

          <div className="cv-share">
            <button className="cv-share-item" onClick={handleShareClick(onShareGmail)} disabled={!voucherCode}>
              <div className="cv-ico gmail"><MdEmail /></div>
              <div className="cv-share-text">Email</div>
            </button>

            <button className="cv-share-item" onClick={handleShareClick(onShareWhatsApp)} disabled={!voucherCode}>
              <div className="cv-ico whatsapp"><BsWhatsapp /></div>
              <div className="cv-share-text">WhatsApp</div>
            </button>

            <button className="cv-share-item" onClick={handleShareClick(onShareSMS)} disabled={!voucherCode}>
              <div className="cv-ico sms"><BiMessageRoundedDetail /></div>
              <div className="cv-share-text">SMS</div>
            </button>
          </div>

          <button className="cv-btn-dark" onClick={onViewDetails} disabled={!voucherCode}>
            View details
          </button>

          <button className="cv-btn-redeem" onClick={onRedeemNow} disabled={!voucherCode}>
            <TbLocationCode className="cv-redeem-icon" />
            <span>Redeem Now</span>
          </button>
        </div>

        <div className="cv-foot">
          <span className="cv-lock">🔒</span>
          <span>This voucher is secure & unique</span>
        </div>
      </div>
    </div>
  );
}