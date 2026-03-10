import React, { useState, useRef } from "react";
import { IoChevronBack } from "react-icons/io5";

import "./ReviewConfirm.css";

import voucherImg from "../../assets/REVIEW/Ru.png";
import recipientsImg from "../../assets/REVIEW/recipients.png";
import tickSound from "../../assets/MUSIC/tik.mp3";

const ReviewConfirm = ({
  voucherValue,
  occasion,
  recipients,
  selectedBrands,
  onEditValue,
  onEditOccasion,
  onEditRecipients,
  onEditBrands,
  onSubmit
}) => {

  const [index,setIndex] = useState(0);
  const soundRef = useRef(new Audio(tickSound));

  const playSound = ()=>{
    soundRef.current.currentTime = 0;
    soundRef.current.play();
  };

  const next = ()=>{
    setIndex(prev => (prev + 1) % selectedBrands.length);
    playSound();
  };

  const prev = ()=>{
    setIndex(prev =>
      prev === 0 ? selectedBrands.length - 1 : prev - 1
    );
    playSound();
  };

  const getBrand = (i)=>{
    return selectedBrands[
      (index + i + selectedBrands.length) % selectedBrands.length
    ];
  };

  return (

    <div className="rc-container">

      {/* HEADER */}

      <div className="rc-header">

        <button className="rc-back-btn" onClick={onEditValue}>
          <IoChevronBack size={26}/>
        </button>

        <h2 className="rc-title">Review & Confirm</h2>

        <div style={{width:26}}/>

      </div>


      {/* SUMMARY */}

      <h3 className="rc-summary-title">
        Summary of your request
      </h3>

      <p className="rc-summary-sub">
        Here's a recap of your voucher request.
      </p>


      {/* VALUE */}

      <div className="rc-card">

        <div className="rc-left">

          <span className="rc-label">
            VALUE PER VOUCHER
          </span>

          <h2 className="rc-value">
            ₹{voucherValue}.00
          </h2>

          <button
            className="rc-edit-btn"
            onClick={onEditValue}
          >
            Edit
          </button>

        </div>

        <img src={voucherImg} className="rc-img" alt=""/>

      </div>


      {/* OCCASION */}

      <div className="rc-card">

        <div className="rc-left">

          <span className="rc-label">
            OCCASION
          </span>

          <h2 className="rc-value">
            {occasion?.name}
          </h2>

          <button
            className="rc-edit-btn"
            onClick={onEditOccasion}
          >
            Edit
          </button>

        </div>

        {occasion?.img &&
          <img src={occasion.img} className="rc-img" alt="occasion"/>
        }

      </div>


      {/* RECIPIENTS */}

      <div className="rc-card">

        <div className="rc-left">

          <span className="rc-label">
            RECIPIENTS
          </span>

          <h2 className="rc-value">
            {recipients}
          </h2>

          <button
            className="rc-edit-btn"
            onClick={onEditRecipients}
          >
            Edit
          </button>

        </div>

        <img src={recipientsImg} className="rc-img" alt=""/>

      </div>


      {/* BRAND CAROUSEL */}

      <div className="rc-card rc-brands">

        <div className="rc-left">

          <span className="rc-label">
            SELECTED BRANDS
          </span>

          <h2 className="rc-brand-text">
            {getBrand(0)?.label}
          </h2>

          <button
            className="rc-edit-btn"
            onClick={onEditBrands}
          >
            Edit
          </button>

        </div>


        <div className="rc-carousel">

          <button className="rc-arrow" onClick={prev}>
            ‹
          </button>

          <div className="rc-carousel-track">

            {selectedBrands.length > 1 &&
              <img src={getBrand(-1)?.img} className="rc-brand-small" alt=""/>
            }

            <img src={getBrand(0)?.img} className="rc-brand-big" alt=""/>

            {selectedBrands.length > 1 &&
              <img src={getBrand(1)?.img} className="rc-brand-small" alt=""/>
            }

          </div>

          <button className="rc-arrow" onClick={next}>
            ›
          </button>

        </div>

      </div>


      {/* TOTAL */}

      <p className="rc-total">
        Total estimated value: ₹{(voucherValue * recipients).toFixed(2)}
      </p>


      {/* BUTTON */}

      <button className="rc-submit-btn" onClick={onSubmit}>
        Get Code ➤
      </button>

    </div>

  );
};

export default ReviewConfirm;