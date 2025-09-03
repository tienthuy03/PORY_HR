import {
  FETCH_WORKING_DAILY,
  FETCH_WORKING_DAILY_SUCCESS,
  FETCH_WORKING_DAILY_FAILED,
  DELETE_WORKING_DAILY,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const workingDailyReducer = (workingDaily = initData, action) => {
  switch (action.type) {
    case FETCH_WORKING_DAILY:
      return {
        ...workingDaily,
        isLoading: true,
      };
    case FETCH_WORKING_DAILY_SUCCESS:
      return {
        ...workingDaily,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_WORKING_DAILY_FAILED:
      return {
        ...workingDaily,
        data: {},
        isLoading: false,
        error: 'Fetch working daily fail',
      };
    case DELETE_WORKING_DAILY:
      return initData;

    default:
      return workingDaily;
  }
};

export default workingDailyReducer;
