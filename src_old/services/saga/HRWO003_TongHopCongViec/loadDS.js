import { put } from "@redux-saga/core/effects";
import { Alert } from "react-native";
import {
  HRWO003ReloadS,
  HRWO003ResetReloadS
} from "../../redux/HRWO003_TongHopCongViec/action";

function* LoadDanhSach() {
  try {
    yield put(HRWO003ReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

function* ResetReload() {
  try {
    yield put(HRWO003ResetReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

export { LoadDanhSach, ResetReload };
