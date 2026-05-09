// ShareVoucher.jsx

import React, { useState } from "react";
import "./ShareVoucher.css";

import { IoClose } from "react-icons/io5";
import { MdOutlineMail } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";

export default function ShareVoucher({
  open,
  onClose,
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  if (!open) return null;

  return (
    <div className="share-overlay">

      {/* BACKDROP */}
      <div className="share-backdrop" onClick={onClose}></div>

      {/* SHEET */}
      <div className="share-sheet">

        {/* TOP BAR */}
        <div className="sheet-line"></div>

        {/* HEADER */}
        <div className="share-header">

          <h2>Share Voucher</h2>

          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>

        </div>

        {/* EMAIL */}
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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

        </div>

        {/* NAME */}
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>

        </div>

        {/* BUTTONS */}
        <button className="send-btn">
          <IoPaperPlaneOutline />
          Send Now
        </button>

        <button className="later-btn">
          <LuClock3 />
          Send Later
        </button>

        {/* INFO */}
        <p className="share-info">
          Recipient will receive an email with instructions on
          how to claim this voucher.
        </p>

      </div>

    </div>
  );
}