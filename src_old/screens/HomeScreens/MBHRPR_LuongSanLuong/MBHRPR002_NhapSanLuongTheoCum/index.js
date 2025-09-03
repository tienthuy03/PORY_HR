import moment from "moment";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Icon_time from "../../../../icons/Datev";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import Calender from "../../../../components/Calendes";
import { showAlert } from "../../../../components/Tvs/TVSAlertORA";
import sysFetch from "../../../../services/fetch_v1";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { APP_VERSION } from "../../../../config/Pro";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
// import DS from "./DanhSach";
import NetInfo from "@react-native-community/netinfo";
import ShowError from "../../../../services/errors";

const NhapSanLuongTheoCum = ({ navigation: { goBack } }) => {
  const navigation = useNavigation();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);
  const isFocused = useIsFocused();
  let thr_emp_pk = "";
  let tokenLogin = "";
  let refreshToken = "";
  let crt_by = "";
  try {
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullnames = loginReducers.data.data.full_name;
    tokenLogin = loginReducers.data.data.tokenLogin;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }

  const [modalDateVisible, setModalDateVisible] = useState(false);
  const [daySelect, setDateSelect] = useState(
    moment(new Date()).format("DD/MM/YYYY")
  );
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const getStateCalendar = async (result) => {
    setModalDateVisible(false);
    setStartDate(result.startingDays);
    setEndDate(result.endingDays);
    setDateSelect(result.daySelecteds);

    getData(
      moment(result.startingDays).format("YYYYMMDD"),
      moment(result.endingDays).format("YYYYMMDD")
    );
  };
  const toggleModal = () => {
    setModalDateVisible(!modalDateVisible);
  };
  const modalDate = (
    <TVSControlPopup
      title={"Chọn ngày"}
      isShow={modalDateVisible}
      onHide={() => setModalDateVisible(false)}
      minHeight={450}
      maxHeight={450}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalDateVisible(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <Calender
        getState={getStateCalendar}
        startDayss={startDate}
        endDayss={endDate}
      />
    </TVSControlPopup>
  );
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [editText, setEditText] = useState("");
  const [editPK, setEditPK] = useState("");
  const [editVal01, setEditVal01] = useState("");
  const [editNm01, setEditNm01] = useState("");
  const [editVal02, setEditVal02] = useState("");
  const [editNm02, setEditNm02] = useState("");
  const [editVal03, setEditVal03] = useState("");
  const [editNm03, setEditNm03] = useState("");
  const [editVal04, setEditVal04] = useState("");
  const [editNm04, setEditNm04] = useState("");
  const [editVal05, setEditVal05] = useState("");
  const [editNm05, setEditNm05] = useState("");
  const [editVal06, setEditVal06] = useState("");
  const [editNm06, setEditNm06] = useState("");
  const [editVal07, setEditVal07] = useState("");
  const [editNm07, setEditNm07] = useState("");
  const [editVal08, setEditVal08] = useState("");
  const [editNm08, setEditNm08] = useState("");
  const [editVal09, setEditVal09] = useState("");
  const [editNm09, setEditNm09] = useState("");
  const [editVal10, setEditVal10] = useState("");
  const [editNm10, setEditNm10] = useState("");
  const modalEdit = (
    <TVSControlPopup
      title={"Chỉnh sửa"}
      isShow={modalEditVisible}
      onHide={() => setModalEditVisible(false)}
      minHeight={250}
      // maxHeight={450}
      bottom={
        <>
          <TVSButton
            // type={"danger"}
            icon={"content-save"}
            buttonStyle={"3"}
            onPress={() => validate("UPDATE")}
          >
            Sao lưu
          </TVSButton>
          <TVSButton
            type={"danger"}
            icon={"close"}
            buttonStyle={"3"}
            onPress={() => setModalEditVisible(false)}
          >
            Đóng lại
          </TVSButton>
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {editNm01 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm01}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm01 + ""}
                value={editVal01.toString()}
                onChangeText={setEditVal01}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm02 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm02}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm02 + ""}
                value={editVal02.toString()}
                onChangeText={setEditVal02}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm03 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm03}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm03 + ""}
                value={editVal03.toString()}
                onChangeText={setEditVal03}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm04 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm04}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm04 + ""}
                value={editVal04.toString()}
                onChangeText={setEditVal04}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm05 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm05}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm05 + ""}
                value={editVal05.toString()}
                onChangeText={setEditVal05}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm06 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm06}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm06 + ""}
                value={editVal06.toString()}
                onChangeText={setEditVal06}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm07 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm07}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm07 + ""}
                value={editVal07.toString()}
                onChangeText={setEditVal07}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm08 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm08}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm08 + ""}
                value={editVal08.toString()}
                onChangeText={setEditVal08}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm09 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm09}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm09 + ""}
                value={editVal09.toString()}
                onChangeText={setEditVal09}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        {editNm10 != "" ? (
          <Block
            style={{
              flex: 1,
              paddingHorizontal: 5,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Block
              style={{
                flexDirection: "row",
                paddingBottom: 5,
                paddingLeft: 5,
                alignItems: "center",
              }}
            >
              <Text color={Color.mainColor}>{editNm10}</Text>
            </Block>
            <Block
              style={{
                backgroundColor: Color.gray,
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 6,
                minHeight: 30,
              }}
            >
              <TextInput
                placeholder={"Nhập " + editNm10 + ""}
                value={editVal10.toString()}
                onChangeText={setEditVal10}
                keyboardType="numeric"
              />
            </Block>
          </Block>
        ) : null}
        <Block
          style={{
            flex: 1,
            paddingHorizontal: 5,
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <Block
            style={{
              flexDirection: "row",
              paddingBottom: 5,
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <Text color={Color.mainColor}>Ghi chú</Text>
          </Block>
          <Block
            style={{
              backgroundColor: Color.gray,
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 6,
              minHeight: 50,
            }}
          >
            <TextInput
              multiline={true}
              placeholder={"Nhập ghi chú"}
              value={editText}
              onChangeText={setEditText}
            />
          </Block>
        </Block>
      </ScrollView>
    </TVSControlPopup>
  );
  const validate = (action, pk) => {
    if (action == "UPDATE") {
      Alert.alert(
        "Thông báo",
        "Bạn có muốn sao lưu không?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  onSave();
                } else {
                  ShowError("No internet");
                }
              });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Thông báo",
        "Bạn có muốn xóa bỏ không?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              NetInfo.fetch().then((state) => {
                if (state.isConnected) {
                  onConfirmDelete(pk);
                } else {
                  ShowError("No internet");
                }
              });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  const onConfirmDelete = (pk) => {
    const pro = "UPDHRPR002001";
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: pk,
      p3_varchar2: "",
      p4_varchar2: "",
      p5_varchar2: "",
      p6_varchar2: "",
      p7_varchar2: "",
      p8_varchar2: "",
      p9_varchar2: "",
      p10_varchar2: "",
      p11_varchar2: "",
      p12_varchar2: "",
      p13_varchar2: "",
      p14_varchar2: APP_VERSION,
      p15_varchar2: crt_by,
    };
    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_varchar2: "status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs.results == "F") {
          showAlert(rs.errorData);
        } else {
          fetchData();
          showAlert(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSave = () => {
    const pro = "UPDHRPR002001";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: editPK,
      p3_varchar2: editText,
      p4_varchar2: editVal01,
      p5_varchar2: editVal02,
      p6_varchar2: editVal03,
      p7_varchar2: editVal04,
      p8_varchar2: editVal05,
      p9_varchar2: editVal06,
      p10_varchar2: editVal07,
      p11_varchar2: editVal08,
      p12_varchar2: editVal09,
      p13_varchar2: editVal10,
      p14_varchar2: APP_VERSION,
      p15_varchar2: crt_by,
    };
    console.log(pro, in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_varchar2: "status",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("rs ", rs);
        if (rs.results == "F") {
          showAlert(rs.errorData);
        } else {
          fetchData();
          setModalEditVisible(false);
          showAlert(rs.data.status);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [totalRow, setTotalRow] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [data, setData] = useState([]);

  const renderItem = ({ item }) => {
    if (item.title == "null") {
      return null;
    } else {
      var m1 = "";
      var m2 = "";
      var m3 = "";
      let styleTitle = {};
      let styleKey = {};
      let styleRow = {};
      let tempTitle = [];
      tempTitle = item.style_title.split(",");
      if (tempTitle.length > 0) {
        tempTitle.forEach(function (itemTitle, idx) {
          m1 = m1 + '"' + itemTitle.trim().replace(":", '":"') + '"' + ",";
        });
      }

      if (item.style_title != "") {
        m1 = m1.substring(0, m1.length - 1);
        m1 = `{${m1}}`;
        styleTitle = JSON.parse(m1);
      }
      let tempKey = [];
      tempKey = item.style_key.split(",");
      if (tempKey.length > 0) {
        tempKey.forEach(function (itemKey, idx) {
          m2 = m2 + '"' + itemKey.trim().replace(":", '":"') + '"' + ",";
        });
      }
      if (item.style_key != "") {
        m2 = m2.substring(0, m2.length - 1);
        m2 = `{${m2}}`;
        styleKey = JSON.parse(m2);
      }

      let tempRow = [];
      tempRow = item.style_row.split(";");

      if (tempRow.length > 0) {
        tempRow.forEach(function (itemRow, idx) {
          m3 = m3 + '"' + itemRow.trim().replace(":", '":"') + '"' + ",";
        });
      }
      if (item.style_row != "") {
        m3 = m3.substring(0, m3.length - 1);
        m3 = `{${m3}}`;
        styleRow = JSON.parse(m3);
      }
      return item.col_name.toLowerCase() != "idline" &&
        item.col_name.toLowerCase() != "idbtn" ? (
        <View
          flexDirection={"row"}
          backgroundColor={"white"}
          paddingVertical={5}
          paddingLeft={item.title == " " && item.key == " " ? 0 : 10}
          paddingRight={item.title == " " && item.key == " " ? 0 : 10}
          marginHorizontal={10}
          // borderBottomWidth={1}
          // borderBottomColor={"#F4F6F7"}
          justifyContent={"space-between"}
          style={[
            styleRow,
            item.first_row == "Y"
              ? { borderTopLeftRadius: 8, borderTopRightRadius: 8 }
              : null,
            item.last_row == "Y"
              ? { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }
              : null,
          ]}
        >
          <View flex={1}>
            <Text flexWrap={"wrap"} style={styleTitle}>
              {item.title}
            </Text>
          </View>
          <View flex={1}>
            <Text paddingRight={5} style={styleKey} right flexWrap={"wrap"}>
              {item.key}
            </Text>
          </View>
        </View>
      ) : item.col_name.toLowerCase() == "idbtn" ? (
        <View
          flexDirection={"row"}
          backgroundColor={"white"}
          paddingVertical={5}
          marginHorizontal={10}
          justifyContent={"space-between"}
          style={[
            styleRow,
            { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              marginRight: 5,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate("AddNewLSLTC");
                  onEdit(item.key);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderRadius: 8,
                  padding: 5,
                  borderColor: "#5A94E7",
                  backgroundColor: "white",
                  // shadowColor: "#000",
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2,
                  // },
                  // shadowOpacity: 0.3,
                  // shadowRadius: 3.5,
                }}
              >
                <Icon name={"pencil"} color={"#5A94E7"} size={15} />
                <Text style={{ color: "#5A94E7" }}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              marginLeft: 5,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate("AddNewLSLTC");
                  onDelete(item.key);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderRadius: 8,
                  padding: 5,
                  borderColor: "red",
                  backgroundColor: "white",
                  // shadowColor: "#000",
                  // shadowOffset: {
                  //   width: 0,
                  //   height: 2,
                  // },
                  // shadowOpacity: 0.3,
                  // shadowRadius: 3.5,
                }}
              >
                <Icon name={"trash-can-outline"} color={"red"} size={15} />
                <Text style={{ color: "red" }}>Xóa bỏ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View
          flexDirection={"row"}
          // backgroundColor={"white"}
          // paddingVertical={5}
          justifyContent={"space-between"}
          style={styleRow}
        >
          <View flex={1}>
            <Text flexWrap={"wrap"} style={styleTitle}>
              {item.title}
            </Text>
          </View>
          <View flex={1}>
            <Text paddingRight={5} style={styleKey} right flexWrap={"wrap"}>
              {item.key}
            </Text>
          </View>
        </View>
      );
    }
  };
  const onDelete = (pk) => {
    validate("DELETE", pk);
  };
  const onEdit = (pk) => {
    console.log("edit ", pk);
    setEditNm01("");
    setEditNm02("");
    setEditNm03("");
    setEditNm04("");
    setEditNm05("");
    setEditNm06("");
    setEditNm07("");
    setEditNm08("");
    setEditNm09("");
    setEditNm10("");

    setEditVal01("");
    setEditVal02("");
    setEditVal03("");
    setEditVal04("");
    setEditVal05("");
    setEditVal06("");
    setEditVal07("");
    setEditVal08("");
    setEditVal09("");
    setEditVal10("");
    // setEditText("");
    setEditPK(pk);
    // setModalEditVisible(true);
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR002005";
    const in_par = {
      p1_varchar2: pk,
      p2_varchar2: APP_VERSION,
      p3_varchar2: crt_by,
    };
    console.log("in_par ", in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs.results == "F") {
          showAlert(rs.errorData);
          dispatch(HideGlobalLoading);
        } else {
          console.log(rs.data.data);
          if (rs.data.data[0].lan_01 != "") {
            setEditVal01(rs.data.data[0].lan_01);
            setEditNm01(rs.data.data[0].lan_01_nm);
          }
          if (rs.data.data[0].lan_02 != "") {
            setEditVal02(rs.data.data[0].lan_02);
            setEditNm02(rs.data.data[0].lan_02_nm);
          }
          if (rs.data.data[0].lan_03 != "") {
            setEditVal03(rs.data.data[0].lan_03);
            setEditNm03(rs.data.data[0].lan_03_nm);
          }
          if (rs.data.data[0].lan_04 != "") {
            setEditVal04(rs.data.data[0].lan_04);
            setEditNm04(rs.data.data[0].lan_04_nm);
          }
          if (rs.data.data[0].lan_05 != "") {
            setEditVal05(rs.data.data[0].lan_05);
            setEditNm05(rs.data.data[0].lan_05_nm);
          }
          if (rs.data.data[0].lan_06 != "") {
            setEditVal06(rs.data.data[0].lan_06);
            setEditNm06(rs.data.data[0].lan_06_nm);
          }
          if (rs.data.data[0].lan_07 != "") {
            setEditVal07(rs.data.data[0].lan_07);
            setEditNm07(rs.data.data[0].lan_07_nm);
          }
          if (rs.data.data[0].lan_08 != "") {
            setEditVal08(rs.data.data[0].lan_08);
            setEditNm08(rs.data.data[0].lan_08_nm);
          }
          if (rs.data.data[0].lan_09 != "") {
            setEditVal09(rs.data.data[0].lan_09);
            setEditNm09(rs.data.data[0].lan_09_nm);
          }
          if (rs.data.data[0].lan_10 != "") {
            setEditVal10(rs.data.data[0].lan_10);
            setEditNm10(rs.data.data[0].lan_10_nm);
          }
          // setEditText(rs.data.data[0].description);
          // setEditQuantity(rs.data.data[0].quantity);
          setModalEditVisible(true);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const fetchData = () => {
    setData([]);
    setTotalRow(0);
    setTotalQuantity(0);
    getData(
      moment(startDate).format("YYYYMMDD"),
      moment(endDate).format("YYYYMMDD")
    );
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const getData = (startDt, endDt) => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR002000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: startDt,
      p3_varchar2: endDt,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };
    console.log("in_par ", in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs.results == "F") {
          showAlert(rs.errorData);
          dispatch(HideGlobalLoading);
        } else {
          // dialogNoti("Đăng ký nhận cơm chay thành công");
          // getDataDateEatRice();
          // setTablePK(rs.data.status);
          // console.log(rs.data.data);
          setData(rs.data.data);
          setTotalRow(
            rs.data.data.filter((x) => x.col_name == "idline").length
          );
          let total = 0;
          rs.data.data
            .filter((x) => x.col_name == "idquantity")
            .forEach(function (item) {
              total += parseInt(item.key);
            });
          setTotalQuantity(total);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRPR002",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRPR002")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <Block
          marginLeft={10}
          marginRight={10}
          radius={8}
          backgroundColor={Color.white}
        >
          <Button
            nextScreen={toggleModal}
            row
            alignCenter
            justifyContent={"space-between"}
          >
            <Icon_time style={{ marginLeft: 20 }} />
            <Text center color={Color.mainColor} flex size={14} padding={10}>
              Ngày {daySelect}
            </Text>
            <Text marginRight={10} />
          </Button>
          {modalDate}
        </Block>
        <Block
          marginLeft={10}
          marginRight={10}
          marginTop={5}
          marginBottom={10}
          row
        >
          <View
            style={{
              marginLeft: 10,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "blue" }}>Số dòng: {totalRow}</Text>
          </View>
          <View
            style={{
              marginLeft: 10,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: "red" }}>Tổng số lượng: {totalQuantity}</Text>
          </View>
          <View
            style={{
              right: 0,
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddNewLSLTC");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 0.5,
                borderRadius: 8,
                padding: 5,
                borderColor: "#3CB371",
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 3.5,
              }}
            >
              <Icon name={"plus"} color={"#3CB371"} size={20} />
              <Text style={{ color: "#3CB371" }}>Thêm mới</Text>
            </TouchableOpacity>
          </View>
        </Block>
        <FlatList
          data={data}
          refreshing={false}
          onRefresh={() => fetchData()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReachedThreshold={0.5}
          extraData={data}
          ListEmptyComponent={() => (
            <Block alignCenter justifyCenter marginTop={20}>
              <Text>Không có dữ liệu !</Text>
            </Block>
          )}
        />
        {modalEdit}
      </Block>
    </Block>
  );
};

export default NhapSanLuongTheoCum;
