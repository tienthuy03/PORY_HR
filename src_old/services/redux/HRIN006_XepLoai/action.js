// delared the variable and create the function for an action
////get data
export const HRIN006_LOAD_DATA = 'HRIN006_LOAD_DATA';
export const HRIN006LoadData = (year) => {
  return {
    type: HRIN006_LOAD_DATA,
    year,
  };
};

////set data
export const HRIN006_SET_DATA = 'HRIN006_SET_DATA';
export const HRIN006SetData = (data) => {
  return {
    type: HRIN006_SET_DATA,
    data,
  };
};

////select the first month
export const HRIN006_SET_FIRST_MONTH = 'HRIN006_SET_FIRST_MONTH';
export const HRIN006SetFirstMonth = (selectedFirstMonth) => {
  return {
    type: HRIN006_SET_FIRST_MONTH,
    selectedFirstMonth,
  };
};

////select the second month
export const HRIN006_SET_TWO_MONTH = 'HRIN006_SET_TWO_MONTH';
export const HRIN006SetTwoMonth = (selectedTwoMonth) => {
  return {
    type: HRIN006_SET_TWO_MONTH,
    selectedTwoMonth,
  };
};
