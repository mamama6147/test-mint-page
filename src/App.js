import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import axios from "axios";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--button-bg);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButtonPS = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: var(--button-bg);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButtonUnlock = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: purple;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  border: 4px var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const StyledLinkTwi = styled.a`
  color: var(--accent-text);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Push mint bottun to get Becha.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintAmountAl, setMintAmountAl] = useState(1);
  const [minted, setminted] = useState(0);
  const [al, setal] = useState(false);

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

  const claimNFTsAl = () => {
    let cost = CONFIG.WEI_COST_AL;
    let amount = mintAmountAl;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * amount);
    let totalGasLimit = String(gasLimit * amount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`${CONFIG.NFT_NAME} minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .preMint(amount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
        maxPriorityFeePerGas: "40000000000",
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Mint failed. Try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`${CONFIG.NFT_NAME} mint success! Check your wallet.`);
        setClaimingNft(true);
        checkMinted();
        // dispatch(fetchData(blockchain.account));
      });
  };

  const claimNFTsPS = () => {
    let cost = CONFIG.WEI_COST;
    let amount = mintAmount;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * amount);
    let totalGasLimit = String(gasLimit * amount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`${CONFIG.NFT_NAME} minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .publicMint(amount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
        maxPriorityFeePerGas: "40000000000",
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Mint failed. Try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`${CONFIG.NFT_NAME} mint success! Check your wallet.`);
        setClaimingNft(false);
        checkMinted();
        // dispatch(fetchData(blockchain.account));
      });
  };

  const checkAl = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.smartContract.methods
        .Allowlists(blockchain.account)
        .call()
        .then((receipt) => {
          setal(receipt);
          // dispatch(fetchData(blockchain.account));
        });
    }
  };

  const checkMinted = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      blockchain.smartContract.methods
        .Minted(blockchain.account)
        .call()
        .then((receipt) => {
          setminted(receipt);
          dispatch(fetchData(blockchain.account));
        });
    }
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2 - minted) {
      newMintAmount = 2 - minted;
    }
    setMintAmount(newMintAmount);
  };

  const decrementMintAmountAl = () => {
    let newMintAmount = mintAmountAl - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmountAl(newMintAmount);
  };

  const incrementMintAmountAl = () => {
    let newMintAmount = mintAmountAl + 1;
    if (newMintAmount > 2 - minted) {
      newMintAmount = 2 - minted;
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
    checkMinted();
    checkAl();
  }, []);

  useEffect(() => {
    getData();
    checkMinted();
    checkAl();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            {/* <StyledImg
              alt={"left_side"}
              src={"/config/images/left_side.png"}
              style={{
                padding: 24,
                backgroundColor: "var(--primary)",
              }}
            /> */}
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <StyledLogo alt={"logo"} src={"/config/images/sample.png"} />
            
            <s.TextTitle
              style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
              {"No Roadmap, No Discord, No Utility, No Rarity."}
            </s.TextTitle>
            <s.TextTitle
              style={{ textAlign: "center", color: "var(--accent-text)" }}
            >
              {"Sale: 2022/11/14 21:00 JST ~ (Open: 48 hours)"}
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              <s.SpacerXSmall />
              <s.TextDescription
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              ></s.TextDescription>
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {CONFIG.NFT_NAME} sold out. Thank you.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {"You can 2 mint Per wallet."}
                </s.TextTitle>
                <br />
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs
                </s.TextTitle>
                <s.SpacerXSmall />

                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {"AL Sale: "}
                  {CONFIG.DISPLAY_COST_AL}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextTitle>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {"Public Sale: "}
                  {CONFIG.DISPLAY_COST}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  + Gas costs.
                </s.TextDescription>
                <br />
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Connect your wallet
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.TextTitle
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {""}
                      {minted}
                      {" / 2 minted"}
                    </s.TextTitle>

                    <s.SpacerMedium />
                    <s.Container>
                      {/* ALチェックここから */}
                      {al > 0 ? ( //AL所有確認
                        <>
                          {data.alSaleStart ? ( // セール開始前
                            <>
                              {minted >= 2 ? ( //ミント済確認
                                <>
                                  <s.Container
                                    ai={"center"}
                                    jc={"center"}
                                    fd={"row"}
                                  >
                                    <StyledButton
                                      disabled={1} //claimingNftPsがtrueなら disabledを表示させる。＝クリックできない
                                      onClick={(e) => {
                                        e.preventDefault();
                                      }}
                                    >
                                      {"Your 2 mint is done."}
                                    </StyledButton>
                                  </s.Container>
                                </>
                              ) : (
                                //残りミント可能枠有り
                                <>
                                  <s.SpacerMedium />
                                  <s.Container>
                                    <s.Container
                                      ai={"center"}
                                      jc={"center"}
                                      fd={"row"}
                                    >
                                      <s.SpacerXSmall />
                                      <StyledRoundButton
                                        style={{ lineHeight: 0.4 }}
                                        disabled={claimingNft ? 1 : 0}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          decrementMintAmountAl();
                                        }}
                                      >
                                        -
                                      </StyledRoundButton>
                                      <s.SpacerMedium />
                                      <s.TextDescription
                                        style={{
                                          textAlign: "center",
                                          color: "var(--accent-text)",
                                        }}
                                      >
                                        {mintAmount}
                                      </s.TextDescription>
                                      <s.SpacerMedium />
                                      <StyledRoundButton
                                        disabled={claimingNft ? 1 : 0}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          incrementMintAmountAl();
                                        }}
                                      >
                                        +
                                      </StyledRoundButton>
                                    </s.Container>
                                  </s.Container>
                                  <s.SpacerSmall />
                                  <s.Container
                                    ai={"center"}
                                    jc={"center"}
                                    fd={"row"}
                                  >
                                    <StyledButton
                                      disabled={claimingNft ? 1 : 0} //claimingNftPsがtrueなら disabledを表示させる。＝クリックできない
                                      onClick={(e) => {
                                        e.preventDefault();
                                        claimNFTsAl();
                                        getData();
                                      }}
                                    >
                                      {claimingNft ? "Minting..." : "AL Mint"}
                                    </StyledButton>
                                  </s.Container>
                                </>
                              )}
                            </>
                          ) : (
                            // セール開始前
                            <>
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <s.TextDescription
                                  style={{
                                    color: "var(--accent-text)",
                                  }}
                                >
                                  {"You are registerd in AL."}
                                </s.TextDescription>
                              </s.Container>
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <s.TextDescription
                                  style={{
                                    color: "var(--accent-text)",
                                  }}
                                >
                                  {"ComingSoon."}
                                </s.TextDescription>
                              </s.Container>
                            </>
                          )}
                        </>
                      ) : (
                        //AL所有無し
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {"You don't have Allowlist."}
                          </s.TextDescription>
                        </s.Container>
                      )}
                      {/* ALチェックここまで */}

                      {/* PSここから */}
                      {data.saleStart ? ( //PS開始チェック
                        <>
                          {minted >= 2 ? ( //ミント済確認
                            <>
                              <s.SpacerMedium />
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <StyledButtonPS
                                  disabled={1}
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  {"Your 2 mint is done."}
                                </StyledButtonPS>
                              </s.Container>
                            </>
                          ) : (
                            //残りミント可能枠有り
                            <>
                              <s.SpacerMedium />
                              <s.Container>
                                <s.Container
                                  ai={"center"}
                                  jc={"center"}
                                  fd={"row"}
                                >
                                  <s.SpacerXSmall />
                                  <StyledRoundButton
                                    style={{ lineHeight: 0.4 }}
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrementMintAmount();
                                    }}
                                  >
                                    -
                                  </StyledRoundButton>
                                  <s.SpacerMedium />
                                  <s.TextDescription
                                    style={{
                                      textAlign: "center",
                                      color: "var(--accent-text)",
                                    }}
                                  >
                                    {mintAmount}
                                  </s.TextDescription>
                                  <s.SpacerMedium />
                                  <StyledRoundButton
                                    disabled={claimingNft ? 1 : 0}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      incrementMintAmount();
                                    }}
                                  >
                                    +
                                  </StyledRoundButton>
                                </s.Container>
                              </s.Container>
                              <s.SpacerSmall />
                              <s.Container
                                ai={"center"}
                                jc={"center"}
                                fd={"row"}
                              >
                                <StyledButtonPS
                                  disabled={claimingNft ? 1 : 0} //claimingNftPsがtrueなら disabledを表示させる。＝クリックできない
                                  onClick={(e) => {
                                    e.preventDefault();
                                    claimNFTsPS();
                                    getData();
                                  }}
                                >
                                  {claimingNft ? "Minting..." : "PS Mint"}
                                </StyledButtonPS>
                              </s.Container>
                              {minted > 0 ? <></> : <></>}
                            </>
                          )}
                        </>
                      ) : (
                        //PS開始前
                        <>
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <s.TextDescription
                              style={{
                                color: "var(--accent-text)",
                              }}
                            >
                              {"PS ComingSoon."}
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
            <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
              {CONFIG.MARKETPLACE}
            </StyledLink>
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            {/* <StyledImg
              alt={"right_side"}
              src={"/config/images/right_side.png"}
              style={{
                padding: 24,
                backgroundColor: "var(--primary)",
                // transform: "scaleX(-1)",
              }}
            /> */}
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          ></s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          ></s.TextDescription>
          <StyledLinkTwi
            target={"_blank"}
            href={"https://twitter.com/test"}
          >
            @twitter_account_test
          </StyledLinkTwi>
          <s.TextTitle
            style={{ textAlign: "center", color: "var(--accent-text)" }}
          ></s.TextTitle>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
