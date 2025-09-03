import { put } from "@redux-saga/core/effects";
import { Alert } from "react-native";
import {
  HRWO004ReloadS,
  HRWO004ResetReloadS
} from "../../redux/HRWO004_CongViecTheoDoi/action";

function* LoadDanhSach() {
  try {
    yield put(HRWO004ReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

function* ResetReload() {
  try {
    yield put(HRWO004ResetReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

export { LoadDanhSach, ResetReload };
