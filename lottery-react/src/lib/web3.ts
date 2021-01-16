import Web3 from "web3";

const ethEnabled = () => {
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    (window as any).web3 = new Web3(ethereum);
    ethereum.enable();
    return true;
  }
  return false;
};

if (!ethEnabled()) {
  alert(
    "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
  );
}

export default (window as any).web3 as Web3;
