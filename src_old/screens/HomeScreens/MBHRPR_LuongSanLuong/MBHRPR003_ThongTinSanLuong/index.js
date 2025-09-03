import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import { View, FlatList, TouchableOpacity } from "react-native";
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
import MonthPicker from "react-native-month-year-picker";
import Icon_calendar from "../../../../icons/Datev";
import TVSControlPopupBottom from "../../../../components/Tvs/ControlPopupBottom";
import TVSList from "../../../../components/Tvs/TVSList";
// import DS from "./DanhSach";

const LichSu = ({ navigation: { goBack } }) => {
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
  const [totalRow, setTotalRow] = useState(0);
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth()))
  );
  const [show, setShow] = useState(false);
  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
      getData(formatDate(selectedDate));
    },
    [date, showPicker]
  );
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const [dataOrg, setDataOrg] = useState([]);
  const [isShowDetail, setIsShowDetail] = useState(false);

  const fetchData = () => {
    setData([]);
    getData(formatDate(date));
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${year}${formattedMonth}`;
  };
  const getData = (mon) => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR003000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: mon,

      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    };
    console.log("in_par getData ", in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "data",
          p2_sys: "lst_org",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs.results == "F") {
          showAlert(rs.errorData);
          dispatch(HideGlobalLoading);
        } else {
          setData(rs.data.data);
          setDataOrg(rs.data.lst_org);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

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
        // <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        //   <View
        //     style={{
        //       borderTopLeftRadius: 6,
        //       borderTopRightRadius: 6,
        //       height: 35,
        //       alignItems: "center",
        //       justifyContent: "center",
        //       paddingHorizontal: 10,
        //       backgroundColor: "white",
        //     }}
        //   >
        //     <Text style={{ color: Color.mainColor, size: 14 }}>
        //       {item.title}
        //     </Text>
        //   </View>
        //   <Text style={{ color: Color.mainColor, size: 14 }} />
        // </View>
        // ) :
        <View
          flexDirection={"row"}
          backgroundColor={"white"}
          paddingVertical={5}
          paddingLeft={item.title == " " && item.key == " " ? 0 : 10}
          paddingRight={item.title == " " && item.key == " " ? 0 : 10}
          marginHorizontal={10}
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
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  let objOrg = [];
                  let orgTmp = [...dataOrg];
                  orgTmp.forEach(function (itemOrg) {
                    if (itemOrg.code != "ALL" && itemOrg.code != "") {
                      objOrg.push(itemOrg.code);
                    }
                  });
                  getDataDetail(formatDate(date), objOrg, "ALL", "ALL");
                  getDataItem(formatDate(date), objOrg);
                  // setIsShowDetail(true);
                  // onShowDetail(formatDate(date));
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderRadius: 8,
                  padding: 5,
                  borderColor: "#5A94E7",
                  backgroundColor: "white",
                }}
              >
                <Icon name={"pencil"} color={"#5A94E7"} size={15} />
                <Text style={{ color: "#5A94E7" }}>{item.title}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View
          flexDirection={"row"}
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

  const getDataItem = (mon, strOrg) => {
    let str = "";
    strOrg.map((x) => (str += x + ","));
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR003002";
    const in_par = {
      p1_varchar2: mon,
      p2_varchar2: str,
      p3_varchar2: APP_VERSION,
      p4_varchar2: crt_by,
    };
    console.log("in_par getDataItem ", in_par);
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
          setDataItem(rs.data.data);
          setItem_code("ALL");
          setItem_code_nm("Tất cả");
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const getDataProcess = (mon, strOrg, item_pk) => {
    let str = "";
    strOrg.map((x) => (str += x + ","));
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR003003";
    const in_par = {
      p1_varchar2: mon,
      p2_varchar2: str,
      p3_varchar2: item_pk,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };
    console.log("in_par getDataProcess ", in_par);
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
          setDataProcess(rs.data.data);
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };
  const getDataDetail = (mon, strOrg, item, process) => {
    setTotalRow(0);
    let str = "";
    strOrg.map((x) => (str += x + ","));
    dispatch(ShowGlobalLoading);
    const pro = "SELHRPR003001";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: mon,
      p3_varchar2: str,
      p4_varchar2: item,
      p5_varchar2: process,
      p6_varchar2: APP_VERSION,
      p7_varchar2: crt_by,
    };
    console.log("in_par getDataDetail ", in_par);
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
          setIsShowDetail(true);
          showAlert(rs.errorData);
          dispatch(HideGlobalLoading);
        } else {
          setIsShowDetail(true);
          setDataDetail(rs.data.data);
          setTotalRow(
            rs.data.data.filter((x) => x.col_name == "idline").length
          );
          dispatch(HideGlobalLoading);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsShowDetail(true);
        dispatch(HideGlobalLoading);
      });
  };
  //Ma hang
  const [modalVisibleItem, setModalVisibleItem] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [item_code, setItem_code] = useState("ALL");
  const [item_code_nm, setItem_code_nm] = useState("Tất cả");

  //Cong doan
  const [modalVisibleProcess, setModalVisibleProcess] = useState(false);
  const [dataProcess, setDataProcess] = useState([]);
  const [process_code, setProcess_code] = useState("ALL");
  const [process_code_nm, setProcess_code_nm] = useState("Tất cả");

  const getStateItem = (result) => {
    setItem_code(result.code);
    setItem_code_nm(result.code_nm);
    setProcess_code("ALL");
    setProcess_code_nm("Tất cả");
    setModalVisibleItem(false);
    let objOrg = [];
    let orgTmp = [...dataOrg];
    orgTmp.forEach(function (itemOrg) {
      if (itemOrg.code != "ALL" && itemOrg.code != "") {
        objOrg.push(itemOrg.code);
      }
    });
    getDataDetail(formatDate(date), objOrg, result.code, "ALL");
    getDataProcess(formatDate(date), objOrg, result.code);
  };
  const getStateProcess = (result) => {
    setProcess_code(result.code);
    setProcess_code_nm(result.code_nm);

    let objOrg = [];
    let orgTmp = [...dataOrg];
    orgTmp.forEach(function (itemOrg) {
      if (itemOrg.code != "ALL" && itemOrg.code != "") {
        objOrg.push(itemOrg.code);
      }
    });
    getDataDetail(formatDate(date), objOrg, item_code, result.code);

    setModalVisibleProcess(false);
  };
  const modalItem = (
    <TVSControlPopupBottom
      title={"Chọn mã hàng"}
      isShow={modalVisibleItem}
      onHide={() => setModalVisibleItem(false)}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataItem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateItem(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopupBottom>
  );
  const modalProcess = (
    <TVSControlPopupBottom
      title={"Chọn công đoạn"}
      isShow={modalVisibleProcess}
      onHide={() => setModalVisibleProcess(false)}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataProcess}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateProcess(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopupBottom>
  );
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRPR003",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRPR003")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        {isShowDetail ? null : (
          <Block margin={10} radius={8} backgroundColor={Color.white}>
            <Button
              nextScreen={() => setShow(true)}
              row
              alignCenter
              padding={10}
              justifyContent={"space-between"}
            >
              <Icon_calendar color={Color.mainColor} marginLeft={20} />
              <Text
                size={14}
                paddingRight={20}
                center
                color={Color.mainColor}
                flex
                paddingLeft={10}
                height={60}
              >
                Tháng {moment(date).format("MM-YYYY")}
              </Text>
              <Text marginRight={10} />
            </Button>
          </Block>
        )}
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            okButton="Chọn"
            cancelButton="Huỷ"
            enableAutoDarkMode={Platform.OS === "ios" ? true : false}
          />
        )}
        {isShowDetail ? (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Thông tin chi tiết sản lượng
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setIsShowDetail(false);
              }}
              style={{
                position: "absolute",
                right: 0,
                paddingRight: 10,
                paddingLeft: 10,
              }}
            >
              <Icon name={"close"} size={20} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                marginHorizontal: 10,
                marginBottom: 10,
                paddingTop: 5,
                borderRadius: 8,
              }}
            >
              <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                    paddingLeft: 5,
                    alignItems: "center",
                  }}
                >
                  <Text color={Color.mainColor}>Mã hàng</Text>
                </View>
                <TVSList
                  onPress={() => setModalVisibleItem(true)}
                  colorText={item_code_nm == "Tất cả" ? "#B2B2B2" : null}
                  code_nm={item_code_nm}
                />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 5,
                    paddingLeft: 5,
                    alignItems: "center",
                  }}
                >
                  <Text color={Color.mainColor}>Công đoạn</Text>
                </View>
                <TVSList
                  onPress={() => setModalVisibleProcess(true)}
                  colorText={process_code_nm == "Tất cả" ? "#B2B2B2" : null}
                  code_nm={process_code_nm}
                />
              </View>
            </View>
            <View
              style={{
                marginLeft: 10,
                marginBottom: 5,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "blue" }}>Số dòng: {totalRow}</Text>
            </View>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dataDetail}
              refreshing={false}
              // onRefresh={() => fetchData()}
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
          </View>
        ) : (
          <FlatList
            data={data}
            refreshing={false}
            onRefresh={() => fetchData(item_code, process_code)}
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
        )}
        {/* {modalEdit} */}
        {modalItem}
        {modalProcess}
      </Block>
    </Block>
  );
};

export default LichSu;
