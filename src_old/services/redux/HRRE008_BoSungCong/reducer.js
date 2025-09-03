import {
  HRRE008_LOAD_DATA_SS,
  HRRE008_SET_DS_NGUOI_PHE_DUYET,
  HRRE008_SET_DS_PHE_DUYET,
  HRRE008_START_DATE,
  HRRE008_END_DATE,
  HRRE008_SET_DS_LY_DO,
  HRRE008_SET_LIMIT_DATE,
} from './action';
import moment from 'moment';

const initialState = {
  DanhSachBoSungCong: [],
  DanhSachNguoiPheDuyet: [],
  DanhSachPheDuyet: [],
  StartDate: moment(new Date()).format('YYYYMM01'),
  EndDate: moment(new Date()).format('YYYYMMDD'),
  DanhSachLyDo: [],
  limitDate: {
    limit_reg_date: 1000,
    note: "",
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HRRE008_SET_LIMIT_DATE:
      return {
        ...state,
        limitDate: action.limitDate,
      };
    case HRRE008_SET_DS_LY_DO:
      return {
        ...state,
        DanhSachLyDo: action.DanhSachLyDo,
      };
    case HRRE008_START_DATE:
      return {
        ...state,
        StartDate: action.StartDate,
      };
    case HRRE008_END_DATE:
      return {
        ...state,
        EndDate: action.EndDate,
      };
    case HRRE008_LOAD_DATA_SS:
      return {
        ...state,
        DanhSachBoSungCong: action.DanhSachBoSungCong,
      };
    case HRRE008_SET_DS_NGUOI_PHE_DUYET:
      return {
        ...state,
        DanhSachNguoiPheDuyet: action.DanhSachNguoiPheDuyet,
      };
    case HRRE008_SET_DS_PHE_DUYET:
      return {
        ...state,
        DanhSachPheDuyet: action.DanhSachPheDuyet,
      };
    default:
      return state;
  }
};

export default reducer;
