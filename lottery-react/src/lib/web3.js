import Web3 from "web3";

const ethEnabled = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    return true;
  }
  return false;
};

if (!ethEnabled()) {
  alert(
    "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
  );
}

export default window.web3;
