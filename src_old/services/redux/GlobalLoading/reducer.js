import {GLOBAL_LOADING_ACTION} from './action';
const initialState = {
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBAL_LOADING_ACTION.SHOW_GLOBAL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GLOBAL_LOADING_ACTION.HIDE_GLOBAL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};
export default reducer;
