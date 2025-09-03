import {
  FETCH_SALARY_MONTH,
  FETCH_SALARY_MONTH_SUCCESS,
  FETCH_SALARY_MONTH_FAILED,
  DELETE_SALARY_MONTH,
} from '../actions/actionType';
const initData = {
  data: {},
  isLoading: false,
  error: '',
};
const salaryMonthReducer = (salaryMonth = initData, action) => {
  switch (action.type) {
    case FETCH_SALARY_MONTH:
      return {
        ...salaryMonth,
        isLoading: true,
      };
    case FETCH_SALARY_MONTH_SUCCESS:
      return {
        ...salaryMonth,
        data: action.payload,
        isLoading: false,
        error: 'no',
      };
    case FETCH_SALARY_MONTH_FAILED:
      return {
        ...salaryMonth,
        data: {},
        isLoading: false,
        error: 'Fetch salary month fail',
      };
    case DELETE_SALARY_MONTH:
      return initData;

    default:
      return salaryMonth;
  }
};

export default salaryMonthReducer;
