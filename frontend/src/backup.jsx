import './App.css'
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Staking_contract from './artifacts/contracts/staking _contract.sol/stakingContract.json'
import Form from "./components/form.jsx";
function App(){
  const [provider ,setProvider] = useState(undefined);
  const [signer , setSigner] = useState(undefined);
  const [signerAddress , setSignerAddress] = useState(undefined);
  const [stakingContract, setStakingContract] = useState(undefined);
  const [timeLock, setTimeLock] = useState("Timelock in seconds");
  const [error, setError] = useState("");
  const [PoolAndIndex, setPoolAndIndex] = useState({
    pool: "",
    index: "",
    value: "",
  });

  const [show, setShow] = useState();
  const [indexes, setIndexes] =useState([]);
  const [time, setTime] = useState(undefined);
  
  const Toggle = () => {
    setShow(!show);
    getTimeLock();
  }
  const handleChange = (event) => {
    setPoolAndIndex({ ...PoolAndIndex, [event.target.name]: event.target.value});
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setPoolAndIndex({ pool: "", index: "", value: "" });
  };

  // const [poolsContract, setPoolsContract] = useState({});
  // const [poolsBalance, setPoolsBalance] = useState({});
  // const [poolsSymbol, setPoolsSymbol] = useState({});


  // const [amount, setAmount] = useState(0);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedSymbol, setSelectedSymbol] = useState(undefined);
  // const [isDeposit, setIsDeposit] = useState(true);

  const toWei = ether => ( ethers.utils.parseEther(ether) );
  const toEther = wei => ( ethers.utils.formatEther(wei).toString() );
  // const toRound = num => ( Number(num).toFixed(2) );

  useEffect(() => {
    const initialize = async () => { 
      setProvider(await new ethers.providers.Web3Provider(window.ethereum));
      setStakingContract ( await new ethers.Contract("0xa513E6E4b8f2a923D98304ec87F64353C4D5C853", Staking_contract.abi));
      // setStakingContract(stacking_addr);
      console.log("reload");
    }
    initialize();
  }, []);

  // useEffect(() => {
  //   const get_time = async () => {
  //     const check = await stakingContract.time_now().send({ from: account[0] })
  //     .then(result => {
  //       setNow(result);
  //       console.log("useeffect")
  //       console.log(when.toString())
  //       console.log(result.toString())
  //       console.log((when.toString() - result.toString()));
  //     })
  //     .catch(err => {
  //     alert(err.message);
  //   })
  //   setTime(check.toString());
  //   console.log("useEffect:",check.toString());
  //   }
  //   get_time();
  // },[now])

  const isConnected = () => (signer !== undefined)

  const getSigner = async provider => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    signer.getAddress()
      .then(address => {
        setSignerAddress(address)
      })

    return signer
  }

  const connect = () => {
    getSigner(provider)
      .then(signer => {
        setSigner(signer)
        // getTokenBalance(signer)
      })
  }

  const getTimeLock = async () =>{
    const time = await stakingContract.connect(signer).TimeLock_on_fixed_pool();
    setTimeLock(time.toString());
    
  }
  const TimeRemainingforReward = async () =>
  {
    let x = await stakingContract.connect(signer).time_now();
    console.log("num: ",x.toString());
    setTime(x.toString()) ;
    console.log("time: ",time);
    // setNow( await stakingContract.connect(signer).time_now());
    // .then((result) => {
    //   setNow(result.toString());
    //   console.log("now: ", now) 
    //   })
    // .catch((err) =>{
    //   setError(err);
    //   console.log(err);
    //   alert(err.message);
    // })
    // setWhen( await stakingContract.connect(signer).time_when_staked(PoolAndIndex.pool, PoolAndIndex.index));
    // .then((result) => {
    //   setWhen(result.toString());
    // // var left = (result.toString() - 100) - t;
    // console.log("when: ", when.toString());
    // console.log("now: ", now.toString());  
    // })
    // .catch((err) =>{
    //   setError(err);
    //   console.log(err);
    //   alert(err.message);
    // })
    // var left = (when + 100) - now;
    // console.log("left: ",left);
    // setWhen(0);
    // setNow(0);
    // var left = now.toString() - when.toString(); 
    // console.log("when: ", when.toString());
    // console.log("now: ", now.toString());
    // console.log("left: ", left);
    // setTime(await stakingContract.connect(signer).time_when_reward_will_receive(PoolAndIndex.pool, PoolAndIndex.index));
    // setTemp(1);
    // const decimals = 18;
    // const amount = ethers.utils.parseUnits(check.toString(), decimals)
    // console.log(check);
    // console.log("time:",time.toString());
    // setTime(check.toString());
  }
  const getIndexes = async() => {
    setIndexes ( await stakingContract.connect(signer).staker_indexex_per_pool(PoolAndIndex.pool));
    console.log("array", indexes.toString())
    setTime(0);

  }
  const stake = async () => {
    var wei = toWei(PoolAndIndex.value);
    wei = wei.toString();
    console.log("value: ",wei.toString())
    const check = await stakingContract.connect(signer).staking(PoolAndIndex.pool, wei)
    .catch((err) =>{
      setError(err);
      console.log(err);
      alert(err.message);
    })
  }
  const reward = async () => {
    const check = await stakingContract.connect(signer).reward(PoolAndIndex.pool,PoolAndIndex.index)
    .catch((err) =>{
      setError(err);
      console.log(err);
      alert(err.message);
    })
  }
  return(
   <div className = "App">
      <header className="App-header">
      {isConnected() ? (
        <div>

          {/* <div>
            <p>
              Welcome {signerAddress?.substring(0,10)}...
            </p>
            <p>
              Contract Address:  {stakingContract.address}
              {console.log("instance: ",stakingContract.address)}
            </p>
            <button onClick={Toggle} className="btn btn-primary">{!show ? " TimeLock in seconds" : "Hide"}</button>
            {show ? <h4> {timeLock}</h4> : ""}
            <button onClick={getIndexes} className="btn btn-primary">user indexes on pool</button>
            <h3>{indexes.toString()}</h3>
            <button onClick={TimeRemainingforReward} className="btn btn-primary">Time Remaining</button>
            <h3>{time}</h3>
            <button onClick={stake} className="btn btn-primary">Stake</button>
            <button onClick={reward} className="btn btn-primary">Get Reward</button>

          </div> */}
          <Form stakingContract={stakingContract} signer={signer}/>
          {/* <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Pool: </label>
                <input
                  type="number"
                  name="pool"
                  placeholder="Pool_No"
                  value={PoolAndIndex.pool}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Index: </label>
                <input
                  type="number"
                  name="index"
                  placeholder="Index_No"
                  value={PoolAndIndex.index}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Amount: </label>
                <input
                  type="number"
                  name="value"
                  placeholder="amount in ether"
                  value={PoolAndIndex.value}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button>clean</button>
              </div>
            </form> */}
            {/* <h3>{PoolAndIndex.pool}</h3>
            <h4>{PoolAndIndex.index}</h4>
            <h5>{PoolAndIndex.value}</h5> */}
          {/* </div>  */}
        </div>
      ) : (
          <div>
            <p>
              You are not connected
            </p>
            <button onClick={connect} className="btn btn-primary">Connect Metamask</button>
          </div>
        )}
      </header>
   </div> 
  );
}
export default App; 