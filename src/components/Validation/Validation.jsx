import React, { useMemo, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import "./Validation.css";
import bgImage from "../../assets/HOMEBG/BG.jpeg";

export default function Validation({ defaultDays = 3, onBack, onContinue }) {

  const options = useMemo(() => [3, 6, 9, 12], []);
  const [selected, setSelected] = useState(defaultDays);

  return (
    <div className="val-bg" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="val-container">

        <div className="val-top">

          <div className="val-header">
            <button className="val-back-btn" onClick={onBack}>
              <IoChevronBack size={26} />
            </button>
            <div style={{ width: 26 }} />
          </div>

          <div className="val-step-text">
            STEP 3: VALIDITY SELECTION
          </div>

          <div className="val-progress-bar">
            <div className="val-progress" />
          </div>

          <h2 className="val-question">
            What validity period are you looking for?
          </h2>

          <p className="val-subtext">
            Select the validity period that best suits your needs.
          </p>

          <div className="val-options">
            {options.map((d) => {
              const active = selected === d;

              return (
                <div
                  key={d}
                  className={`val-card ${active ? "active" : ""}`}
                  onClick={() => setSelected(d)}
                >
                  <p className="val-label">{d} months</p>

                  <span className="val-radio">
                    {active && <span className="val-tick">✔</span>}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* SAME FOOTER */}
        <div className="val-footer">
          <button
            className="val-next-btn"
            onClick={() => onContinue?.(selected)}
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
}