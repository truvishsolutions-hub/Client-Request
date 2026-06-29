import React, { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import "./SelectTheam.css";
import bgImage from "../../assets/HOMEBG/BG.jpeg";

const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://truvish-backend-production.up.railway.app";

const SelectTheam = ({ onBack, onContinue }) => {
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/config`)
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => setConfig({}));
  }, []);

  const full = (path) => (path ? BASE_URL + path : null);

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

  const handleImageClick = (themeId, imgObj) => {
    setSelectedTheme(themeId);
    setSelectedImage(imgObj);
  };

  return (
    <div
      className="vs2-bg"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="vs2-container">

        {/* HEADER */}
        <div className="vs2-header">
          <button className="vs2-back-btn" onClick={onBack}>
            <IoChevronBack size={26} />
          </button>
        </div>

        {/* STEP */}
        <div className="vs2-step-text">STEP 3: THEME SELECTION</div>
        <div className="vs2-progress-bar">
          <div className="vs2-progress" />
        </div>

        <h2 className="vs2-question">Choose Your Theme Image</h2>

        {/* THEMES GRID */}
        {Object.entries(themeImages).map(([themeId, images]) => (
          <div key={themeId} className="theme-section">


            <div className="vs2-grid">
              {images.map((item, idx) => (
                <div
                  key={idx}
                  className={`vs2-card ${
                    selectedImage?.img === item.img ? "active" : ""
                  }`}
                  onClick={() => handleImageClick(themeId, item)}
                >
                  {item.img && (
                    <img src={item.img} className="vs2-card-img" alt="" />
                  )}

                  <div className="vs2-card-label">{item.name}</div>

                  {selectedImage?.img === item.img && (
                    <div className="vs2-check">✔</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* FOOTER */}
        <div className="vs2-footer">
          <button
            className="vs2-btn"
            disabled={!selectedImage}
            onClick={() =>
              onContinue({
                theme: selectedTheme,
                img: selectedImage?.img,
                name: selectedImage?.name,
              })
            }
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default SelectTheam;