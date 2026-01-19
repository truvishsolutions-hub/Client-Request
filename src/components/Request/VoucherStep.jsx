import React, { useState } from "react";
import "./VoucherStep.css";
import moneyIcon from "../../assets/VERYFY/MONEY.png";

const VoucherStep = () => {
  const [selected, setSelected] = useState("501-1000");

  const options = [
    { id: "50", label: "50" },
    { id: "100", label: "100" },
    { id: "250", label: "250" },
    { id: "500", label: "500" },
  ];

  return (
    <div className="vs-container">

      {/* Header */}
      <div className="vs-header">
        <span className="vs-back">←</span>
        <h3 className="vs-title">Voucher Request</h3>
      </div>

      {/* Step Progress */}
      <div className="vs-step-text">STEP 1: VALUE SELECTION</div>
      <div className="vs-progress-bar">
        <div className="vs-progress"></div>
      </div>

      {/* Question */}
      <h2 className="vs-question">
        What value of reward vouchers are you looking for?
      </h2>
      <p className="vs-subtext">
        Select a range that fits your reward budget.
      </p>

      {/* Options */}
      <div className="vs-options">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`vs-card ${selected === opt.id ? "active" : ""}`}
            onClick={() => setSelected(opt.id)}
          >
            <div className="vs-icon">
              <img src={moneyIcon} alt="icon" />
            </div>
            <p className="vs-label">{opt.label}</p>

            <span className="vs-radio">
              {selected === opt.id && <span className="vs-radio-inner"></span>}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <button className="vs-next-btn">Next Step</button>
    </div>
  );
};

export default VoucherStep;
