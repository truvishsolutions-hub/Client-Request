import React, { useState } from "react";
import { IoChevronBack } from "react-icons/io5";

import "./VoucherStep.css";
import moneyIcon from "../../assets/VERYFY/MONEY.png";

const VoucherStep = ({ onBack, onContinue }) => {

  const [selected, setSelected] = useState("50");

  const options = [
    { id: "100", label: "₹100" },
    { id: "250", label: "₹250" },
    { id: "500", label: "₹500" },
    { id: "1000", label: "₹1000" },
  ];

  return (
    <div className="vs-container">

      {/* HEADER */}
      <div className="vs-header">

        <button className="vs-back-btn" onClick={onBack}>
          <IoChevronBack size={26}/>
        </button>

        <h3 className="vs-title">Voucher Request</h3>

        <div style={{width:26}} />
      </div>

      {/* STEP */}
      <div className="vs-step-text">STEP 1: VALUE SELECTION</div>

      <div className="vs-progress-bar">
        <div className="vs-progress"></div>
      </div>

      {/* QUESTION */}
      <h2 className="vs-question">
        What value of reward vouchers are you looking for?
      </h2>

      <p className="vs-subtext">
        Select the amount that fits your reward budget.
      </p>

      {/* OPTIONS */}
      <div className="vs-options">

        {options.map((opt) => (

          <div
            key={opt.id}
            className={`vs-card ${selected === opt.id ? "active" : ""}`}
            onClick={() => setSelected(opt.id)}
          >

            <div className="vs-icon">
              <img src={moneyIcon} alt="money"/>
            </div>

            <p className="vs-label">{opt.label}</p>

            <span className="vs-radio">
              {selected === opt.id && <span className="vs-tick">✔</span>}
            </span>

          </div>

        ))}

      </div>

      {/* CONTINUE BUTTON */}
      <button
        className="vs-next-btn"
        onClick={() => onContinue(selected)}
      >
        Continue
      </button>

    </div>
  );
};

export default VoucherStep;