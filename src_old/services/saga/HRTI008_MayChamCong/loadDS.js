import { put } from "@redux-saga/core/effects";
import { Alert } from "react-native";
import {
    HRTI008_ReloadListMCCS,
    HRTI008_ResetReloadListMCCS
} from "../../redux/HRTI008_MayChamCong/action";

function* LoadDanhSach() {
  try {
    yield put(HRTI008_ReloadListMCCS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

function* ResetReload() {
  try {
    yield put(HRTI008_ResetReloadListMCCS());
  } catch (error) {
    Alert.alert("Thông báo", "Không lấy được dữ liệu");
  }
}

export { LoadDanhSach, ResetReload };
