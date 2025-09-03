import {put, select} from '@redux-saga/core/effects';
import axios from 'axios';
import Device from 'react-native-device-info';
import {Alert} from 'react-native';
import {
  SMLoadDataS,
  SMLoadDataF,
  SMLoadQuesS,
  SMLoadQuesF,
  SMSetQues1,
  SMSetQues2,
} from '../../redux/SecurityMethod/action';
import ShowError from '../../errors';

function* GetData() {
  GetInfo();
  GetQues();
}
function* GetInfo() {
  try {
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const username = yield select(state => state.loginReducers.user_name);
    const tokenLogin = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${tokenLogin}`,
      },
    };
    const param = {
      pro: 'SELCFMA0010100',
      in_par: {
        p1_varchar2: username,
      },
      out_par: {
        p1_varchar2: 'data',
      },
      token: 'tvs',
      machine_id: Device.getUniqueId(),
    };
    const rs = yield axios
      .post(URL + 'Exec/MOBILE', param, axiosConfig)
      .then(rs => {
        return rs.data;
      })
      .catch(err => {
        console.log(err);
      });
    if (rs.results === 'S') {
      yield put(SMLoadDataS(rs.data));
    } else {
      ShowError('fail');
      yield put(SMLoadDataF());
    }
  } catch (error) {
    ShowError(error.toString());
  }
}

function* GetQues() {
  try {
    const URL = yield select(state => state.SysConfigReducer.API_URL);
    const tokenLogin = yield select(
      state => state.loginReducers.data.data.tokenLogin,
    );
    const param = {
      pro: 'SELCFQP0014100',
      in_par: {},
      out_par: {
        p1_sys: 'data',
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
      .then(rs => {
        return rs.data;
      });
    if (rs.results === 'S') {
      yield put(SMLoadQuesS(rs.data.data));
    } else {
      ShowError('fail');
      yield put(SMLoadQuesF());
    }
  } catch (error) {
    ShowError(error.toString());
  }
}

export {GetData, GetInfo, GetQues};
