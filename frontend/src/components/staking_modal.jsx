import React, { useState } from "react";

const StakeModal = (props) => {
  const { setPool, onClose, setAmount, staking } = props;

  return (
    <>
      <div className="modal-class" onClick={props.onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-body">
            <h2 className="titleHeader">Stake Tokens</h2>

            <div className="row">
              <div className="col-md-9 fieldContainer">
                <input
                  className="inputField"
                  placeholder="0"
                  onChange={(e) => props.setPool(e.target.value)}
                />
              </div>
              <div className="col-md-3 inputFieldUnitsContainer">
                <span>pool</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-9 fieldContainer">
                <input
                  className="inputField"
                  placeholder="0"
                  onChange={(e) => props.setAmount(e.target.value)}
                />
              </div>
              <div className="col-md-3 inputFieldUnitsContainer">
                <span>token</span>
              </div>
            </div>
            <div className="row">
              <div onClick={() => staking()} className="btn-color">
                Stake
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StakeModal;
