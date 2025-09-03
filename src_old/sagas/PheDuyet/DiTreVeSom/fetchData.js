import axios from 'axios';
import {select} from '@redux-saga/core/effects';

function* fetchData(token, machine_id, user_pk, p_from_date, p_to_date) {
  const URL = yield select(
    (state) => state.SysConfigReducer.API_URL + 'Exec/MOBILE/',
  );
  // const urlFetchs = URL + 'Exec/MOBILE/';
  let axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let params = {
    pro: 'SELHRAP0030100',
    in_par: {
      p1_varchar2: user_pk,
      p2_varchar2: p_from_date,
      p3_varchar2: p_to_date,
    },
    out_par: {
      p1_sys: 'data',
    },
    token: 'tvs',
    machine_id: machine_id,
  };
  const responses = yield axios
    .post(URL, params, axiosConfig)
    .then((ress) => ress.data)
    .catch((error) => {
      console.log('Errors1: ' + error);
    });
  return yield responses;
}
export default fetchData;
