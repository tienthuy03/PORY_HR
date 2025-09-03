import {
  FETCH_ATTENDANCE_HISTORY,
  FETCH_ATTENDANCE_HISTORY_SUCCESS,
  FETCH_ATTENDANCE_HISTORY_FAILED,
  DELETE_ATTENDANCE_HISTORY,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const attendanceHistoryReducer = (attendanceHistory = initData, action) => {
  switch (action.type) {
    case FETCH_ATTENDANCE_HISTORY:
      return {
        ...attendanceHistory,
        isLoading: true,
      };
    case FETCH_ATTENDANCE_HISTORY_SUCCESS:
      return {
        ...attendanceHistory,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_ATTENDANCE_HISTORY_FAILED:
      return {
        ...attendanceHistory,
        data: {},
        isLoading: false,
        error: 'Fetch attendance hostory fail',
      };
      case DELETE_ATTENDANCE_HISTORY:
        return initData;

    default:
      return attendanceHistory;
  }
};

export default attendanceHistoryReducer;
