import {
  FETCH_DKVV2,
  FETCH_DKVV2_SUCCESS,
  FETCH_DKVV2_FAILED,
  DELETE_DKVV2,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const dkvV2Reducer = (dkvV2 = initData, action) => {
  switch (action.type) {
    case FETCH_DKVV2:
      return {
        ...dkvV2,
        isLoading: true,
      };
    case FETCH_DKVV2_SUCCESS:
      return {
        ...dkvV2,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_DKVV2_FAILED:
      return {
        ...dkvV2,
        data: {},
        isLoading: false,
        error: 'Fetch dkvV2 fail',
      };
    case DELETE_DKVV2:
      return initData;

    default:
      return dkvV2;
  }
};

export default dkvV2Reducer;
