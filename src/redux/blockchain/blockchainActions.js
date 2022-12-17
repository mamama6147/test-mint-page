// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const changeWalletRequest = (payload) => {
  const { ethereum } = window;

  return ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{
      chainId: CONFIG.NETWORK.ID,
    }]
  }).then(() => {
    alert('Network has been changed. Please reconnect your wallet.')
  });
};


export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        if (networkId == CONFIG.NETWORK.ID) {
          const SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {

          //ネットワーク切り替え部分
          try {
            // check if the chain to connect to is installed
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              // params: [{ chainId: '0x1' }], // イーサチェーンのID（16進数）
              // params: [{ chainId: '0x4' }], // rinkebyのID（16進数）
              params: [{ chainId: '0x89' }], // polygonMainのID（16進数）
            });
          } catch (error) {
            // エラーの場合、チェーン追加を試みる
            if (error.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      // chainId: '0x1', //イーサ
                      // chainId: '0x4', //rinkeby
                      chainId: '0x89', //polygonMain
                      // rpcUrl: 'https://mainnet-infura.brave.com/',
                    },
                  ],
                });
              } catch (addError) {
                console.error(addError);
              }
            }
            console.error(error);
          }
          // dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`)); //コメントアウト
          alert('ネットワークを切り替えました。もう一度CONNECTしてみてください。'); //アラート表示
          dispatch(connectFailed(`もう一度CONNECTしてみてください。`)); //メッセ表示
          //ネットワーク切り替え部分終了

        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
