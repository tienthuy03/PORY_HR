import { put } from "@redux-saga/core/effects";
import { Alert } from "react-native";
import {
  HRWO002ReloadS,
  HRWO002ResetReloadS
} from "../../redux/HRWO002_CongViecThucHien/action";

function* LoadDanhSach() {
  try {
    yield put(HRWO002ReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

function* ResetReload() {
  try {
    yield put(HRWO002ResetReloadS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

export { LoadDanhSach, ResetReload };
