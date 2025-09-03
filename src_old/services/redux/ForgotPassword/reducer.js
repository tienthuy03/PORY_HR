import * as action from './action';
const initialState = {
  info: false
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.FP_SET_INFORMATION:
      return {
        ...state,
        info: act.info,
      };
    default:
      return state;
  }
};
export default reducer;
