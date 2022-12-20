// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.tokenCount()
        .call();
        let alSaleStart = await store
        .getState()
        .blockchain.smartContract.methods.presale()
        .call();
        let saleStart = await store
        .getState()
        .blockchain.smartContract.methods.publicsale()
        .call();


      dispatch(
        fetchDataSuccess({
          totalSupply,
          alSaleStart,
          saleStart, 
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};