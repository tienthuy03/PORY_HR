/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform,
  Button,
  Alert,
  Linking,
  TouchableOpacity,
  PermissionsAndroid,
  StatusBar,
} from "react-native";

import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil } from "../../../../Language";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker, { types } from "react-native-document-picker";
import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";
const DonThoiViec = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    img: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderColor: Color.mainColor,
      borderWidth: 1,
    },
    boxI: {
      borderRadius: 12,
      overflow: "hidden",
      width: 80,
      height: 80,
      backgroundColor: Color.white,
      alignItems: "center",
    },
    imgs: {
      width: 60,
      height: 80,
    },
  });
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  let dataMenuMBHRs;
  let language;
  let fullname;
  let avartar;
  let empId;
  let tokenLogin;
  let thr_emp_pk;
  let userPk;
  let refreshToken;

  let crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  try {
    avartar = loginReducers.data.data.avatar;
    fullname = loginReducers.data.data.full_name;
    empId = loginReducers.data.data.emp_id;
    language = loginReducers.data.data.user_language;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    dataMenuMBHRs = menuReducer.data.data.menu;
    refreshToken = loginReducers.data.data.refreshToken;
    userPk = loginReducers.data.data.tes_user_pk;
  } catch (error) {
    console.log(error);
  }
  const [fileBase64, setFileBase64] = useState("");
  const [data, setData] = useState([]);
  const [base64Upload, setBase64Upload] = useState([]);
  const [fileDownLoadPath, setFileDownLoadPath] = useState("");
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    pro = "SELHRDT001000",
      console.log(pro);

    out_par = {
      p1_sys: "data",
    }
    console.log("out_par: ", out_par);
    sysFetch(
      API,
      {
        // pro: "SELHRDT001000",
        pro,
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par
        // out_par: {
        //   p1_sys: "data",
        // },
      },
      tokenLogin
    )
      .then((res) => {
        console.log("API response:", res); // Log toàn bộ response
        setData(res.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { fs } = RNFetchBlob;

  const DownloadFile = async () => {
    let fPath = Platform.select({
      // ios: fs.dirs.DocumentDir + '/Downloads',
      ios: fs.dirs.DocumentDir,
      android: fs.dirs.DownloadDir,
    });

    if (Platform.OS === "ios") {
      fPath = `${fPath}/` + data.file_nm + "" + data.ext;
    } else {
      fPath = `${fPath}/` + data.file_nm + "" + data.ext;
    }
    console.log("fPath ", fPath);
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Thông báo",
          message: "Xin hãy cấp quyền truy cập tệp cho ứng dụng.",
          buttonNegative: "Hủy bỏ",
          buttonPositive: "Xác nhận",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        fs.writeFile(fPath, data.pdf_content, "base64");
        setFileDownLoadPath(fPath);
      }
    } else {
      fs.writeFile(fPath, data.pdf_content, "base64");
      setFileDownLoadPath(fPath);
    }
    FileViewer.open(fPath)
      .then(() => {
        // success
      })
      .catch((error) => {
        // error
      });
  };
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil(
          language,
          dataMenuMBHRs,
          0,
          "MBHRDT001",
          dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRDT001")[0].p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <Block
          shadow
          justifyContent={"space-between"}
          radius={8}
          row
          marginRight={10}
          marginLeft={10}
          marginBottom={10}
          marginTop={5}
          backgroundColor={Color.white}
        >
          <TouchableOpacity
            style={{ padding: 10, width: "100%" }}
            onPress={() => DownloadFile()}
          >
            <Text>Download</Text>
          </TouchableOpacity>
        </Block>
        <View>
          <Text>{fileDownLoadPath}</Text>
        </View>
        <View>
          <StatusBar barStyle={"dark-content"} />
          {base64Upload.length > 0
            ? base64Upload.map((file, index) => (
              <View>
                <Text style={{}} numberOfLines={1} ellipsizeMode={"middle"}>
                  {file?.name}
                </Text>
                <Text style={{}} numberOfLines={1} ellipsizeMode={"middle"}>
                  {file?.data}
                </Text>
              </View>
            ))
            : null}
        </View>
      </Block>
    </Block>
  );
};
export default DonThoiViec;
