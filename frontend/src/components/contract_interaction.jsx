import { useState } from "react";
import { ethers } from "ethers";
import { Bank, Coin } from "react-bootstrap-icons";
import StakeModal from "./staking_modal.jsx";
import RewardModal from "./reward_modal.jsx";

const Contract_functions = (props) => {
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState(0);
  const [amount, setAmount] = useState(0);
  const [timeLock, setTimeLock] = useState("Timelock in seconds");
  const [show, setShow] = useState();
  const [indexes, setIndexes] = useState([]);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const openStakingModal = () => {
    setShowStakeModal(true);
  };

  const openRewardModal = () => {
    setShowRewardModal(true);
  };

  const toWei = (ether) => ethers.utils.parseEther(ether);

  const Toggle = () => {
    setShow(!show);
    getTimeLock();
  };

  const getTimeLock = async () => {
    const time = await props.stakingContract
      .connect(props.signer)
      .TimeLock_on_fixed_pool();
    setTimeLock(time.toString());
  };

  const getIndexes = async () => {
    var arr = await props.stakingContract
      .connect(props.signer)
      .staker_indexex_per_pool(pool);
    console.log(arr.toString());
    var array = Array.from(arr);
    var filtered = array.filter((index) => index != 0);
    setIndexes(filtered);
  };

  const stake = async () => {
    const wei = toWei(amount);
    const check = await props.stakingContract
      .connect(props.signer)
      .staking(pool, wei)
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };

  const reward = async () => {
    const check = await props.stakingContract
      .connect(props.signer)
      .reward(pool, index)
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };
  return (
    <>
      <div className="App-body">
        <div className="marketContainer">
          <div className="subContainer">
            <span className="marketHeader">Staking Pools</span>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div onClick={() => openStakingModal()} className="marketOption">
                <div className="glyphContainer hoverButton">
                  <span className="glyph">
                    <Bank />
                  </span>
                </div>
                <div className="optionData">
                  <span>Fixed(1-3)</span>
                  <span className="optionPercent">5%</span>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div onClick={() => openStakingModal()} className="marketOption">
                <div className="glyphContainer hoverButton">
                  <span className="glyph">
                    <Bank />
                  </span>
                </div>
                <div className="optionData">
                  <span>Flexible(4-6)</span>
                  <span className="optionPercent">5-7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="marketContainer">
        <div className="subContainer">
          <span className="marketHeader">Staking Reward</span>
        </div>

        <div className="row">
          <div className="col-md-6 ">
            <div onClick={() => openRewardModal()} className="marketOption">
              <div className="glyphContainer hoverButton">
                <span className="glyph">
                  <Coin />
                </span>
              </div>
              <div className="optionData">
                <span>Claim Reward</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 ">
            <button onClick={Toggle} className="btn-color-time">
              {!show ? " TimeLock" : "Hide"}
            </button>
            {show ? <h4> {timeLock} seconds to wait</h4> : ""}
          </div>
        </div>
      </div>
      {showStakeModal && (
        <StakeModal
          setPool={setPool}
          onClose={() => setShowStakeModal(false)}
          setAmount={setAmount}
          staking={stake}
        />
      )}
      {showRewardModal && (
        <RewardModal
          setPool={setPool}
          setIndex={setIndex}
          onClose={() => setShowRewardModal(false)}
          reward={reward}
          getIndexes={getIndexes}
          indexes={indexes}
        />
      )}
    </>
  );
};
export default Contract_functions;
