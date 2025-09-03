import {delay, put, select, call, fork} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import * as action from '../../redux/HRAP004_RaCong/action';
import DeviceInfo from 'react-native-device-info';
import {HideGlobalLoading} from '../../redux/GlobalLoading/action';
function* LayDanhSachRaCong() {
  yield fork(LayDanhSach, 'ALL');
}

function* LayDanhSach(type) {
  try {
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const tokenLogin = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    const emp_pk = yield select(
      state => state.loginReducers.data.data.thr_emp_pk,
    );
    const crt_by = yield select(state => state.loginReducers.data.data.crt_by);
    const startDate = yield select(
      state => state.HRAP004_RaCongReducer.DSNgayBatDau,
    );
    const endDate = yield select(
      state => state.HRAP004_RaCongReducer.DSNgayKetThuc,
    );
    const param = {
      pro: 'SELHRAP0040101',
      in_par: {
        p1_varchar2: emp_pk,
        p2_varchar2: type,
        p3_varchar2: startDate,
        p4_varchar2: endDate,
      },
      out_par: {
        p1_sys: 'data',
        p2_sys: 'approve_info',
      },
      token: 'tvs',
      machine_id: Device.getUniqueId(),
    };
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
      },
    };
    const rs = yield axios
      .post(URL + 'Exec/MOBILE', param, axiosConfig)
      .then(res => {
        return res.data;
      });
    if (rs.results === 'S') {
      let arrChoDuyet = [];
      let arrDaDuyet = [];
      let arrKhongDuyet = [];
      rs.data.data.map(item => {
        switch (item.approve_status) {
          case '1':
            arrChoDuyet.push(item);
            return;
          case '2':
            arrDaDuyet.push(item);
            return;
          case '3':
            arrKhongDuyet.push(item);
            return;
        }
      });

      //rs.data.approve_info
      yield put(action.HRAP004SetApproveInfo(rs.data.approve_info));
      yield put(action.HRAP004LoadDataRaCong1S(arrChoDuyet));
      yield put(action.HRAP004DemChoDuyet(arrChoDuyet.length));
      yield put(action.HRAP004LoadDataRaCong2S(arrDaDuyet));
      yield put(action.HRAP004DemDaDuyet(arrDaDuyet.length));
      yield put(action.HRAP004LoadDataRaCong3S(arrKhongDuyet));
      yield put(action.HRAP004DemKhongDuyet(arrKhongDuyet.length));
    } else {
      Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
      yield put(action.HRAP004LoadDataRaCong1F());
      yield put(action.HRAP004LoadDataRaCong2F());
      yield put(action.HRAP004LoadDataRaCong3F());
    }
  } catch (error) {
    yield put(HideGlobalLoading);
  }
}

//funciton of saga for update approve_status to db
function* UpdateApprove({oneRecord}) {
  //get state
  const IPAddress = yield select(state => state.SysConfigReducer.API_URL);
  const URL = IPAddress + 'Exec/MOBILE/';
  const tokenLogin = yield select(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const emp_pk = yield select(
    state => state.loginReducers.data.data.thr_emp_pk,
  );
  const full_name = yield select(
    state => state.loginReducers.data.data.full_name,
  );

  //define param pass to axios fetch data
  let p_reg_absence_pk = oneRecord.pk;
  let p_approve_status = oneRecord.type;
  let p_approve_note = oneRecord.approve_note;
  let p_approve_by_pk = emp_pk;
  let p_role_type = oneRecord.role_type;
  let p_crt_by = full_name;

  //define authentication with Bear token
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${tokenLogin}`,
    },
  };

  //delared param
  const param = {
    pro: 'UPDHRAP0040101',
    in_par: {
      p1_varchar2: 'UPDATE',
      p2_varchar2: p_reg_absence_pk,
      p3_varchar2: p_approve_status,
      p4_varchar2: p_approve_note,
      p5_varchar2: p_approve_by_pk,
      p6_varchar2: p_role_type,
      p7_varchar2: p_crt_by,
    },
    out_par: {
      p1_varchar2: 'data',
      p2_sys: 'noti',
    },
    token: 'tvs',
    machine_id: DeviceInfo.getUniqueId(),
  };

  //post data and return noti cursor
  const noti = yield axios
    .post(URL, param, axiosConfig)
    .then(response => {
      if (response.data.results === 'S') {
        Alert.alert('Thông báo', 'Phê duyệt thành công', [{text: 'Đóng'}]);
        return response.data.data.noti;
      } else {
        let errMess = '';
        try {
          errMess = response.data.errorData
            .split('ORA-06512:')[0]
            .replace('ORA-20009: ', '');
        } catch (error) {
          errMess = 'Đã có lỗi xảy ra hãy liên hệ với quản trị.';
        }
        Alert.alert('Thông báo', errMess, [{text: 'Đóng'}]);
        return [];
      }
    })
    .catch(err => console.log(err));

  //handle send notification
  if (oneRecord.type !== 1) {
    noti.map(item => {
      const paramNoti = {
        body: item.ann_title,
        title: item.ann_content,
        ids: [item.device_id],
      };
      const URLNoti = IPAddress + 'Notification/Push';
      axios
        .post(URLNoti, paramNoti, axiosConfig)
        .then(res => {})
        .catch(err => {
          console.log('Error Send Notification HRRE004', err);
        });
    });
  }

  //handle reload data
  yield put(action.HRAP004LoadDataRaCong());
}
export {LayDanhSachRaCong, UpdateApprove};
