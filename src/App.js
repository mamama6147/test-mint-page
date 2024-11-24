import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import axios from "axios";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function App() {
  // MerkleProof
  let { MerkleTree } = require("merkletreejs");
  let keccak256 = require("keccak256");

  const allowlist = require("./allowlist.json");

  // マークルツリー生成
  const hashedAddresses = allowlist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(hashedAddresses, keccak256, {
    sortPairs: true,
  });
  // マークルルートを生成
  const merkleRoot = merkleTree.getHexRoot();

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(
    `ボタンを押してミントしよう.`
  );
  const [mintAmount, setMintAmount] = useState(1);
  const [mintAmountAl, setMintAmountAl] = useState(1);
  const [minted, setminted] = useState(0);
  // const [mintedAl, setmintedAl] = useState(0);
  // const [al, setal] = useState(false);

  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST_AL: 0,
    WEI_COST: 0,
    DISPLAY_COST_AL: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const mintNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let amount = mintAmount;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * amount);
    let totalGasLimit = String(gasLimit * amount);

    console.log("mintingMFTs: ", totalCostWei);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`${CONFIG.NFT_NAME} ミント中...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(amount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
        maxPriorityFeePerGas: "40000000000",
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("ミントに失敗しました.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`ミントに成功しました!`);
        setClaimingNft(false);
        // checkMinted();
        // checkMintedAl();
        // dispatch(fetchData(blockchain.account));
      });
  };

  // const claimNFTsAl = () => {
  //   let cost = CONFIG.WEI_COST_AL;
  //   let amount = mintAmountAl;
  //   let gasLimit = CONFIG.GAS_LIMIT;
  //   let totalCostWei = String(cost * amount);
  //   let totalGasLimit = String(gasLimit * amount);
  //   let proof = merkleTree.getHexProof(keccak256(blockchain.account));

  //   console.log("ClaimMFTs at preSale: ", totalCostWei);
  //   console.log("Cost: ", totalCostWei);
  //   console.log("Gas limit: ", totalGasLimit);
  //   setFeedback(`${CONFIG.NFT_NAME} プレオーダーミント中...`);
  //   setClaimingNft(true);
  //   blockchain.smartContract.methods
  //     .preMint(amount, proof)
  //     .send({
  //       gasLimit: String(totalGasLimit),
  //       to: CONFIG.CONTRACT_ADDRESS,
  //       from: blockchain.account,
  //       value: totalCostWei,
  //       maxPriorityFeePerGas: "40000000000",
  //     })
  //     .once("error", (err) => {
  //       console.log(err);
  //       setFeedback("プレオーダーミントに失敗しました.");
  //       setClaimingNft(false);
  //     })
  //     .then((receipt) => {
  //       console.log(receipt);
  //       setFeedback(`プレオーダーミントが成功しました!`);
  //       setClaimingNft(false);
  //       // checkMinted();
  //       // checkMintedAl();
  //       // dispatch(fetchData(blockchain.account));
  //     });
  // };

  // const claimNFTsPS = () => {
  //   let cost = CONFIG.WEI_COST;
  //   let amount = mintAmount;
  //   let gasLimit = CONFIG.GAS_LIMIT;
  //   let totalCostWei = String(cost * amount);
  //   let totalGasLimit = String(gasLimit * amount);

  //   console.log("ClaimMFTs at pubSale: ", totalCostWei);
  //   console.log("Cost: ", totalCostWei);
  //   console.log("Gas limit: ", totalGasLimit);
  //   setFeedback(`${CONFIG.NFT_NAME} ミント中...`);
  //   setClaimingNft(true);
  //   blockchain.smartContract.methods
  //     .pubMint(amount)
  //     .send({
  //       gasLimit: String(totalGasLimit),
  //       to: CONFIG.CONTRACT_ADDRESS,
  //       from: blockchain.account,
  //       value: totalCostWei,
  //       maxPriorityFeePerGas: "40000000000",
  //     })
  //     .once("error", (err) => {
  //       console.log(err);
  //       setFeedback("ミントに失敗しました.");
  //       setClaimingNft(false);
  //     })
  //     .then((receipt) => {
  //       console.log(receipt);
  //       setFeedback(`ミントに成功しました!`);
  //       setClaimingNft(false);
  //       // checkMinted();
  //       // checkMintedAl();
  //       // dispatch(fetchData(blockchain.account));
  //     });
  // };

  // const checkAl = () => {
  //   // マークルプルーフを生成
  //   let proof = merkleTree.getHexProof(keccak256(blockchain.account));
  //   if (proof.length >= 1) {
  //     setal(true);
  //   } else {
  //     setal(false);
  //   }
  // };

  // const checkMinted = () => {
  //   if (blockchain.account !== "" && blockchain.smartContract !== null) {
  //     blockchain.smartContract.methods
  //       .claimed(blockchain.account)
  //       .call()
  //       .then((receipt) => {
  //         setminted(receipt);
  //         dispatch(fetchData(blockchain.account));
  //       });
  //   }
  // };

  // const checkMintedAl = () => {
  //   if (blockchain.account !== "" && blockchain.smartContract !== null) {
  //     blockchain.smartContract.methods
  //       .claimedAl(blockchain.account)
  //       .call()
  //       .then((receipt) => {
  //         setmintedAl(receipt);
  //         dispatch(fetchData(blockchain.account));
  //       });
  //   }
  // };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10 - minted) {
      newMintAmount = 10 - minted;
    }
    setMintAmount(newMintAmount);
  };

  const decrementMintAmountAl = () => {
    let newMintAmount = mintAmountAl - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    if (newMintAmount > 2 - mintedAl) {
      newMintAmount = 2 - mintedAl;
    }
    setMintAmountAl(newMintAmount);
  };

  const incrementMintAmountAl = () => {
    let newMintAmount = mintAmountAl + 1;
    if (newMintAmount > 2 - mintedAl) {
      newMintAmount = 2 - mintedAl;
    }
    setMintAmountAl(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
    // checkMinted();
    // checkMintedAl();
    // checkAl();
  }, []);

  useEffect(() => {
    getData();
    console.log(data)
    // checkMinted();
    // checkMintedAl();
    // checkAl();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 20, backgroundColor: "rgba(0,0,0,0)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/学校.jpg" : null}
      >
        <s.StyledKeyImg alt={"logo"} src={"/config/images/header.jpg"} />
        <s.ResponsiveWrapper flex={1} style={{ padding: 10 }} test>
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              // backgroundColor: "var(--accent)",
              padding: 24,
              // borderRadius: 24,
              border: "4px var(--secondary)",
              // boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
            style={{ textAlign: "center" }}
            >
              NFT ミントページ
            </s.TextTitle>
            <s.SpacerSmall />
            <s.TextSubTitle
            // style={{ textAlign: "center" }}
            >
              NFTの購入体験をしていただくためのページです。
            </s.TextSubTitle>
            <s.SpacerLarge />
            <s.StyledLogo alt={"logo"} src={"/config/images/logo512.png"} />
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                // color: "var(--accent-text)",
              }}
            >
              <s.SpacerMedium />
              <s.TextDescription
                style={{ textAlign: "center" }}
              ></s.TextDescription>
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.SpacerSmall />
            <s.TextTitle style={{ textAlign: "center" }}>
              販売スケジュール
            </s.TextTitle>
            <s.TextDescription style={{ textAlign: "center" }}>
              セール終了
              {/* <br />
              <s.SpacerXSmall />
              パブリックセール: <br class={"sp-only"} />
              2023/11/19 19:00 ~ 11/25 18:50<br />
              <s.SpacerXSmall />
              リビール: <br class={"sp-only"} />
              2023/11/25 19:00頃
              <br /> */}
            </s.TextDescription>
            <s.SpacerMedium />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {CONFIG.NFT_NAME} 完売御礼！
                </s.TextTitle>
                <s.StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE} で {CONFIG.NFT_NAME} を探す
                </s.StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle style={{ textAlign: "center" }}>価格</s.TextTitle>
                <s.TextSubTitle style={{ textAlign: "center" }}>
                  {"パブリックミント: "}
                  {CONFIG.DISPLAY_COST}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextSubTitle>
                <s.TextDescription style={{ textAlign: "center" }}>
                  + ガス代
                </s.TextDescription>
                <s.SpacerMedium />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <s.StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      ウォレットを接続
                    </s.StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextTitle style={{ textAlign: "center" }}>
                      ミントメニュー
                    </s.TextTitle>
                    <s.SpacerXSmall />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <s.Container>
                      {/* PSここから */}
                      {!(data.paused) ? ( //PS開始チェック
                        <>
                          {minted >= 3 ? ( //ミント済確認
                            <>
                              <s.SpacerMedium />
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <s.StyledButtonPS
                                  disabled={1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  {
                                    "最大枚数ミント済"
                                  }
                                </s.StyledButtonPS>
                              </s.Container>
                            </>
                          ) : (
                            //残りミント可能枠有り
                            <>
                              <s.Container>
                                <s.Container
                                  ai={"center"}
                                  jc={"center"}
                                  fd={"row"}
                                >
                                  {/* <s.TextSubTitle
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    パブリックセール
                                    <br class={"sp-only"} /> {minted} / 3
                                    ミント済
                                  </s.TextSubTitle>
                                  <s.SpacerSmall /> */}
                                </s.Container>
                                <s.Container
                                  ai={"center"}
                                  jc={"center"}
                                  fd={"row"}
                                >
                                  <s.StyledRoundButton
                                    style={{ lineHeight: 0.4 }}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrementMintAmount();
                                    }}
                                  >
                                    -
                                  </s.StyledRoundButton>
                                  <s.SpacerMedium />
                                  <s.TextDescription
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {mintAmount}
                                  </s.TextDescription>
                                  <s.SpacerMedium />
                                  <s.StyledRoundButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      incrementMintAmount();
                                    }}
                                  >
                                    +
                                  </s.StyledRoundButton>
                                </s.Container>
                              </s.Container>
                              <s.SpacerSmall />
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <s.StyledButtonPS
                                  disabled={claimingNft ? 1 : 0} //claimingNftPsがtrueなら disabledを表示させる。＝クリックできない
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // claimNFTsPS();
                                    mintNFTs();
                                    getData();
                                  }}
                                >
                                  {claimingNft ? "ミント中..." : "ミント開始"}
                                </s.StyledButtonPS>
                              </s.Container>
                              {minted > 0 ? <></> : <></>}
                            </>
                          )}
                        </>
                      ) : (
                        //PS開始前
                        <>
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <s.TextDescription>
                              {"パブリックセール開始までお待ちください."}
                            </s.TextDescription>
                          </s.Container>
                        </>
                      )}

                      {/* PSここまで */}
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerLarge />
            <s.TextDescription style={{ textAlign: "center" }}>
              外部リンク
            </s.TextDescription>
            <s.SpacerXSmall />
            <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
              <s.StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                {CONFIG.MARKETPLACE}
              </s.StyledLink>
              <s.SpacerXSmall />
              <s.StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {/* {truncate(CONFIG.CONTRACT_ADDRESS, 15)} */}
                Etherscan
              </s.StyledLink>
              {/* <s.StyledLinkTwi
                target={"_blank"}
                href={"https://twitter.com/guild_ntp_oa"}
              >
                
              </s.StyledLinkTwi> */}
            </s.Container>
          </s.Container>
        </s.ResponsiveWrapper>
      </s.Container>
    </s.Screen>
  );
}

export default App;
