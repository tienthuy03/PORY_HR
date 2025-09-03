import {
  FETCH_PDDT_VS,
  FETCH_PDDT_VS_SUCCESS,
  FETCH_PDDT_VS_FAILED,
  DELETE_PDDT_VS,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const approvalReducer = (approval = initData, action) => {
  switch (action.type) {
    case FETCH_PDDT_VS:
      return {
        ...approval,
        isLoading: true,
      };
    case FETCH_PDDT_VS_SUCCESS:
      return {
        ...approval,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_PDDT_VS_FAILED:
      return {
        ...approval,
        data: {},
        isLoading: false,
        error: 'Fetch approval fail',
      };
      case DELETE_PDDT_VS:
      return initData;
    default:
      return approval;
  }
};

export default approvalReducer;
