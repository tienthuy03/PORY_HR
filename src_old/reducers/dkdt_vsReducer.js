import {
  FETCH_DKDT_VS,
  FETCH_DKDT_VS_SUCCESS,
  FETCH_DKDT_VS_FAILED,
  DELETE_DKDT_VS,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const dkdt_vsReducer = (dkdt_vs = initData, action) => {
  switch (action.type) {
    case FETCH_DKDT_VS:
      return {
        ...dkdt_vs,
        isLoading: true,
      };
    case FETCH_DKDT_VS_SUCCESS:
      return {
        ...dkdt_vs,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_DKDT_VS_FAILED:
      return {
        ...dkdt_vs,
        data: {},
        isLoading: false,
        error: 'Fetch dkdt_vs fail',
      };
    case DELETE_DKDT_VS:
      return initData;

    default:
      return dkdt_vs;
  }
};

export default dkdt_vsReducer;
