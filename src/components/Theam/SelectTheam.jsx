import React, { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";

import "./SelectTheam.css";
import FestivalPopup from "../../components/Theam/TheamPopup";

const BASE_URL = "https://grateful-warmth-production-b64e.up.railway.app";

const SelectTheam = ({ onBack, onContinue }) => {

  const [selected, setSelected] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [config, setConfig] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {

    fetch(`${BASE_URL}/api/admin/config`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => setConfig({}));

  }, []);

  const cards = [
    {
      id: "theme1",
      label: config.themeName1,
      img: config.themeImg1 ? BASE_URL + config.themeImg1 : null,
    },
    {
      id: "theme2",
      label: config.themeName2,
      img: config.themeImg2 ? BASE_URL + config.themeImg2 : null,
    },
    {
      id: "theme3",
      label: config.themeName3,
      img: config.themeImg3 ? BASE_URL + config.themeImg3 : null,
    },
    {
      id: "theme4",
      label: config.themeName4,
      img: config.themeImg4 ? BASE_URL + config.themeImg4 : null,
    },
  ];

  return (
    <div className="vs2-container">

      <div className="vs2-header">

        <button className="vs2-back-btn" onClick={onBack}>
          <IoChevronBack size={26} />
        </button>

        <h3 className="vs2-title">Voucher Request</h3>

        <div style={{width:26}} />

      </div>

      <div className="vs2-step-text">
        STEP 3: THEME SELECTION
      </div>

      <div className="vs2-progress-bar">
        <div className="vs2-progress" />
      </div>

      <h2 className="vs2-question">
        What's the occasion?
      </h2>

      <div className="vs2-grid">

        {cards.map((card) => (

          <div
            key={card.id}
            className={`vs2-card ${selected === card.id ? "active" : ""}`}
            onClick={() => {
              setSelected(card.id);
              setShowPopup(true);
            }}
          >

            {card.img && (
              <img
                src={card.img}
                className="vs2-card-img"
                alt=""
              />
            )}

            <div className="vs2-card-label">
              {card.label}
            </div>

            {selected === card.id && (
              <div className="vs2-check">✔</div>
            )}

          </div>

        ))}

      </div>

      <button
        className="vs2-btn"
        onClick={() =>
          onContinue({
            id: selected,
            name: cards.find(c => c.id === selected)?.label,
            img: selectedImage?.img,
            imageName: selectedImage?.name
          })
        }
      >
        Continue
      </button>

      <FestivalPopup
        isOpen={showPopup}
        onClose={(imgObj) => {
          setShowPopup(false);
          if (imgObj) setSelectedImage(imgObj);
        }}
        themeId={selected}
        config={config}
        baseUrl={BASE_URL}
      />

    </div>
  );
};

export default SelectTheam;