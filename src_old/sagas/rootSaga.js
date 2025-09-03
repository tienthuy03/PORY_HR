import { call, all, fork, takeEvery, takeLatest } from "redux-saga/effects";
import { watchFetchUser } from "./loginSaga";
import { watchFetchLanguage } from "./languageSaga";
import { watchFetchMenu } from "./menuSaga";
import { watchFetchTtcn } from "./ttcnSaga";
import { watchFetchWorkingDaily } from "./workingDailySaga";
import { watchFetchSalaryMonth } from "./salaryMonthSaga";
import { watchFetchAbsenceInfor } from "./absenceInforSaga";
import { watchFetchAttendance } from "./attendanceHistorySaga";
import { watchFetchXntc } from "./xntcSaga";
import { watchFetchNpd } from "./npdSaga";
import { watchFetchDkv } from "./dkvSaga";
import { watchFetchDkdt_vs } from "./dkdt_vsSaga";
import { watchPostXntc } from "./postXntcSaga";
import { watchFetchNoti } from "./notiSaga";
import { watchFetchApproval } from "./approvalSaga";
import { watchFetchOvertime } from "./overtimeSaga";
import { watchFetchVPCC } from "./vpccSaga";
import { watchPheDuyetDiTreVeSom } from "./PheDuyet/DiTreVeSom/saga";
import watchingForgotPassword from "../services/saga/forgotPassword";
import watchingSecuriryMethod from "../services/saga/SecurityMethod";
import {qrWalletSaga} from './qrWalletSaga';

import watchingHRRE005 from "../services/saga/HRRE005_RaCong";
import watchingHRRE004 from "../services/saga/HRRE004_TangCa";
import watchingHRRE006 from "../services/saga/HRRE006_CongTac";
import watchingHRAP004 from "../services/saga/HRAP004_RaCong";
import { watchingHRTK003 } from "../services/saga/HRTK003_BieuDoHopDong";
import { watchingHRTK004 } from "../services/saga/HRTK004_BieuDoLaoDong";
import { watchingHRTK002 } from "../services/saga/HRTK002_ThongKeLuong";
import { watchingHRDB001 } from "../services/saga/Dashboard";
import { watchingHRRI000 } from "../services/saga/HRRI000_ThongTinDangKyCom";
import { watchingHRRI011 } from "../services/saga/HRRI011_XacNhanLyDoViPhamCom";
import {
  watchingHRWO001, HRWO001_LoadList,
} from "../services/saga/HRWO001_CongViecGiao";
import {
  HRWO002_LoadList, HRWO002_ResetReload,
} from "../services/saga/HRWO002_CongViecThucHien";
import {
  HRWO003_LoadList, HRWO003_ResetReload,
} from "../services/saga/HRWO003_TongHopCongViec";
import {
  HRWO004_LoadList, HRWO004_ResetReload,
} from "../services/saga/HRWO004_CongViecTheoDoi";
import {
  HRWO008_LoadList, HRWO008_ResetReload,
} from "../services/saga/HRTI008_MayChamCong";
import watchingHRTI004 from "../services/saga/HRTI004_DangKyKhuonMatFe";
import watchingHRTI005 from "../services/saga/HRTI005_DangKyKhuonMatHIK";
import watchingSettingChange from "../services/saga/system";
import watchingSysConfig from "../services/saga/SysConfig";
import watchingHRRE008 from "../services/saga/HRRE008_BoSungCong";
import watchingHRAP008 from "../services/saga/HRAP008_BoSungCong";
import watchingHRIN006 from "../services/saga/HRIN006_XepLoai";
import watchingNofitication from "../services/saga/Notification";
import AsyncStorage from "@react-native-community/async-storage";
export default function* rootSaga() {
  yield checkTheme();
  yield all([
    call(watchFetchUser),
    call(watchFetchLanguage),
    call(watchFetchMenu),
    call(watchFetchTtcn),
    call(watchFetchWorkingDaily),
    call(watchFetchSalaryMonth),
    call(watchFetchAbsenceInfor),
    call(watchFetchAttendance),
    call(watchFetchXntc),
    call(watchFetchNpd),
    call(watchFetchDkv),
    call(watchFetchDkdt_vs),
    call(watchPostXntc),
    call(watchFetchNoti),
    call(watchFetchApproval),
    call(watchFetchOvertime),
    call(watchFetchVPCC),
    call(watchPheDuyetDiTreVeSom),
    call(watchingForgotPassword),
    call(watchingSecuriryMethod),
    call(watchingHRRE005),
    call(watchingHRAP004),
    call(watchingHRRE004),
    call(watchingHRRE006),
    call(watchingSettingChange),
    call(watchingHRTK003),
    call(watchingHRTK004),
    call(watchingHRTK002),
    call(watchingHRDB001),
    call(watchingHRTI004),
    call(watchingHRTI005),
    call(watchingSysConfig),
    call(watchingHRRE008),
    call(watchingHRAP008),
    call(watchingHRIN006),
    call(watchingHRIN006),
    call(watchingNofitication),
    call(watchingHRRI000),
    call(watchingHRRI011),

    call(watchingHRWO001),
    call(HRWO001_LoadList),
    call(HRWO002_LoadList),
    call(HRWO002_ResetReload),
    call(HRWO003_LoadList),
    call(HRWO003_ResetReload),
    call(HRWO004_LoadList),
    call(HRWO004_ResetReload),
    call(HRWO008_LoadList),
    call(HRWO008_ResetReload),

    call(qrWalletSaga),
  ]);

  //yield call(watchFetchTtcn);
  // call(watchAddMovies),
  // call(watchUpdateMovie),
  // call(watchDeleteMovie),
  //yield call(watchFetchLanguage);

  //yield [fork(watchFetchUser)];

  // yield call(
  //     // sayHello,
  //     // watchDecrement(),
  //     //  watchIncrement(),
  //     watchFetchUser
  // );

  //call chi goi mot
  //all goi nhieu nhung chi cai cuoi
  //fork cai dau, sai sau van thuc hien
}

function* checkTheme() {
  const theme = yield AsyncStorage.getItem("theme");
}
