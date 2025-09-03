import moment from 'moment';
import {
  action,
  HRAP008_SET_APPROVE_INFO,
  HRAP008_SET_NGAY_BAT_DAU,
  HRAP008_SET_NGAY_KET_THUC,
} from './action';
const initialState = {
  DataPheDuyet: [],
  NgayBatDau: moment(new Date()).format('YYYYMMDD'),
  NgayKetThuc: moment(new Date()).format('YYYYMMDD'),
  ApproveInfo: [],
};

const reducer = (state = initialState, act) => {
  switch (act.type) {
    case HRAP008_SET_NGAY_BAT_DAU:
      return {
        ...state,
        NgayBatDau: act.NgayBatDau,
      };
    case HRAP008_SET_NGAY_KET_THUC:
      return {
        ...state,
        NgayKetThuc: act.NgayKetThuc,
      };
    case HRAP008_SET_APPROVE_INFO:
      return {
        ...state,
        ApproveInfo: act.ApproveInfo,
      };
    case action.HRAP008_LOAD_DATA_S:
      return {
        ...state,
        DataPheDuyet: act.data,
      };
    default:
      return state;
  }
};
export default reducer;
