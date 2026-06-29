// ShareVoucher.jsx

import React, { useState } from "react";
import axios from "axios";

import "./ShareVoucher.css";

import { IoClose } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://truvish-backend-production.up.railway.app";

export default function ShareVoucher({
  open,
  onClose,
  onSuccess,
  voucherCode,
  client,
  validityDays,
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      alert("Please enter recipient email");
      return;
    }

    try {
      setLoading(true);

      const logoUrl =
        client?.id && client?.logoImg
          ? `${BASE_URL}/api/clients/${client.id}/logo`
          : "";

      const response = await axios.post(
        `${BASE_URL}/api/voucher/send`,
        {
          email: email.trim(),
          customerName: name.trim(),
          senderName: client?.clientName || "",
          voucherCode: voucherCode,
          clientLogo: logoUrl,
          validityDays: validityDays,
          companyName: client?.companyName || "TruVish",
        }
      );

      console.log("Voucher Sent:", response.data);

      if (onSuccess) {
        onSuccess();
      }

      setEmail("");
      setName("");

      onClose();

      alert("Voucher sent successfully!");
    } catch (error) {
      console.error("Voucher Send Error:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      alert("Failed to send voucher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="share-overlay">
      <div
        className="share-backdrop"
        onClick={onClose}
      ></div>

      <div className="share-sheet">
        <div className="sheet-line"></div>

        <div className="share-header">
          <h2>Share Voucher</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <IoClose />
          </button>
        </div>

        <div className="field-wrapper">
          <div className="label-row">
            <label>RECIPIENT EMAIL</label>
          </div>

          <div className="input-box">
            <MdOutlineMail />

            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>
        </div>

        <div className="field-wrapper">
          <div className="label-row">
            <label>RECIPIENT NAME</label>
            <span>OPTIONAL</span>
          </div>

          <div className="input-box">
            <FiUser />

            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>
        </div>

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading}
        >
          <IoPaperPlaneOutline />

          {loading ? "Sending..." : "Send Now"}
        </button>

        <button className="later-btn">
          <LuClock3 />
          Send Later
        </button>

        <p className="share-info">
          Recipient will receive an email with
          instructions on how to redeem this
          voucher reward.
        </p>
      </div>
    </div>
  );
}