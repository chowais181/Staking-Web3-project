import React from 'react'

const NavBar = props => {
  return (
    <>
      <div className="navBar">
        <div className="navButton"><h3>STAKING MARKET</h3></div>
        {props.isConnected() ? (
          <div className="connectButton">
            Connected
          </div>
        ) : (
          <div
            onClick={() => props.connect()}
            className="connectButton">
              Connect Wallet
          </div>
        )}
      </div>
    </>
  )
}

export default NavBar