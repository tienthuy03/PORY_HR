import {
  FETCH_NPD,
  FETCH_NPD_SUCCESS,
  FETCH_NPD_FAILED,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const npdReducer = (npd = initData, action) => {
  switch (action.type) {
    case FETCH_NPD:
      return {
        ...npd,
        isLoading: true,
      };
    case FETCH_NPD_SUCCESS:
      return {
        ...npd,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_NPD_FAILED:
      return {
        ...npd,
        data: {},
        isLoading: false,
        error: 'Fetch xntc fail',
      };

    default:
      return npd;
  }
};

export default npdReducer;
