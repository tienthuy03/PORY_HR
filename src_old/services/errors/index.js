import {Alert} from 'react-native';
import ERRORS from './error-data';
const genErr = (key) => {
  return ERRORS.filter((i) => i.key === key).length > 0
    ? ERRORS.filter((i) => i.key === key)[0].value
    : ERRORS.filter((i) => i.key === 'An unknown error')[0].value;
};

const ShowError = (key) => {
  Alert.alert('Thông báo', genErr(key).toString(), [{text: 'Đóng'}]);
};
export default ShowError;
