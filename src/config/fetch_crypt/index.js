import axios from 'axios';
import 'react-native-get-random-values';
import CryptoJS from "crypto-js";
import { deviceId } from '../../constants';

const sysFetch = (api, data, token) => {
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // console.log('api', api + 'Exec/MOBILE_DECRYPT/');
  // console.log('data', data);

  // ✅ Key và IV cố định, nên đồng bộ với phía C#
  const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012"); // 32 bytes cho AES-256
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 bytes cho AES block size

  // ✅ Mã hóa AES không salted
  const encrypted = CryptoJS.AES.encrypt(data.pro, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const cryptoString = encrypted.ciphertext.toString(CryptoJS.enc.Base64); // chỉ mã hóa phần "ciphertext" (không salt)
  // console.log("Encrypted:", cryptoString);

  // Gán chuỗi mã hóa vào data.pro mà không encode lại
  data.pro = cryptoString;
  // ✅ Giải mã test (nếu cần)
  /*
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(cryptoString) },
    key,
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  const originalText = decrypted.toString(CryptoJS.enc.Utf8);
  console.log("originalText ", originalText);
  */
  return axios
    .post(
      api + 'Exec/MOBILE_DECRYPT/',
      {
        ...data,
        machine_id: deviceId,
        token: 'phr',
      },
      axiosConfig
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log('err sysFetch', err);
      if (err == 'AxiosError: Request failed with status code 401') {
        return 'Token Expired';
      } else {
        console.log('err sysFetch');
        console.log(err);
      }
    });
};

export default sysFetch;
