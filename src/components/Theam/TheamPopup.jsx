import React, { useState } from "react";
import "./TheamPopup.css";

const TheamPopup = ({ isOpen, onClose, themeId, config, baseUrl }) => {

  if (!isOpen) return null;

  const [selectedImg, setSelectedImg] = useState(null);

  const full = (p) => (p ? baseUrl + p : null);

  const themeImages = {
    theme1: [
      { img: full(config.img1), name: config.img1Name },
      { img: full(config.img2), name: config.img2Name },
      { img: full(config.img3), name: config.img3Name },
      { img: full(config.img4), name: config.img4Name },
    ],
    theme2: [
      { img: full(config.img6), name: config.img6Name },
      { img: full(config.img7), name: config.img7Name },
      { img: full(config.img8), name: config.img8Name },
      { img: full(config.img9), name: config.img9Name },
    ],
    theme3: [
      { img: full(config.img11), name: config.img11Name },
      { img: full(config.img12), name: config.img12Name },
      { img: full(config.img13), name: config.img13Name },
      { img: full(config.img14), name: config.img14Name },
    ],
    theme4: [
      { img: full(config.img16), name: config.img16Name },
      { img: full(config.img17), name: config.img17Name },
      { img: full(config.img18), name: config.img18Name },
      { img: full(config.img19), name: config.img19Name },
    ],
  };

  const data = themeImages[themeId] || [];

  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <div className="popup-header">
          <h2>Select Theme Image</h2>
          <span className="popup-close" onClick={() => onClose(null)}>✕</span>
        </div>

        <div className="popup-grid">
          {data.map((item, index) => (
            <div
              key={index}
              className={`popup-card ${selectedImg === index ? "active" : ""}`}
              onClick={() => setSelectedImg(index)}
            >
              {item.img && <img src={item.img} alt="" className="popup-img" />}
              <div className="popup-label">{item.name}</div>

              {selectedImg === index && (
                <div className="popup-tick">✔</div>
              )}
            </div>
          ))}
        </div>

        <button
          className="popup-btn"
          onClick={() => onClose(selectedImg !== null ? data[selectedImg] : null)}
        >
          Done
        </button>

      </div>
    </div>
  );
};

export default TheamPopup;
