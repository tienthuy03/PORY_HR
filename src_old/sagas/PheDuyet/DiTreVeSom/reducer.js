const initialState = {
  Data: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PHE_DUYET_DI_TRE_VE_SOM':
      return {
        ...state,
        Data: action.payload,
      };
    case 'GET_DATA_PHE_DUYET_DI_TRE_VE_SOM':
      return {
        ...state,
        Data: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
