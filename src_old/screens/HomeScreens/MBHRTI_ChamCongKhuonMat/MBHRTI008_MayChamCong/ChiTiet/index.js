import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import sysFetch from "../../../../../services/fetch_v1";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import TVSHeader from "../../../../../components/Tvs/Header";
import Block from "../../../../../components/Block";
import TVSTextInput from "../../../../../components/Tvs/TVSTextInput2";
import TVSList3 from "../../../../../components/Tvs/TVSList3";
import EyeClose from "../../../../../icons/EyeClose";
import EyeOpen from "../../../../../icons/EyeOpen";
import Button from "../../../../../components/Button.js";
import TVSCheckBox from "../../../../../components/Tvs/TVSCheckBox";
import TVSButton from "../../../../../components/Tvs/Button";
import axios from "axios";
import moment from "moment/moment.js";

import { HRTI008_ReloadListMCC } from "../../../../../services/redux/HRTI008_MayChamCong/action";
import { KeyboardAvoidingView } from "react-native";

const ChiTiet = ({ route }) => {
  const { pk_maychamcong, loaiMayChamCong, flag } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //----------------------STATE----------------------------
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {}

  //----------------------STATE-------------------------
  // Loai may cham cong
  const [dataSelectLoaiMay, setDataSelectLoaiMay] = useState([]);
  const [selectNameLoaiMay, setSelectNameLoaiMay] = useState(
    "Chọn loại máy chấm công"
  );
  const [selectCodeLoaiMay, setSelectCodeLoaiMay] = useState("");
  const [dataLoaiMayCurrent, setDataLoaiMayCurrent] = useState({
    code: "",
    code_nm: "",
  });
  const onChangeSelectLoaiMay = (result) => {
    setSelectNameLoaiMay(result.code_nm);
    setSelectCodeLoaiMay(result.code);
  };
  const [maMay, setMaMay] = useState("");
  const [tenMay, setTenMay] = useState("");
  const [diaChiIP, setDiaChiIP] = useState("");
  const [congKetNoi, setCongKetNoi] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [eye, setEye] = useState(true);
  // Phuong thuc cham cong
  const [phuongThucChamCong, setPhuongThucChamCong] = useState({
    auth_card_yn: "N",
    auth_face_yn: "N",
    auth_finger_yn: "N",
  });
  const onCheck = (val, type) => {
    if (type == "card") {
      setPhuongThucChamCong({
        ...phuongThucChamCong,
        auth_card_yn: val,
      });
    } else if (type == "face") {
      setPhuongThucChamCong({
        ...phuongThucChamCong,
        auth_face_yn: val,
      });
    } else if (type == "finger") {
      setPhuongThucChamCong({
        ...phuongThucChamCong,
        auth_finger_yn: val,
      });
    }
  };
  const ItemCheck = ({ disabled, title, type, item }) => {
    return (
      <Block alignCenter row={true}>
        {item && item == "Y" ? (
          <TVSCheckBox
            disabled={disabled}
            value={"Y"}
            onPress={() => onCheck("N", type)}
          />
        ) : (
          <TVSCheckBox
            disabled={disabled}
            value={"N"}
            onPress={() => onCheck("Y", type)}
          />
        )}
        <Text
          style={{
            color: "black",
            marginLeft: 5,
          }}
        >
          {title}
        </Text>
      </Block>
    );
  };
  // Quet vao ra
  const [quetVaoRa, setQuetVaoRa] = useState([]);
  const [selectNameVaoRa, setSelectNameVaoRa] = useState(
    "Chọn phương thức quét"
  );
  const [selectCodeVaoRa, setSelectCodeVaoRa] = useState("");
  const [dataVaoRaCurrent, setDataVaoRaCurrent] = useState({
    code: "",
    code_nm: "",
  });
  const onChangeSelectVaoRa = (result) => {
    setSelectNameVaoRa(result.code_nm);
    setSelectCodeVaoRa(result.code);
  };

  const [suDungYN, setSuDungYN] = useState("N");
  const [maTerminal, setMaTerminal] = useState("");
  const [diaChiService, setDiaChiService] = useState("");
  const [diaChiApiServer, setDiaChiApiServer] = useState("");
  const [diaChiWindowService, setDiaChiWindowService] = useState("");
  const [tinhTrangKetNoi, setTinhTrangKetNoi] = useState("");
  const [colorKetNoi, setColorKetNoi] = useState("red");
  const [thoiGianGanNhat, setThoiGianGanNhat] = useState("");

  //Action
  const actionActive = useRef();

  //----------------------FETCH DATA-------------------------
  const [dataMayChamCong, setDataMayChamCong] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (flag == "edit") {
      actionActive.current = "UPDATE";
      if (dataSelectLoaiMay.length > 0) {
        const loaiMay = dataSelectLoaiMay.find(
          (item) => item.code == loaiMayChamCong
        );
        setSelectNameLoaiMay(loaiMay.code_nm);
        setSelectCodeLoaiMay(loaiMay.code);
        setDataLoaiMayCurrent(loaiMay);
      }
      dataMayChamCong.id ? setMaMay(dataMayChamCong.id + "") : setMaMay("");
      dataMayChamCong.name ? setTenMay(dataMayChamCong.name) : setTenMay("");
      dataMayChamCong.ip ? setDiaChiIP(dataMayChamCong.ip) : setDiaChiIP("");
      dataMayChamCong.port
        ? setCongKetNoi(dataMayChamCong.port + "")
        : setCongKetNoi("");
      dataMayChamCong.password
        ? setMatKhau(dataMayChamCong.password)
        : setMatKhau("");

      // Phuong thuc cham cong
      const auth_card_yn = dataMayChamCong.auth_card_yn == "Y" ? "Y" : "N";
      const auth_face_yn = dataMayChamCong.auth_face_yn == "Y" ? "Y" : "N";
      const auth_finger_yn = dataMayChamCong.auth_finger_yn == "Y" ? "Y" : "N";
      setPhuongThucChamCong({
        auth_card_yn,
        auth_face_yn,
        auth_finger_yn,
      });

      //Su dung YN
      const use_yn = dataMayChamCong.use_yn == "Y" ? "Y" : "N";
      setSuDungYN(use_yn);

      //Window service
      dataMayChamCong.ubio_url_service
        ? setDiaChiService(dataMayChamCong.ubio_url_service)
        : setDiaChiService("");

      //Api server
      dataMayChamCong.url_api_server
        ? setDiaChiApiServer(dataMayChamCong.url_api_server)
        : setDiaChiApiServer("");
      //Window service
      dataMayChamCong.url_ws
        ? setDiaChiWindowService(dataMayChamCong.url_ws)
        : setDiaChiWindowService("");

      //Tinh trang ket noi
      dataMayChamCong.status
        ? setTinhTrangKetNoi(dataMayChamCong.status)
        : setTinhTrangKetNoi("");

      //Color ket noi
      dataMayChamCong.status_color &&
        setColorKetNoi(dataMayChamCong.status_color);

      //Thoi gian gan nhat
      dataMayChamCong.status_date
        ? setThoiGianGanNhat(dataMayChamCong.status_date)
        : setThoiGianGanNhat("");
    } else {
      actionActive.current = "INSERT";
      setSelectNameLoaiMay("Chọn loại máy chấm công");
      setSelectCodeLoaiMay("");
    }

    console.log("Action", actionActive.current);
  }, [dataSelectLoaiMay]);

  const fetchData = () => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRTI008001";
    const in_par = {
      p1_varchar2: pk_maychamcong, //PK bang may cham cong
      p2_varchar2: loaiMayChamCong, //Loai may cham cong
      p3_varchar2: crt_by, //user dang nhap
    };
    const out_par = {
      p1_sys: "dataMayChamCong",
      p2_sys: "dataLoaiMay",
      p3_sys: "dataInOut",
    };

    console.log("in_par", in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        dispatch(HideGlobalLoading);
        if (rs == "Token Expired") {
          //Refresh token
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataMayChamCong(rs.data.dataMayChamCong[0]);
            setDataSelectLoaiMay(rs.data.dataLoaiMay);
            setQuetVaoRa(rs.data.dataInOut);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  //----------------------ACTION-------------------------
  const resetForm = () => {
    actionActive.current = "INSERT";
    console.log("Action", actionActive.current);
    setSelectNameLoaiMay(dataSelectLoaiMay[0].code_nm);
    setSelectCodeLoaiMay(dataSelectLoaiMay[0].code);
    setDataLoaiMayCurrent(dataSelectLoaiMay[0]);
    setMaMay("");
    setTenMay("");
    setDiaChiIP("");
    setCongKetNoi("");
    setMatKhau("");
    setPhuongThucChamCong({
      auth_card_yn: "N",
      auth_face_yn: "N",
      auth_finger_yn: "N",
    });
    setSelectNameVaoRa("Chọn phương thức quét");
    setSelectCodeVaoRa("");
    setSuDungYN("N");
    setMaTerminal("");
    setDiaChiService("");
    setDiaChiApiServer("");
    setDiaChiWindowService("");
  };

  const checkValidate = (action) => {
    if (selectCodeLoaiMay == "") {
      Alert.alert("Thông báo", "Chưa chọn loại máy chấm công");
      return false;
    }
    if (maMay == "") {
      Alert.alert("Thông báo", "Chưa nhập mã máy");
      return false;
    }
    if (tenMay == "") {
      Alert.alert("Thông báo", "Chưa nhập tên máy");
      return false;
    }
    if (diaChiIP == "") {
      Alert.alert("Thông báo", "Chưa nhập địa chỉ IP");
      return false;
    }
    if (congKetNoi == "") {
      Alert.alert("Thông báo", "Chưa nhập cổng");
      return false;
    }
    if (selectCodeLoaiMay == "HIK" && matKhau == "") {
      Alert.alert("Thông báo", "Chưa nhập mật khẩu");
      return false;
    }

    actionActive.current = action;

    dialogNotify(
      "Thông báo",
      "Bạn có muốn lưu thông tin máy chấm công này không?",
      false
    );

    return true;
  };

  const deleteMayChamCong = () => {
    dialogNotify("Thông báo", "Bạn có muốn xoá máy chấm công này không?", true);
  };

  const dialogNotify = (title, content, flagDelete) => {
    Alert.alert(
      title,
      content,
      [
        {
          text: "Đồng ý",
          onPress: () => {
            if (flagDelete) {
              actionMayChamCong("DELETE");
            } else {
              actionMayChamCong(actionActive.current);
            }
          },
        },
        {
          text: "Hủy",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const actionMayChamCong = (action) => {
    const pro = "UPDHRTI008000";
    const in_par = {
      p1_varchar2: action, //I: insert, U: update
      p2_varchar2:
        action == "DELETE" || action == "UPDATE" ? pk_maychamcong : "", //PK bang may cham cong
      p3_varchar2: maMay, //Ma may
      p4_varchar2: tenMay, //Ten may
      p5_varchar2: diaChiIP, //Dia chi IP
      p6_varchar2: congKetNoi, //Cong ket noi port
      p7_varchar2: matKhau, //Mat khau
      p8_varchar2: selectCodeLoaiMay, //loai may cham cong
      p9_varchar2: phuongThucChamCong.auth_face_yn, //face YN
      p10_varchar2: phuongThucChamCong.auth_finger_yn, //finger YN
      p11_varchar2: phuongThucChamCong.auth_card_yn, //card YN
      p12_varchar2: selectCodeVaoRa, //Quet vao ra
      p13_varchar2: suDungYN, //Su dung YN
      p14_varchar2: maTerminal, //Ma terminal
      p15_varchar2: diaChiService, //ubio service
      p16_varchar2: diaChiApiServer, //window service
      p17_varchar2: diaChiWindowService, //api server
      p18_varchar2: userPk, //client pk
      p19_varchar2: crt_by, //crt_by
    };
    const out_par = {
      p1_varchar2: "p_msg",
    };
    console.log("in_par", in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par,
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs", rs);
        dispatch(HideGlobalLoading);
        if (rs == "Token Expired") {
          //Refresh token
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            dispatch(HRTI008_ReloadListMCC());
            //handle call to update service
            updateService();
            if (rs.data.p_msg == "S_DEL") {
              Alert.alert("Thông báo", "Xoá máy chấm công thành công");
            } else if (rs.data.p_msg == "S_INS") {
              Alert.alert("Thông báo", "Thêm mới máy chấm công thành công");
            } else if (rs.data.p_msg == "S_UPD") {
              Alert.alert("Thông báo", "Cập nhật máy chấm công thành công");
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const updateService = () => {
    console.log(diaChiService);
    let str_url = diaChiService + "/GetMachineList";
    axios
      .get(str_url)
      .then((rs) => {
        console.log("succes");
        navigation.goBack();
      })
      .catch((error) => {
        navigation.goBack();
        console.log(error);
      });
  };
  const checkConnect = (type) => {
    dispatch(ShowGlobalLoading);
    if (type == "MITA") {
      const str_url = diaChiService + "/ConnectToTerminalMita";
      console.log("str_url", str_url);

      const in_par = {
        MACHINE_IP: diaChiIP,
        PORT: congKetNoi,
      };

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${tokenLogin}`,
          "content-type": "application/json",
        },
      };

      axios
        .post(
          str_url,
          in_par,
          {
            headers: {
              "content-type": "application/json",
            },
          },
          axiosConfig
        )
        .then((rs) => {
          dispatch(HideGlobalLoading);
          if (rs.data.Result == "S") {
            setTinhTrangKetNoi(rs.data.Data.Message);
            setColorKetNoi(rs.data.Data.Status == "S" ? "green" : "red");
            const now = moment(new Date()).format("DD/MM/YYYY HH:mm");
            setThoiGianGanNhat("Thời gian gần nhất: " + now);
          } else {
            setTinhTrangKetNoi("Lỗi kết nối");
            setColorKetNoi("red");
            Alert.alert("Thông báo", rs.data.Data.Message);
          }
        })
        .catch((error) => {
          Alert.alert("Thông báo", "Lỗi kết nối");
          dispatch(HideGlobalLoading);
          console.log(error);
        });
    }
    if (type == "HIK") {
      Alert.alert("Thông báo", "Chức năng đang phát triển");
      dispatch(HideGlobalLoading);
    }
  };

  return (
    <>
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader
          goBack={() => {
            navigation.goBack();
          }}
        >
          Thông tin máy chấm công
        </TVSHeader>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Block flex={1} backgroundColor={Color.white} paddingTop={5}>
            {flag == "edit" ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  borderBottomColor: "#ddd",
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    marginVertical: 5,
                    flex: 1,
                    paddingHorizontal: 10,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Icon
                      name={"circle"}
                      color={colorKetNoi ? colorKetNoi : "red"}
                      size={10}
                      style={{
                        marginTop: 5,
                        marginRight: 5,
                      }}
                    />

                    <Text
                      numberOfLines={1}
                      style={{
                        color: colorKetNoi ? colorKetNoi : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {tinhTrangKetNoi}
                    </Text>
                  </View>

                  {thoiGianGanNhat ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "black",
                        opacity: 0.6,
                      }}
                    >
                      {thoiGianGanNhat}
                    </Text>
                  ) : null}
                </View>

                <View style={{ paddingHorizontal: 10 }}>
                  <Icon
                    name={"sync"}
                    color={Color.mainColor}
                    size={24}
                    onPress={() => checkConnect(selectCodeLoaiMay)}
                  />
                </View>
              </View>
            ) : null}

            <ScrollView paddingHorizontal={10} flex={1}>
              <View
                style={{
                  flex: 1,
                  paddingTop: 5,
                  paddingBottom: 10,
                }}
              >
                <TVSList3
                  required={true}
                  colorLabel="black"
                  label={"Loại máy chấm công"}
                  dataItem={dataSelectLoaiMay}
                  dataItemCurrent={dataLoaiMayCurrent}
                  titleModal={"Chọn loại máy chấm công"}
                  code={selectCodeLoaiMay}
                  code_nm={selectNameLoaiMay}
                  onChangeSelect={(val) => onChangeSelectLoaiMay(val)}
                />
                <TVSTextInput
                  required={true}
                  label={"Mã máy"}
                  colorLabel="black"
                  placeholder={"Nhập mã máy"}
                  value={maMay}
                  changeValue={setMaMay}
                />
                <TVSTextInput
                  required={true}
                  label={"Tên máy"}
                  colorLabel="black"
                  placeholder={"Nhập tên máy"}
                  value={tenMay}
                  changeValue={setTenMay}
                />
                <TVSTextInput
                  required={true}
                  label={"Địa chỉ IP"}
                  colorLabel="black"
                  placeholder={"Nhập địa chỉ IP"}
                  value={diaChiIP}
                  changeValue={setDiaChiIP}
                />
                <TVSTextInput
                  required={true}
                  label={"Cổng"}
                  colorLabel="black"
                  placeholder={"Nhập cổng"}
                  value={congKetNoi}
                  changeValue={setCongKetNoi}
                />
                {selectCodeLoaiMay == "MITA" ? (
                  <View>
                    <TVSTextInput
                      label={"Địa chỉ window service"}
                      colorLabel="black"
                      placeholder={"Nhập địa chỉ window service"}
                      value={diaChiService}
                      changeValue={setDiaChiService}
                      multiLine={true}
                    />
                  </View>
                ) : selectCodeLoaiMay == "HIK" ? (
                  <View>
                    <TVSTextInput
                      label={"Địa chỉ api server"}
                      colorLabel="black"
                      placeholder={"Nhập địa chỉ api server"}
                      value={diaChiApiServer}
                      changeValue={setDiaChiApiServer}
                    />
                    <TVSTextInput
                      label={"Địa chỉ window service"}
                      colorLabel="black"
                      placeholder={"Nhập địa chỉ window service"}
                      value={diaChiWindowService}
                      changeValue={setDiaChiWindowService}
                    />
                  </View>
                ) : null}
                {/* Mat khau */}
                {selectCodeLoaiMay == "HIK" ? (
                  <Block column={true} marginVertical={5}>
                    <Block
                      style={{
                        flexDirection: "row",
                        paddingBottom: 5,
                        paddingLeft: 5,
                        alignItems: "center",
                        marginHorizontal: 10,
                      }}
                    >
                      <Text style={{ color: "black" }}>Mật khẩu</Text>
                      <Text style={{ color: Color.red }}> *</Text>
                    </Block>

                    <Block
                      marginHorizontal={10}
                      paddingLeft={10}
                      alignCenter
                      row
                      backgroundColor={Color.gray}
                      radius={8}
                    >
                      <TextInput
                        style={{ flex: 1 }}
                        // disabled={flag == 'edit' ? true : false}
                        size={15}
                        height={55}
                        placeholder={"Nhập mật khẩu"}
                        autoCompleteType={"password"}
                        color={Color.mainColor}
                        placeholderTextColor={Color.grayPlahoder}
                        secureTextEntry={eye}
                        value={matKhau}
                        onChangeText={(text) => setMatKhau(text)}
                      />
                      <Button
                        justifyCenter
                        height={30}
                        width={30}
                        nextScreen={() => setEye(!eye)}
                      >
                        {eye ? <EyeOpen /> : <EyeClose />}
                      </Button>
                    </Block>
                  </Block>
                ) : null}

                {/* Phuong thuc cham cong */}
                <Block column={true} marginBottom={10}>
                  <Block
                    style={{
                      flexDirection: "row",
                      paddingBottom: 5,
                      paddingLeft: 5,
                      alignItems: "center",
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ color: "black" }}>
                      Phương thức chấm công
                    </Text>
                    <Text style={{ color: Color.red }}> *</Text>
                  </Block>
                  <Block
                    marginHorizontal={10}
                    marginTop={5}
                    justifyContent={"space-between"}
                    row
                    borderRadius={8}
                  >
                    <ItemCheck
                      disabled={flag == "edit" ? true : false}
                      title={"Thẻ từ"}
                      type={"card"}
                      item={phuongThucChamCong.auth_card_yn}
                    />
                    <ItemCheck
                      disabled={flag == "edit" ? true : false}
                      title={"Khuôn mặt"}
                      type={"face"}
                      item={phuongThucChamCong.auth_face_yn}
                    />
                    <ItemCheck
                      disabled={flag == "edit" ? true : false}
                      title={"Vân tay"}
                      type={"finger"}
                      item={phuongThucChamCong.auth_finger_yn}
                    />
                  </Block>
                </Block>

                <TVSList3
                  colorLabel="black"
                  label={"Quét vào ra"}
                  dataItem={quetVaoRa}
                  dataItemCurrent={dataVaoRaCurrent}
                  titleModal={"Chọn loại quét"}
                  code={selectCodeVaoRa}
                  code_nm={selectNameVaoRa}
                  onChangeSelect={(val) => onChangeSelectVaoRa(val)}
                />

                {/* Sử dụng YN */}
                <View style={{ marginBottom: 10 }}>
                  <Block
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}
                  >
                    {suDungYN == "Y" ? (
                      <TVSCheckBox
                        value={"Y"}
                        onPress={() => setSuDungYN("N")}
                      />
                    ) : (
                      <TVSCheckBox
                        value={"N"}
                        onPress={() => setSuDungYN("Y")}
                      />
                    )}
                    <Text
                      style={{
                        color: "black",
                        marginLeft: 5,
                      }}
                    >
                      Sử dụng Y/N
                    </Text>
                  </Block>
                </View>
              </View>
            </ScrollView>

            {/* Button bottom */}
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 10,
                paddingBottom: 15,
                paddingTop: 10,
              }}
            >
              {flag == "edit" ? null : (
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"secondary"}
                    icon={"sync"}
                    buttonStyle={"3"}
                    onPress={() => resetForm()}
                  >
                    Làm mới
                  </TVSButton>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <TVSButton
                  type={"primary"}
                  icon={"content-save"}
                  buttonStyle={"3"}
                  onPress={() => {
                    checkValidate(actionActive.current);
                  }}
                >
                  Sao lưu
                </TVSButton>
              </View>

              {flag == "edit" ? (
                <View style={{ flex: 1 }}>
                  <TVSButton
                    type={"danger"}
                    icon={"delete"}
                    buttonStyle={"3"}
                    onPress={() => {
                      deleteMayChamCong();
                    }}
                  >
                    Xoá bỏ
                  </TVSButton>
                </View>
              ) : null}
            </View>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    </>
  );
};

export default ChiTiet;
