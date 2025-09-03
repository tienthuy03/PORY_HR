import { combineReducers } from "redux";
import { RESET_STORE } from "../actions/actionType";
import DataPheDuyetDiTreVeSom from "../sagas/PheDuyet/DiTreVeSom/reducer";
import HRDB001_DashboardReducer from "../services/redux/Dashboard/reducer";
import ForgotPasswordReducer from "../services/redux/ForgotPassword/reducer";
import GlobalLoadingReducer from "../services/redux/GlobalLoading/reducer";
import HRAP004_RaCongReducer from "../services/redux/HRAP004_RaCong/reducer";
import HRAP008_BoSungCongReducer from "../services/redux/HRAP008_BoSungCong/reducer";
import HRIN006_XepLoaiReducer from "../services/redux/HRIN006_XepLoai/reducer";
import HRRE004_TangCaReducer from "../services/redux/HRRE004_TangCa/reducer";
import HRRE005_RaCongReducer from "../services/redux/HRRE005_RaCong/reducer";
import HRRE006_CongTacReducer from "../services/redux/HRRE006_CongTac/reducer";
import HRRE008_BoSungCongReducer from "../services/redux/HRRE008_BoSungCong/reducer";
import HRTI004_DangKyKhuonMatFeReducer from "../services/redux/HRTI004_DangKyKhuonMatFe/reducer";
import HRTI005_DangKyKhuonMatHIKReducer from "../services/redux/HRTI005_DangKyKhuonMatHIK/reducer";
import HRTK002_ThongKeLuongReducer from "../services/redux/HRTK002_ThongKeLuong/reducer";
import HRTK003_BieuDoHopDongReducer from "../services/redux/HRTK003_BieuDoHopDong/reducer";
import HRTK004_BieuDoLaoDongReducer from "../services/redux/HRTK004_BieuDoLaoDong/reducer";
import HRRI000_ThongTinDangKyComReducer from "../services/redux/HRRI000_ThongTinDangKyCom/reducer";
import HRRI011_XacNhanLyDoViPhamComReducer from "../services/redux/HRRI011_XacNhanLyDoViPhamCom/reducer";
import HRWO001_CongViecGiaoReducer from "../services/redux/HRWO001_CongViecGiao/reducer";
import HRWO001_CongViecGiaoLoadDSReducer from "../services/redux/HRWO001_CongViecGiao/reducer2";
import HRWO002_CongViecThucHienReducer from "../services/redux/HRWO002_CongViecThucHien/reducer";
import HRWO003_TongHopCongViecReducer from "../services/redux/HRWO003_TongHopCongViec/reducer";
import HRWO004_CongViecTheoDoiReducer from "../services/redux/HRWO004_CongViecTheoDoi/reducer";
import HRTI008_MayChamCongReducer from "../services/redux/HRTI008_MayChamCong/reducer";

import NotificationReducer from "../services/redux/Notification/reducer";
import PopupReducer from "../services/redux/Popup/reducer";
import SecurityMethodReducer from "../services/redux/SecurityMethod/reducer";
import SysConfigReducer from "../services/redux/SysConfig/reducer";
import SystemReducer from "../services/redux/System/reducer";

import absenceInformationReducer from "./absenceInformationReducer";
import approvalReducer from "./approvalReducer";
import attendanceHistoryReducer from "./attendanceHistoryReducer";
import dkdt_vsReducer from "./dkdt_vsReducer";
import dkvReducer from "./dkvReducer";
import dkvV2Reducer from "./dkvV2Reducer";
import languageReducer from "./languageReducer";
import loginReducers from "./loginReducer";
import menuReducer from "./menuReducer";
import npdReducer from "./npdReducer";
import overtimeReducer from "./overtimeReducer";
import postXntcReducer from "./postXntcReducer";
import salaryMonthReducer from "./salaryMonthReducer";
import ttcnReducer from "./ttcnReducer";
import vpccReducer from "./vpccReducer";
import workingDailyReducer from "./workingDailyReducer";
import xntcReducer from "./xntcReducer";

import qrWalletReducer from "./qrWalletReducer";

const appReducers = combineReducers({
  loginReducers,
  languageReducer,
  menuReducer,
  ttcnReducer,
  workingDailyReducer,
  salaryMonthReducer,
  absenceInformationReducer,
  attendanceHistoryReducer,
  xntcReducer,
  npdReducer,
  dkvReducer,
  dkvV2Reducer,
  dkdt_vsReducer,
  postXntcReducer,
  NotificationReducer,
  approvalReducer,
  overtimeReducer,
  vpccReducer,
  DataPheDuyetDiTreVeSom,
  GlobalLoadingReducer,
  PopupReducer,
  ForgotPasswordReducer,
  SecurityMethodReducer,
  HRRE005_RaCongReducer,
  HRRE006_CongTacReducer,
  HRAP004_RaCongReducer,
  HRRE004_TangCaReducer,
  HRTK003_BieuDoHopDongReducer,
  HRTK004_BieuDoLaoDongReducer,
  HRTK002_ThongKeLuongReducer,
  HRDB001_DashboardReducer,
  HRTI004_DangKyKhuonMatFeReducer,
  HRTI005_DangKyKhuonMatHIKReducer,
  HRRE008_BoSungCongReducer,
  HRAP008_BoSungCongReducer,
  HRRI000_ThongTinDangKyComReducer,
  HRRI011_XacNhanLyDoViPhamComReducer,
  SystemReducer,
  SysConfigReducer,
  HRIN006_XepLoaiReducer,
  HRWO001_CongViecGiaoReducer,
  HRWO001_CongViecGiaoLoadDSReducer,
  HRWO002_CongViecThucHienReducer,
  HRWO003_TongHopCongViecReducer,
  HRWO004_CongViecTheoDoiReducer,
  HRTI008_MayChamCongReducer,

  qrWalletReducer,
});

const rootReducers = (state, action) => {
  if (action.type === RESET_STORE) {
    state = undefined; // this will set the state to initial automatically
  }
  return appReducers(state, action);
};

export default rootReducers;
