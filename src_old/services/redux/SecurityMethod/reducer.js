import * as action from './action';
const initialState = {
  SecurityMethod: null,
  Questions: [],
  Ques1: null,
  Ques2: null,
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case action.action.SM_LOAD_DATA_S:
      return {
        ...state,
        SecurityMethod: act.SecurityMethod,
      };
    case action.action.SM_LOAD_DATA_F:
      return {
        ...state,
        SecurityMethod: null,
      };

    case action.action.SM_LOAD_QUES_S:
      return {
        ...state,
        Questions: act.Questions,
      };
    case action.action.SM_LOAD_QUES_F:
      return {
        ...state,
        Questions: [],
      };
    case action.action.SM_SET_QUES_1:
      return {
        ...state,
        Ques1: act.ques1,
      };
    case action.action.SM_SET_QUES_2:
      return {
        ...state,
        Ques2: act.ques2,
      };
    default:
      return state;
  }
};
export default reducer;
