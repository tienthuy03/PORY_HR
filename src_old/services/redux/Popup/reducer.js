import {POP_UP} from './action';
const initialState = {
  isShow: false,
  content: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case POP_UP.SHOW_POP_UP:
      return {
        ...state,
        isShow: action.isShow,
        content: action.content,
      };
    case POP_UP.HIDE_POP_UP:
      return {
        ...state,
        isShow: false,
        content: null,
      };
    default:
      return state;
  }
};
export default reducer;
