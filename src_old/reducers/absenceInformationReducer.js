import {
  FETCH_ABSENCE_INFORMATION,
  FETCH_ABSENCE_INFORMATION_SUCCESS,
  FETCH_ABSENCE_INFORMATION_FAILED,
  DELETE_ABSENCE_INFORMATION,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const absenceInforReducer = (absenceInfor = initData, action) => {
  switch (action.type) {
    case FETCH_ABSENCE_INFORMATION:
      return {
        ...absenceInfor,
        isLoading: true,
      };
    case FETCH_ABSENCE_INFORMATION_SUCCESS:
      return {
        ...absenceInfor,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_ABSENCE_INFORMATION_FAILED:
      return {
        ...absenceInfor,
        data: {},
        isLoading: false,
        error: 'Fetch salary month fail',
      };
    case DELETE_ABSENCE_INFORMATION:
      return initData;

    default:
      return absenceInfor;
  }
};

export default absenceInforReducer;
