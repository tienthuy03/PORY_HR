import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import TVSButton from "../../../../../components/Tvs/Button";
import moment from "moment";
import { Text, SafeAreaView, View } from "react-native";
import OneField from "../../../../../components/OneFieldKeyValue";
import { FlatList, Alert, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MonthPicker from "react-native-month-year-picker";
import Icon_calendar from "../../../../../icons/Datev";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DSPDG = () => {
  const navigation = useNavigation();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  let thr_emp_pk = "";
  let tokens = "";
  let fullname = "";
  let crt_by = "";

  try {
    tokens = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    //
  }
  const handleGetData = () => {
    getData(month);
  };
  useEffect(() => {
    getData(
      moment(new Date().setMonth(new Date().getMonth())).format("YYYYMM")
    );
  }, []);
  const [dataMaster, setDataMaster] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const getData = (month) => {
    sysFetch(
      API,
      {
        pro: "SELHRSV003001",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: month,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "master",
          p2_sys: "detail",
        },
      },
      tokens
    )
      .then((res) => {
        setDataMaster(res.data.master);
        setDataDetail(res.data.detail);
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };
  const renderItem = ({ item }) => {
    return (
      <Block flex marginLeft={10} marginBottom={10} marginRight={10}>
        <Block row justifyContent={"space-between"}>
          {item.label && (
            <Block
              borderTopLeftRadius={6}
              borderTopRightRadius={6}
              backgroundColor={Color.white}
              height={35}
              alignCenter
              justifyCenter
              paddingLeft={10}
              paddingRight={10}
            >
              <Text style={{ color: Color.mainColor }} size={14}>
                {item.label}
              </Text>
            </Block>
          )}
          <Text color={Color.white} size={13} />
        </Block>
        <Block
          backgroundColor={Color.white}
          borderBottomLeftRadius={6}
          borderBottomRightRadius={6}
          borderColor={Color.oneContentBorder}
          borderWidth={1}
          paddingBottom={5}
        >
          {Object.entries(item).map((oneField, index) => {
            return (
              oneField[0].substr(0, 1) === "_" && (
                <OneField
                  value={oneField[1]}
                  keyName={
                    oneField[0].replace("_", "").substr(0, 1).toUpperCase() +
                    oneField[0]
                      .replace("_", "")
                      .substr(1, oneField[0].replace("_", "").length)
                  }
                />
              )
            );
          })}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={dataDetail.filter((x) => x.parent_pk == item.pk)}
            renderItem={renderItemDetail}
            keyExtractor={(item, index) => index.toString()}
          />
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              backgroundColor: "#FFFFFF",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <TVSButton
                buttonStyle="3"
                onPress={() => {
                  navigation.navigate("UpdatePDGT", {
                    itemRoute: item,
                    onRefresh: handleGetData,
                  });
                }}
                type={"secondary"}
                icon={"sync"}
              >
                Chỉnh sửa
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
              <TVSButton
                buttonStyle="3"
                type={"danger"}
                onPress={() => confirmDelete(item.pk)}
                icon={"trash-can-outline"}
              >
                Xóa bỏ
              </TVSButton>
            </View>
          </View>
        </Block>
      </Block>
    );
  };
  const confirmDelete = (pk) => {
    Alert.alert("Thông báo", "Bạn có muốn xóa bỏ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => onDelete(pk) },
    ]);
  };
  const onDelete = (pk) => {
    sysFetch(
      API,
      {
        pro: "UPDHRSV003000",
        in_par: {
          p1_varchar2: "DELETE",
          p2_varchar2: pk,
          p3_varchar2: "",
          p4_varchar2: "",
          p5_varchar2: "",
          p6_varchar2: "",
          p7_varchar2: "",
          p8_varchar2: "",
          p9_varchar2: "",
          p10_varchar2: APP_VERSION,
          p11_varchar2: crt_by,
        },
        out_par: {
          p1_varchar2: "showDialog",
        },
      },
      tokens
    )
      .then((res) => {
        handleGetData();
        // setComfirmSent()
        if (res.results == "F") {
          let newText = res.errorData.split("ORA");
          let errors = "";
          try {
            errors = newText[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: Xóa bỏ không thành công.";
          }
          Alert.alert(
            "Thông báo",
            errors,
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            "Thông báo",
            "Xóa bỏ thành công",
            [
              {
                text: "Thoát",
                onPress: () => {},
                style: "cancel",
              },
            ],
            { cancelable: false }
          );
          // setSendStatus(res.data.showDialog);
        }
      })
      .catch((error) => {
        console.log("error");
        console.log(error);
      });
  };
  const renderItemDetail = ({ item }) => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 5,
          paddingBottom: 10,
        }}
      >
        <View style={{}}>
          <Text>{item.ques_name}</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <View
            style={{
              width: 18,
              height: 18,
              margin: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 18 / 2,
              borderWidth: 2,
              borderColor: Color.mainColor,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 10 / 2,
                backgroundColor: Color.mainColor,
              }}
            />
          </View>
          <View style={{ paddingLeft: 3, marginTop: 5, opacity: 0.8 }}>
            <Text>{item.ans_nm}</Text>
          </View>
        </View>
        {item.extend_reply != undefined && item.extend_reply != "" ? (
          <View style={{ marginLeft: 15, marginTop: 5, flexDirection: "row" }}>
            <Icon
              name={"square-edit-outline"}
              color={Color.mainColor}
              size={20}
            />
            <Text style={{ paddingLeft: 8 }}>{item.extend_reply}</Text>
          </View>
        ) : null}
      </View>
    );
  };
  const onRenderNoItem = () => {
    return (
      <Block justifyCenter alignCenter flex marginTop={20}>
        <Text>Không có dữ liệu !</Text>
      </Block>
    );
  };
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth()))
  );
  const [dateString, setDateString] = useState(
    moment(new Date().setMonth(new Date().getMonth())).format("MM-YYYY")
  );
  const [month, setMonth] = useState(
    moment(new Date().setMonth(new Date().getMonth())).format("YYYYMM")
  );
  const [show, setShow] = useState(false);
  const onValueChange = async (event, newDate) => {
    setShow(false);
    setDate(newDate);
    setDateString(moment(newDate).format("MM-YYYY"));
    setMonth(moment(newDate).format("YYYYMM"));
    getData(moment(newDate).format("YYYYMM"));
  };
  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor={Color.gray}>
      <View
        style={{
          flexDirection: "column",
          backgroundColor: Color.gray,
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginHorizontal: 10, marginTop: 5, flex: 1 }}>
            <View style={{ backgroundColor: Color.white, borderRadius: 8 }}>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={{
                  flexDirection: "row",
                  padding: 10,
                }}
              >
                <View>
                  <Icon_calendar color={Color.mainColor} />
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: Color.mainColor,
                    }}
                  >
                    Tháng {dateString}
                  </Text>
                </View>
                <View>
                  <Text style={{ paddingLeft: 10 }} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 5 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            onRefresh={() => getData(month)}
            refreshing={false}
            data={dataMaster}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={onRenderNoItem}
          />
        </View>
        {show && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(date)}
            // maximumDate={new Date()}
            enableAutoDarkMode={Platform.OS === "ios" ? true : false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
export default DSPDG;
