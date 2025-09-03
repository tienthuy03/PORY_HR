import {
  FETCH_TTCN,
  FETCH_TTCN_SUCCESS,
  FETCH_TTCN_FAILED,
  DELETE_TTCN,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const ttcnReducer = (ttcn = initData, action) => {
  switch (action.type) {
    case FETCH_TTCN:
      return {
        ...ttcn,
        isLoading: true,
      };
    case FETCH_TTCN_SUCCESS:
      return {
        ...ttcn,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_TTCN_FAILED:
      return {
        ...ttcn,
        data: {},
        isLoading: false,
        error: 'Fetch ttcn fail',
      };
    case DELETE_TTCN:
      return initData;
    default:
      return ttcn;
  }
};

export default ttcnReducer;
