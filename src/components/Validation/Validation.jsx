import React, { useMemo, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import "./Validation.css";

export default function Validation({ defaultDays = 3, onBack, onContinue }) {

  const options = useMemo(() => [3, 6, 9, 12], []);
  const [selected, setSelected] = useState(defaultDays);

  return (
    <div className="val-container">

      {/* HEADER */}
      <div className="val-header">

        <button className="val-back-btn" onClick={onBack}>
          <IoChevronBack size={26} />
        </button>

        <h3 className="val-title">Validity Selection</h3>

        <div style={{ width: 26 }} />
      </div>

      {/* STEP */}
      <div className="val-step-text">
        STEP 2: VALIDITY SELECTION
      </div>

      <div className="val-progress-bar">
        <div className="val-progress" />
      </div>

      {/* QUESTION */}
      <h2 className="val-question">
        What validity period are you looking for?
      </h2>

      <p className="val-subtext">
        Select the validity period that best suits your needs.
      </p>

      {/* OPTIONS */}
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

      {/* CONTINUE BUTTON */}
      <button
        className="val-next-btn"
        onClick={() => onContinue?.(selected)}
      >
        Continue
      </button>

    </div>
  );
}