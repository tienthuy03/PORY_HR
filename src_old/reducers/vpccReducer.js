import {
  FETCH_VPCC,
  FETCH_VPCC_SUCCESS,
  FETCH_VPCC_FAILED,
  DELETE_VPCC,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const vpccReducer = (vpcc = initData, action) => {
  switch (action.type) {
    case FETCH_VPCC:
      return {
        ...vpcc,
        isLoading: true,
      };
    case FETCH_VPCC_SUCCESS:
      return {
        ...vpcc,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_VPCC_FAILED:
      return {
        ...vpcc,
        data: {},
        isLoading: false,
        error: 'Fetch VPCC fail',
      };
    case DELETE_VPCC:
      return initData;

    default:
      return vpcc;
  }
};

export default vpccReducer;
