import AsyncStorage from '@react-native-community/async-storage';
import {put} from '@redux-saga/core/effects';
import {Color} from '../../colors/colorhp';
import {buildFor, ServerIP} from '../../config/Pro';
import {SetApiURL} from '../redux/SysConfig/action';
import {sysLoadTheme} from '../redux/System/action';
function* globalstorage() {
  if (buildFor === 'tvs') {
    const rs = yield AsyncStorage.getItem('themeName');
    const apiUrl = yield AsyncStorage.getItem('API_URL');
    yield put(SetApiURL(apiUrl));
  } else {
    AsyncStorage.setItem('themeName', '2');
    AsyncStorage.setItem('API_URL', ServerIP.tvs);
    yield put(SetApiURL(ServerIP.tvs));
    yield put(sysLoadTheme(Color));
  }
}
export {globalstorage};
