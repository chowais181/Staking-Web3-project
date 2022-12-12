import React, { useState } from 'react';

const RewardModal = props => {
  const {
    setPool,
    setIndex,
    onClose,
    reward,
    getIndexes,
    indexes,
  } = props

  return (
    <>
      <div className="modal-class" onClick={props.onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-body">
            <h2 className="titleHeader">Reward</h2>
            
            <button onClick={getIndexes} className="btn-color">user stakings on pool</button>
            <h3>{indexes.toString()}</h3>
            
            <div className="row">
              <div className="col-md-9 fieldContainer">
                <input
                  className="inputField"
                  placeholder="0"
                  onChange={e => props.setPool(e.target.value)}
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
                  onChange={e => props.setIndex(e.target.value)}
                />
              </div>
              <div className="col-md-3 inputFieldUnitsContainer">
                <span>index</span>
              </div>
            </div>
            <div className="row">
              <div
                onClick={() => reward()}
                className="btn-color"
              >
                claim reward
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default RewardModal