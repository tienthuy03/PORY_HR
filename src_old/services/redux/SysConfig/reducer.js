import {SET_API_URL} from './action';

const initialState = {
  API_URL: '',
};
const reducer = (state = initialState, act) => {
  switch (act.type) {
    case SET_API_URL:
      return {
        ...state,
        API_URL: act.URL,
      };
    default:
      return state;
  }
};
export default reducer;
