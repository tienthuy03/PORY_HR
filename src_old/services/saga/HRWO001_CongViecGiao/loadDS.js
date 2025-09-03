import { put } from "@redux-saga/core/effects";
import { Alert } from "react-native";
import {
  HRWO001ReloadListSuccess,
} from "../../redux/HRWO001_CongViecGiao/action";

function* LoadDanhSach() {
  try {
    yield put(HRWO001ReloadListSuccess());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

export { LoadDanhSach };
