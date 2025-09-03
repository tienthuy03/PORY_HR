import {
  POST_XNTC,
  POST_XNTC_SUCCESS,
  POST_XNTC_FAILED,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const postXntcReducer = (xntc = initData, action) => {
  switch (action.type) {
    case POST_XNTC:
      return {
        ...xntc,
        isLoading: true,
      };
    case POST_XNTC_SUCCESS:
      return {
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case POST_XNTC_FAILED:
      return {
        ...xntc,
        data: {},
        isLoading: false,
        error: 'Post xntc fail',
      };

    default:
      return xntc;
  }
};

export default postXntcReducer;
