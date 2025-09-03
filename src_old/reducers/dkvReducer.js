import {
  FETCH_DKV,
  FETCH_DKV_SUCCESS,
  FETCH_DKV_FAILED,
  DELETE_DKV,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const dkvReducer = (dkv = initData, action) => {
  switch (action.type) {
    case FETCH_DKV:
      return {
        ...dkv,
        isLoading: true,
      };
    case FETCH_DKV_SUCCESS:
      return {
        ...dkv,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_DKV_FAILED:
      return {
        ...dkv,
        data: {},
        isLoading: false,
        error: 'Fetch dkv fail',
      };
    case DELETE_DKV:
      return initData;

    default:
      return dkv;
  }
};

export default dkvReducer;
