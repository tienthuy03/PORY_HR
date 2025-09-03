export const action = {
  SM_LOAD_DATA: 'SM_LOAD_DATA',
  SM_LOAD_DATA_S: 'SM_LOAD_DATA_S',
  SM_LOAD_DATA_F: 'SM_LOAD_DATA_F',
  SM_LOAD_QUES: 'SM_LOAD_QUES',
  SM_LOAD_QUES_S: 'SM_LOAD_QUES_S',
  SM_LOAD_QUES_F: 'SM_LOAD_QUES_F',
  SM_SET_QUES_1: 'SM_SET_QUES_1',
  SM_SET_QUES_2: 'SM_SET_QUES_2',
};
export const SMLoadQues = {
  type: action.SM_LOAD_QUES,
};
export const SMLoadQuesS = (Questions) => {
  return {
    type: action.SM_LOAD_QUES_S,
    Questions,
  };
};
export const SMLoadQuesF = {
  type: action.SM_LOAD_QUES_F,
};
export const SMLoadData = {
  type: action.SM_LOAD_DATA,
};
export const SMLoadDataS = (SecurityMethod) => {
  return {
    type: action.SM_LOAD_DATA_S,
    SecurityMethod,
  };
};
export const SMLoadDataF = () => {
  return {
    type: action.SM_LOAD_DATA_F,
  };
};

export const SMSetQues1 = (ques1) => {
  return {
    type: action.SM_SET_QUES_1,
    ques1,
  };
};
export const SMSetQues2 = (ques2) => {
  return {
    type: action.SM_SET_QUES_2,
    ques2,
  };
};
