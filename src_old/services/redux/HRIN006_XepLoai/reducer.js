import moment from 'moment';
import {
  HRIN006_SET_DATA,
  HRIN006_SET_FIRST_MONTH,
  HRIN006_SET_TWO_MONTH,
} from './action';

//initial for the first data
const initialState = {
  data: [],
  selectedFirstMonth: moment(new Date()).format('YYYYMM'),
  selectedTwoMonth: moment(new Date()).format('YYYYMM'),
};

//handle when application have one the action
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HRIN006_SET_DATA:
      return {
        ...state,
        data: action.data,
      };
    case HRIN006_SET_FIRST_MONTH:
      return {
        ...state,
        selectedFirstMonth: action.selectedFirstMonth,
      };
    case HRIN006_SET_TWO_MONTH:
      return {
        ...state,
        selectedTwoMonth: action.selectedTwoMonth,
      };
    default:
      return state;
  }
};
export default reducer;
