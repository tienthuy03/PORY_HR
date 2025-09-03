import moment from "moment";
import {
  Alert,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import axios from "axios";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Button from "../../../../../components/Button";
import IconDate from "../../../../../icons/Datev";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../../config/Pro";
import RequestSendNotificationV1 from "../../../../../services/notification/send_v1";
import TVSHeader from "../../../../../components/Tvs/Header";

const EditRegOT = ({ navigation: { goBack }, route }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // const tokenLogin = useSelector(
  //   state => state.loginReducers.data.data.tokenLogin,
  // );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  const crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );

  let thr_emp_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  let full_name = useSelector(
    (state) => state.loginReducers.data.data.full_name
  );

  const styles = StyleSheet.create({
    fieldsetTitle: {
      position: "absolute",
      top: -12,
      backgroundColor: "white",
      left: 10,
    },
    CheckBoxCircleY: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: "#5A94E7",
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
    CheckBoxCircleN: {
      width: 20,
      height: 20,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: Color.mainColor,
      marginRight: 5,
    },
    CheckBoxSquareY: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.primaryButton2,
      backgroundColor: Color.primaryButton2,
      justifyContent: "center",
      alignItems: "center",
    },
    CheckBoxSquareN: {
      width: 25,
      height: 25,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Color.mainColor,
    },
  });
  const [flagEnabled, setFlagEnabled] = useState("Y");
  const [limitedReg, setLimitedReg] = useState([]);
  const [flagEdit, setFlagEdit] = useState("N");
  const [decisNo, setDecisNo] = useState("");
  const [decisContent, setDecisContent] = useState("");
  const [otStandard, setOtStandard] = useState("");
  const [waiting, setWaiting] = useState(false);

  const [registerDate, setRegisterDate] = useState("dd/mm/yyyy");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [currentPhongBan, setCurrentPhongBan] = useState([]);
  const [dataPhongBan, setdataPhongBan] = useState([]);

  const [configOt, setConfigOT] = useState(0);
  const [dataOT, setDataOT] = useState([]);

  const [reason, setReason] = useState("");

  const [masterPK, setMasterPK] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [dataEmployee, setDataEmployee] = useState([]);
  const [dataEmployeeIns, setDataEmployeeIns] = useState([]);

  const [approveInfo, setApproveInfo] = useState([]);

  const [checkedAll, setCheckedAll] = useState("N");
  const [modalVisibleEmp, setModalVisibleEmp] = useState(false);
  const [modalVisibleNPD, setModalVisibleNPD] = useState(false);
  const [dataSelectedApprove, setDataSelectedApprove] = useState([]);
  const [dataInsertApprove, setDataInsertApprove] = useState([]);
  const [currentSelectedLevel, setCurrentSelectedLevel] = useState({
    arr: [],
    name: "Chọn vai trò phê duyệt",
  });
  const [currentSelectedPerson, setCurrentSelectedPerson] = useState({
    approve_name: "Chọn người phê duyệt",
  });
  //handle when approve level changed
  const onChangeSelectedLevel = (value) => {
    setCurrentSelectedLevel(value);
  };
  //handle when approve person change
  const onChangeSelectedPerson = (value) => {
    setCurrentSelectedPerson(value);
  };
  const onUpdateApprove = () => {
    console.log(dataSelectedApprove);
    setDataInsertApprove(dataSelectedApprove);
  };
  const hanleApproveInfo = (dataApprover) => {
    console.log(dataApprover);
    let arrApproveType = [];
    let arrApproveInfo = [];
    let arrApproveDefault = [];
    dataApprover.map((x) => {
      if (arrApproveType.indexOf(x.level_name) === -1) {
        arrApproveType.push(x.level_name);
        arrApproveDefault.push(x);
      }
    });
    arrApproveType.map((x) => {
      const tempArr = dataApprover.filter((y) => {
        return y.level_name === x;
      });
      let default_yn = null;
      let required_yn = false;
      tempArr.map((z) => {
        if (z.required_yn === "Y") {
          required_yn = true;
        }
        if (default_yn === null && z.default_yn === "Y") {
          default_yn = z;
        }
      });
      if (!required_yn && default_yn !== null) {
        arrApproveDefault = arrApproveDefault.filter(
          (item) => item.approve_role_type !== default_yn.approve_role_type
        );
        arrApproveDefault.push(default_yn);
      }

      if (tempArr[0].required_yn === "Y") {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      } else {
        arrApproveInfo.push({
          name: x,
          arr: tempArr,
        });
      }
      default_yn = null;
      required_yn = false;
      return;
    });
    setApproveInfo(arrApproveInfo);
  };

  const onSelectApprover = () => {
    let dataSelectApprove;
    const approve_role_type = currentSelectedPerson.approve_role_type;
    const approve_role_nm = currentSelectedLevel.name;
    const approve_by_pk = currentSelectedPerson.thr_emp_pk;
    const approve_by_name = currentSelectedPerson.approve_name;
    const full_nm = currentSelectedPerson.full_nm;
    const approve_level = currentSelectedPerson.approve_level;
    dataSelectApprove = dataSelectedApprove;
    console.log("dataSelectApprove ", dataSelectApprove);
    if (approve_role_type == undefined || approve_by_pk == undefined) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn vai trò và người phê duyệt!",
        [
          {
            text: "Thoát",
            onPress: () => {},
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    } else {
      dataSelectApprove = dataSelectApprove.filter(
        (item) => item.level != approve_level
      );
      setDataSelectedApprove(dataSelectApprove);
      dataSelectApprove.push({
        role_type: approve_role_type,
        approve_pk: approve_by_pk,
        role_nm: approve_role_nm,
        approve_nm: approve_by_name,
        level: approve_level,
        code: approve_by_pk,
        code_nm: approve_role_nm + " - " + full_nm,
      });
      setDataSelectedApprove(dataSelectApprove);
    }
  };
  const onRemoveApprover = (approve_level) => {
    let dataSelectApprove;
    dataSelectApprove = dataSelectedApprove;
    dataSelectApprove = dataSelectApprove.filter(
      (item) => item.level != approve_level
    );
    setDataSelectedApprove(dataSelectApprove);
  };
  const showPopupSelectApprove = () => {
    setIsShow(false);
    if (flagEdit.edit_yn == "Y") {
      if (dataInsertApprove.length == 0) {
        setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
        setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
        setDataSelectedApprove(dataInsertApprove);
      } else {
        setCurrentSelectedLevel({ arr: [], name: "Chọn vai trò phê duyệt" });
        setCurrentSelectedPerson({ approve_name: "Chọn người phê duyệt" });
        setDataSelectedApprove(dataInsertApprove);
      }
      setModalVisibleNPD(true);
    }
  };
  const showPopupSelectEmp = () => {
    setIsShow(false);
    setModalVisibleEmp(true);
  };
  const SelectLevelApprove = ({
    onChangeSelectedPerson,
    currentSelectedLevel,
    onChangeSelectedLevel,
    approveInfo,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text
          color={Color.mainColor}
          flexWrap={"wrap"}
          paddingLeft={5}
          paddingRight={5}
        >
          Vai trò phê duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            padding: 10,
            marginTop: 5,
            borderBottomColor: Color.gray,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedLevel.name === "Chọn vai trò phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedLevel.name}
              </Text>
            </View>
            <Icon name={"chevron-down"} color={Color.mainColor} size={24} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              {approveInfo.map((item, index) => {
                if (item.name === currentSelectedLevel.name) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedLevel(item);
                      onChangeSelectedPerson({
                        approve_name: "Chọn người phê duyệt",
                      });
                    }}
                    key={index.toString()}
                    style={{
                      padding: 10,
                      backgroundColor: "white",
                      marginBottom: 1,
                      borderRadius: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };
  const SelectApprovePerson = ({
    currentSelectedPerson,
    onChangeSelectedPerson,
    currentSelectedLevel,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text
          color={Color.mainColor}
          flexWrap={"wrap"}
          paddingLeft={5}
          paddingRight={5}
        >
          Người phê duyệt <Text style={{ color: "red" }}>*</Text>
        </Text>
        <View
          style={{
            backgroundColor: Color.gray,
            padding: 10,
            marginTop: 5,
            borderBottomColor: Color.inputBackgroundColor,
            borderBottomWidth: 1,
            borderRadius: 6,
          }}
        >
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedPerson.approve_name ===
                    "Chọn người phê duyệt"
                      ? "#B2B2B2"
                      : null,
                }}
              >
                {currentSelectedPerson.approve_name}
              </Text>
            </View>
            <Icon name={"chevron-down"} color={Color.mainColor} size={24} />
          </Button>
          {isShow && (
            <View
              style={{
                marginTop: 10,
              }}
            >
              <ScrollView style={{ maxHeight: 150 }}>
                {currentSelectedLevel.arr.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedPerson(item);
                      }}
                      key={index.toString()}
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 1,
                        borderRadius: 6,
                      }}
                    >
                      <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
                        {item.approve_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    );
  };
  const modalNPD = (
    <TVSControlPopup
      title={"Chọn người phê duyệt"}
      isShow={modalVisibleNPD}
      minHeight={500}
      onHide={() => setModalVisibleNPD(false)}
      onAccept={() => onUpdateApprove()}
    >
      <Block>
        <SelectLevelApprove
          onChangeSelectedPerson={onChangeSelectedPerson}
          currentSelectedLevel={currentSelectedLevel}
          approveInfo={approveInfo}
          onChangeSelectedLevel={onChangeSelectedLevel}
        />
        <SelectApprovePerson
          currentSelectedLevel={currentSelectedLevel}
          currentSelectedPerson={currentSelectedPerson}
          onChangeSelectedPerson={onChangeSelectedPerson}
        />
      </Block>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <TVSButton
            onPress={onSelectApprover}
            type={"primary"}
            icon={"account-edit"}
            buttonStyle={"2"}
          >
            Chọn
          </TVSButton>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ maxHeight: 190, marginTop: 10 }}>
          {dataSelectedApprove.map((item) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  paddingVertical: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  backgroundColor: "white",
                  marginBottom: 5,
                  borderRadius: 6,
                }}
              >
                <View
                  style={{ flex: 1 }}
                  flexDirection={"row"}
                  backgroundColor={Color.gray}
                  padding={0}
                  paddingRight={0}
                  paddingLeft={0}
                  borderBottomColor={Color.gray}
                  borderBottomWidth={1}
                  borderRadius={6}
                >
                  <View
                    style={{ flex: 1 }}
                    flexDirection={"column"}
                    backgroundColor={Color.gray}
                    padding={10}
                    paddingRight={0}
                    paddingLeft={5}
                    borderBottomColor={Color.gray}
                    borderBottomWidth={1}
                    borderRadius={6}
                  >
                    <View>
                      <Text
                        color={Color.mainColor}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.role_nm}
                      </Text>
                    </View>
                    <View>
                      <Text flexWrap={"wrap"} paddingLeft={5} paddingRight={5}>
                        {item.approve_nm}
                      </Text>
                    </View>
                  </View>
                  <View style={{ paddingRight: 5, justifyContent: "center" }}>
                    <TVSButton
                      type={"danger"}
                      children={"x"}
                      onPress={() => onRemoveApprover(item.level)}
                      buttonStyle={"2"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </TVSControlPopup>
  );
  const [modalVisiblePb, setModalVisiblePb] = useState(false);
  const getStatePb = (result) => {
    console.log("result Pb ", result);
    setCurrentPhongBan(result);
    setModalVisiblePb(false);
    getDataApprove(result.code);
  };
  const modalPb = (
    <TVSControlPopup
      title={"Chọn phòng ban"}
      isShow={modalVisiblePb}
      onHide={() => setModalVisiblePb(false)}
    >
      <FlatList
        data={dataPhongBan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePb(item);
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
    </TVSControlPopup>
  );
  const OnDelete = (pk) => {
    let newLst = [...dataEmployeeIns];
    newLst = newLst.map((obj) => {
      if (obj.pk === pk) {
        if (obj.d_pk != null) {
          return { ...obj, status: 3 };
        } else {
          return { ...obj, status: 4 };
        }
      } else {
        return obj;
      }
    });
    setDataEmployeeIns(newLst);
  };
  //1:ok
  //2:warning
  //3:delete
  const OnUpdateLstEmployee = () => {
    if (currentSelectedOT.code == "0") {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn giới hạn tăng ca",
        [
          {
            text: "Thoát",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      setModalVisibleEmp(true);
    } else {
      let newLst = [...dataEmployee.filter((x) => x.checked == "Y")];
      newLst = newLst.map((obj) => {
        let start_time =
          currentSelectedStartOT.code == "0"
            ? obj.start_time
            : currentSelectedStartOT.code_nm;

        const startShiftTime = moment(
          obj.start_dt + " " + start_time,
          "YYYYMMDD hh:mm"
        );
        let endShiftTime = "";

        endShiftTime = moment(
          obj.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );

        if (obj.end_dt > obj.start_dt) {
          console.log(1);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else if (
          obj.end_dt == obj.start_dt &&
          currentSelectedOT.code_nm >= start_time
        ) {
          console.log(2);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else {
          console.log(3);
          endShiftTime = moment(
            obj.end_dt_2 + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        }

        const duration = moment.duration(endShiftTime.diff(startShiftTime));

        console.log("startShiftTime ", startShiftTime);
        console.log("endShiftTime ", endShiftTime);
        console.log(duration.asHours());
        let status = 1;
        console.log("otStandard ", otStandard);
        if (duration.asHours() > otStandard) {
          console.log(">");
          status = 2;
        }
        return {
          ...obj,
          start_ot_temp: obj.start_time,
          time_code: currentSelectedOT.code,
          time: start_time,
          hol_type: obj.hol_type,
          end_time: currentSelectedOT.code_nm,
          ot: duration.asHours(),
          reason: reason,
          status: status, //ok
        };
      });
      let oldLst = [...dataEmployeeIns];
      newLst.forEach(function (itemIns) {
        oldLst = oldLst.filter((item) => item.pk != itemIns.pk);
        setDataEmployeeIns(oldLst);
        oldLst.push({
          ...itemIns,
        });
      });
      setDataEmployeeIns(oldLst);
      setModalVisibleEmp(false);
    }
  };
  const [isShow, setIsShow] = useState(false);
  const [isShowStartOT, setIsShowStartOT] = useState(false);

  const [currentSelectedOT, setCurrentSelectedOT] = useState({
    code: 0,
    code_nm: "Chọn giới hạn OT",
  });
  const [currentSelectedStartOT, setCurrentSelectedStartOT] = useState({
    code: 0,
    code_nm: "Mặc định",
  });
  const onChangeSelectedOT = (value) => {
    setCurrentSelectedOT(value);
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.checked == "Y") {
        let start_time =
          currentSelectedStartOT.code == "0"
            ? obj.start_time
            : currentSelectedStartOT.code_nm;

        const startShiftTime = moment(
          obj.start_dt + " " + start_time,
          "YYYYMMDD hh:mm"
        );
        let endShiftTime = "";

        endShiftTime = moment(
          obj.end_dt + " " + value.code_nm,
          "YYYYMMDD hh:mm"
        );

        if (obj.end_dt > obj.start_dt) {
          console.log(1);
          endShiftTime = moment(
            obj.end_dt + " " + value.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else if (obj.end_dt == obj.start_dt && value.code_nm >= start_time) {
          console.log(2);
          endShiftTime = moment(
            obj.end_dt + " " + value.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else {
          console.log(3);
          endShiftTime = moment(
            obj.end_dt_2 + " " + value.code_nm,
            "YYYYMMDD hh:mm"
          );
        }
        const duration = moment.duration(endShiftTime.diff(startShiftTime));
        console.log("startShiftTime ", startShiftTime);
        console.log("endShiftTime ", endShiftTime);
        console.log(duration.asHours());
        if (duration.asHours() > configOt) {
          return { ...obj, meal_yn: "Y" };
        } else {
          return obj;
        }
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };
  const onChangeSelectedStartOT = (value) => {
    setCurrentSelectedStartOT(value);
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.checked == "Y") {
        let start_time = value.code == "0" ? obj.start_time : value.code_nm;

        const startShiftTime = moment(
          obj.start_dt + " " + start_time,
          "YYYYMMDD hh:mm"
        );
        let endShiftTime = "";

        endShiftTime = moment(
          obj.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );

        if (obj.end_dt > obj.start_dt) {
          console.log(1);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else if (
          obj.end_dt == obj.start_dt &&
          currentSelectedOT.code_nm >= start_time
        ) {
          console.log(2);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else {
          console.log(3);
          endShiftTime = moment(
            obj.end_dt_2 + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        }
        const duration = moment.duration(endShiftTime.diff(startShiftTime));
        console.log("startShiftTime ", startShiftTime);
        console.log("endShiftTime ", endShiftTime);
        console.log(duration.asHours());
        if (duration.asHours() > configOt) {
          return { ...obj, meal_yn: "Y" };
        } else {
          return obj;
        }
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };
  const modalEmployee = (
    <TVSControlPopup
      title={"Chọn nhân viên"}
      isShow={modalVisibleEmp}
      minHeight={500}
      onHide={() => setModalVisibleEmp(false)}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => setModalVisibleEmp(false)}
          >
            Đóng lại
          </TVSButton>
          <TVSButton
            // type={'danger'}
            buttonStyle={"3"}
            icon={"check"}
            onPress={() => OnUpdateLstEmployee()}
          >
            Xác nhận
          </TVSButton>
        </View>
      }
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            zIndex: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Bắt đầu OT</Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginHorizontal: 5,
                }}
              >
                <Button
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  nextScreen={() => setIsShowStartOT(!isShowStartOT)}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text>{currentSelectedStartOT.code_nm}</Text>
                  </View>
                  <Icon
                    name={"chevron-down"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Button>
                {isShowStartOT && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <ScrollView style={{ maxHeight: 150 }}>
                      {dataOT.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setIsShowStartOT(false);
                              onChangeSelectedStartOT(item);
                            }}
                            key={index.toString()}
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              backgroundColor: "white",
                              marginBottom: 5,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              flex={1}
                              flexWrap={"wrap"}
                              paddingLeft={5}
                              paddingRight={5}
                            >
                              {item.code_nm}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Giới hạn OT</Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  backgroundColor: Color.gray,
                  borderRadius: 8,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginHorizontal: 5,
                }}
              >
                <Button
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  nextScreen={() => setIsShow(!isShow)}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          currentSelectedOT.code_nm === "Chọn giới hạn OT"
                            ? "#B2B2B2"
                            : null,
                      }}
                    >
                      {currentSelectedOT.code_nm}
                    </Text>
                  </View>
                  <Icon
                    name={"chevron-down"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Button>
                {isShow && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <ScrollView style={{ maxHeight: 150 }}>
                      {dataOT
                        .filter((item) => item.code_nm != "Mặc định")
                        .map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setIsShow(false);
                                onChangeSelectedOT(item);
                              }}
                              key={index.toString()}
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                                backgroundColor: "white",
                                marginBottom: 5,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                flex={1}
                                flexWrap={"wrap"}
                                paddingLeft={5}
                                paddingRight={5}
                              >
                                {item.code_nm}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            zIndex: 9,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Lý do tăng ca</Text>
            </View>
            <View style={{}}>
              <View
                padding={5}
                height={50}
                style={{ justifyContent: "center" }}
              >
                <TextInput
                  value={reason}
                  onChangeText={(value) => setReason(value)}
                  placeholder={""}
                  style={{
                    borderRadius: 5,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingHorizontal: 5,
                    backgroundColor: Color.gray,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                    width: 40,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      OnCheckedAll(checkedAll == "Y" ? "N" : "Y");
                    }}
                  >
                    <View
                      style={
                        checkedAll == "Y"
                          ? styles.CheckBoxSquareY
                          : styles.CheckBoxSquareN
                      }
                    >
                      {checkedAll == "Y" ? (
                        <Icon name={"check"} color={Color.mainColor} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    width: 70,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 2,
                    paddingHorizontal: 5,
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Cơm TC</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Mã NV</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 240,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Họ tên</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Giờ BĐ OT</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Kiểu ngày</Text>
                </View>
              </View>
              <ScrollView>
                {waiting ? (
                  <ActivityIndicator color="gray" />
                ) : (
                  dataEmployee.map((item) => (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 5,
                        paddingBottom: 5,
                        borderBottomColor: "#BDBDBD",
                        borderBottomWidth: 0.2,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 5,
                          justifyContent: "center",
                          width: 40,
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            OnChecked(item.pk, item.checked == "Y" ? "N" : "Y");
                          }}
                        >
                          <View
                            style={
                              item.checked == "Y"
                                ? styles.CheckBoxSquareY
                                : styles.CheckBoxSquareN
                            }
                          >
                            {item.checked == "Y" ? (
                              <Icon name={"check"} color={Color.mainColor} />
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: 5,
                          justifyContent: "center",
                          width: 70,
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            OnCheckedMeal(
                              item.pk,
                              item.meal_yn == "Y" ? "N" : "Y"
                            );
                          }}
                        >
                          <View
                            style={
                              item.meal_yn == "Y"
                                ? styles.CheckBoxSquareY
                                : styles.CheckBoxSquareN
                            }
                          >
                            {item.meal_yn == "Y" ? (
                              <Icon name={"check"} color={Color.mainColor} />
                            ) : null}
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 100,
                          }}
                        >
                          <Text>{item.emp_id}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            width: 240,
                          }}
                        >
                          <Text>{item.full_nm}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                          }}
                        >
                          <Text>{item.start_time}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                          }}
                        >
                          <Text>{item.hol_type}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </TVSControlPopup>
  );
  useEffect(() => {
    console.log("route ", route.params);
    setMasterPK(route.params.masterPK);
    setIsEdit(route.params.isEdit);
    setRegisterDate("dd/mm/yyyy");
    setCurrentPhongBan({ code: 0, code_nm: "Chọn phòng ban" });
    setCurrentSelectedOT({ code: 0, code_nm: "Chọn giới hạn OT" });
    setCurrentSelectedStartOT({ code: 0, code_nm: "Mặc định" });
    getData();
  }, []);

  useEffect(() => {
    console.log("edit");
  }, []);
  const getData = () => {
    console.log("getdata");
    console.log("userPk ", APP_VERSION);
    console.log("crt ", crt_by);
    sysFetch(
      API,
      {
        pro: "SELHRRE011006",
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: thr_emp_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_time_ot",
          p2_sys: "lst_org",
          p3_sys: "edit_yn",
          p4_sys: "limited",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setdataPhongBan(rs.data.lst_org);
            setDataOT(rs.data.lst_time_ot);
            setFlagEdit(rs.data.edit_yn[0]);
            setLimitedReg(rs.data.limited);
            getDataRegInfo();
            getDataConfigOT();
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const getDataRegInfo = () => {
    console.log("getDataRegInfo ", route.params.masterPK);
    sysFetch(
      API,
      {
        pro: "SELHRRE011005",
        in_par: {
          p1_varchar2: route.params.masterPK,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "master_info",
          p2_sys: "approve_info",
          p3_sys: "detail_info",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs.data.master_info);
        console.log(rs.data.detail_info);

        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.master_info.length > 0) {
              setRegisterDate(rs.data.master_info[0].decis_dt);
              setCurrentPhongBan({
                code: rs.data.master_info[0].code_pb,
                code_nm: rs.data.master_info[0].nm_pb,
              });
              setDecisNo(rs.data.master_info[0].decis_no);
              setDecisContent(rs.data.master_info[0].decis_content);

              getDataApprove(rs.data.master_info[0].code_pb);
            }
            if (rs.data.approve_info.length > 0) {
              console.log(rs.data.approve_info);
              let dataSelectApprove = [];
              rs.data.approve_info.forEach(function (item) {
                dataSelectApprove.push({
                  role_type: item.approve_role_type,
                  approve_pk: item.thr_emp_pk,
                  role_nm: item.level_name,
                  approve_nm: item.approve_name,
                  level: item.approve_level,
                  code: item.thr_emp_pk,
                  code_nm: item.level_name + " - " + item.full_nm,
                });
              });
              setDataSelectedApprove(dataSelectApprove);
              setDataInsertApprove(dataSelectApprove);
            }
            if (rs.data.detail_info.length > 0) {
              setDataEmployeeIns(rs.data.detail_info);
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const getDataApprove = (tco_org_pk) => {
    console.log("getDataApprove ", tco_org_pk);
    sysFetch(
      API,
      {
        pro: "SELHRRE011001",
        in_par: {
          p1_varchar2: tco_org_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_approve",
          p2_sys: "approve_default",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            hanleApproveInfo(rs.data.lst_approve);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const getDataEmployee = (org_pk, decis_dt) => {
    console.log("getDataEmployee ", org_pk, "|", decis_dt);
    let flag_sel = "N";
    setWaiting(true);
    sysFetch(
      API,
      {
        pro: "SELHRRE011002",
        in_par: {
          p1_varchar2: org_pk,
          p2_varchar2: decis_dt,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
          p2_varchar2: "ot",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        setWaiting(false);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataEmployee(rs.data.data);
            console.log("rs ot: ", rs.data.ot);
            setOtStandard(rs.data.ot);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const getDataConfigOT = () => {
    sysFetch(
      API,
      {
        pro: "SELHRRE011007",
        in_par: {
          p1_varchar2: userPk,
          p2_varchar2: thr_emp_pk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_ot",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        setWaiting(false);
        if (rs == "Token Expired") {
          refreshNewToken("getDataApprove", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            console.log(rs.data.lst_ot);
            if (rs.data.lst_ot.length > 0) {
              setConfigOT(rs.data.lst_ot[0].code);
            } else {
              setConfigOT(0);
            }
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };
  const refreshNewToken = (obj, p1, p2) => {
    axios
      .post(API + "User/RefreshToken/", {
        token: tokenLogin,
        userPk: userPk,
        refreshToken: refreshToken,
      })
      .then((response) => {
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.token,
            key: "tokenLogin",
          })
        );
        dispatch(
          updateUserAction({
            index: 0,
            value: response.data.refreshToken,
            key: "refreshToken",
          })
        );
        tokenLogin = response.data.token;
        refreshToken = response.data.refreshToken;

        if (obj == "getData") {
          getData();
        }
      })
      .catch((error) => {
        if (error == "AxiosError: Request failed with status code 400") {
          Alert.alert(
            "Thông báo",
            "Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống",
            [
              {
                text: "Đóng",
                onPress: () => {
                  RNRestart.Restart();
                },
              },
            ],
            { cancelable: true }
          );
        }
        console.log(error);
      });
  };
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePickerDate = () => {
    setDatePickerVisible(false);
  };
  const handleConfirmDate = (val) => {
    hideDatePickerDate();
    setRegisterDate(moment(val).format("DD/MM/YYYY"));
  };
  const OnChecked = (itemPk, status) => {
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
        let start_time =
          currentSelectedStartOT.code == "0"
            ? obj.start_time
            : currentSelectedStartOT.code_nm;

        const startShiftTime = moment(
          obj.start_dt + " " + start_time,
          "YYYYMMDD hh:mm"
        );
        let endShiftTime = "";

        endShiftTime = moment(
          obj.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );

        if (obj.end_dt > obj.start_dt) {
          console.log(1);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else if (
          obj.end_dt == obj.start_dt &&
          currentSelectedOT.code_nm >= start_time
        ) {
          console.log(2);
          endShiftTime = moment(
            obj.end_dt + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        } else {
          console.log(3);
          endShiftTime = moment(
            obj.end_dt_2 + " " + currentSelectedOT.code_nm,
            "YYYYMMDD hh:mm"
          );
        }
        const duration = moment.duration(endShiftTime.diff(startShiftTime));
        console.log("startShiftTime ", startShiftTime);
        console.log("endShiftTime ", endShiftTime);
        console.log(duration.asHours());

        if (status == "N") {
          return { ...obj, checked: status, meal_yn: status };
        } else {
          if (duration.asHours() > configOt) {
            return { ...obj, checked: status, meal_yn: status };
          } else {
            return { ...obj, checked: status };
          }
        }
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };
  const OnCheckedAll = (status) => {
    setCheckedAll(status);
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      let start_time =
        currentSelectedStartOT.code == "0"
          ? obj.start_time
          : currentSelectedStartOT.code_nm;

      const startShiftTime = moment(
        obj.start_dt + " " + start_time,
        "YYYYMMDD hh:mm"
      );
      let endShiftTime = "";

      endShiftTime = moment(
        obj.end_dt + " " + currentSelectedOT.code_nm,
        "YYYYMMDD hh:mm"
      );

      if (obj.end_dt > obj.start_dt) {
        console.log(1);
        endShiftTime = moment(
          obj.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      } else if (
        obj.end_dt == obj.start_dt &&
        currentSelectedOT.code_nm > start_time
      ) {
        console.log(2);
        endShiftTime = moment(
          obj.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      } else {
        console.log(3);
        endShiftTime = moment(
          obj.end_dt_2 + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      }
      const duration = moment.duration(endShiftTime.diff(startShiftTime));
      console.log("startShiftTime ", startShiftTime);
      console.log("endShiftTime ", endShiftTime);
      console.log(duration.asHours());

      if (status == "N") {
        return { ...obj, checked: status, meal_yn: status };
      } else {
        if (duration.asHours() > configOt) {
          return { ...obj, checked: status, meal_yn: status };
        } else {
          return { ...obj, checked: status };
        }
      }
    });
    setDataEmployee(newLst);
  };
  const OnCheckedMeal = (itemPk, status) => {
    let newLst = [...dataEmployee];
    newLst = newLst.map((obj) => {
      if (obj.pk === itemPk) {
        {
          return { ...obj, meal_yn: status };
        }
      } else {
        return obj;
      }
    });
    setDataEmployee(newLst);
  };
  const convertDateYYYYMMDD = (date, character) => {
    let newDt = date.split(character);
    return newDt[2] + "" + newDt[1] + "" + newDt[0];
  };
  const OnSubmit = () => {
    console.log({
      p1_varchar2: "UPDATE",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: masterPK + "|",
      p4_varchar2: "2|",
      p5_varchar2: 1,
      p6_varchar2: APP_VERSION,
      p7_varchar2: crt_by,
    });
    if (decisContent == "") {
      dialogNoti("Vui lòng nhập lý do tăng ca chính");
    } else {
      Alert.alert(
        "Thông báo",
        "Bạn có muốn trình ký?",
        [
          {
            text: "Hủy bỏ",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Xác nhận",
            onPress: () => {
              sysFetch(
                API,
                {
                  pro: "UPDHRRE011003",
                  in_par: {
                    p1_varchar2: "UPDATE",
                    p2_varchar2: thr_emp_pk,
                    p3_varchar2: masterPK + "|",
                    p4_varchar2: "2|",
                    p5_varchar2: 1,
                    p6_varchar2: APP_VERSION,
                    p7_varchar2: crt_by,
                  },
                  out_par: {
                    p1_varchar2: "result",
                    p2_sys: "noti",
                  },
                },
                tokenLogin
              )
                .then((rs) => {
                  console.log("rs save ", rs);
                  if (rs == "Token Expired") {
                    // refreshNewToken('OnSave');
                  }
                  if (rs != "Token Expired") {
                    if (rs.data.result == "1") {
                      Alert.alert(
                        "Thông báo",
                        "Trình ký thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      RequestSendNotificationV1(rs.data.noti, API, tokenLogin);
                      // getData();
                    } else {
                      Alert.alert(
                        "Thông báo",
                        "Trình ký không thành công",
                        [
                          {
                            text: "Thoát",
                            style: "cancel",
                          },
                        ],
                        { cancelable: false }
                      );
                      // getData();
                    }
                  }
                })
                .catch((error) => {
                  console.log("error save");
                  console.log(error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  const OnSave = () => {
    let dataIns = [...dataEmployeeIns];
    let lst_emp_pk = "";
    let lst_full_nm = "";
    let lst_status = "";
    let lst_start_ot = "";
    let lst_end_ot = "";
    let lst_hol_type = "";
    let lst_ot = "";
    let lst_start_dt = "";
    let lst_end_dt = "";
    let lst_end_dt2 = "";
    let lst_reason = "";
    let lst_approve_pk = "";
    let lst_meal_yn = "";
    if (dataInsertApprove.length == 0) {
      dialogNoti("Vui lòng chọn người phê duyệt");
    } else {
      if (dataIns.length > 0 || masterPK != "") {
        let flag = "N";
        dataIns.forEach(function (item) {
          if (item.status == 1 || item.status == 2) {
            flag = "Y";
          }
        });
        if (flag == "N") {
          dialogNoti("Vui lòng chọn nhân viên");
        } else {
          let curdate = new Date().getDate(); //Current Date
          let curmonth = new Date().getMonth() + 1; //Current Month
          let curyear = new Date().getFullYear(); //Current Year
          let curhours = new Date().getHours(); //Current Hours
          let curmin = new Date().getMinutes(); //Current Minutes

          let date =
            curdate.toString().length < 2
              ? "0" + curdate.toString()
              : curdate.toString();
          let month =
            curmonth.toString().length < 2
              ? "0" + curmonth.toString()
              : curmonth.toString();
          let year = curyear.toString();
          let hours =
            curhours.toString().length < 2
              ? "0" + curhours.toString()
              : curhours.toString();
          let min =
            curmin.toString().length < 2
              ? "0" + curmin.toString()
              : curmin.toString();
          let strDt = year + "" + month + "" + date + "" + hours + "" + min;
          let strNonLimit = year + "" + month + "" + date + "2359";
          let limitedRegDt =
            limitedReg.length > 0 ? limitedReg[0].reg_times : strNonLimit;
          // console.log('strDt ', strDt);
          // console.log('limiteDt ', limitedRegDt);
          if (strDt > limitedRegDt) {
            console.log("false");
            setFlagEnabled("N");
            dialogNoti("Vượt quá giờ giới hạn đăng ký: " + limitedReg[0].time);
          } else {
            setFlagEnabled("Y");
            console.log("true");
            dataIns.forEach(function (item) {
              lst_emp_pk += item.pk + "|";
              lst_status += item.status + "|";
              lst_ot += item.ot + "|";
              lst_reason +=
                item.reason == undefined
                  ? " |"
                  : item.reason == ""
                  ? " |"
                  : item.reason + "|";
              lst_full_nm += item.full_nm + "|";
              lst_start_ot += item.time + "|";
              lst_end_ot += item.end_time + "|";
              lst_hol_type += item.hol_type + "|";
              lst_start_dt += item.start_dt + "|";
              lst_end_dt += item.end_dt + "|";
              lst_end_dt2 += item.end_dt_2 + "|";
              lst_meal_yn += item.meal_yn + "|";
            });
            console.log("lst_reason ", lst_reason);
            dataInsertApprove.forEach(function (item) {
              lst_approve_pk += item.approve_pk + "|";
            });
            console.log({
              p1_varchar2: masterPK == "" ? "INSERT" : "UPDATE",
              p2_varchar2: thr_emp_pk,
              p3_varchar2: full_name,
              p4_varchar2: masterPK,
              p5_varchar2: decisContent,
              p6_varchar2: lst_emp_pk,
              p7_varchar2: lst_full_nm,
              p8_varchar2: currentPhongBan.code,
              p9_varchar2: convertDateYYYYMMDD(registerDate, "/"),
              p10_varchar2: lst_start_ot,
              p11_varchar2: lst_end_ot,
              p12_varchar2: lst_hol_type,
              p13_varchar2: lst_ot,
              p14_varchar2: lst_start_dt,
              p15_varchar2: lst_end_dt,
              p16_varchar2: lst_end_dt2,
              p17_varchar2: lst_reason,
              p18_varchar2: lst_status,
              p19_varchar2: dataIns.length,
              p20_varchar2: lst_approve_pk,
              p21_varchar2: dataInsertApprove.length,
              p22_varchar2: APP_VERSION,
              p23_varchar2: crt_by,
            });
            Alert.alert(
              "Thông báo",
              "Bạn có muốn sao lưu?",
              [
                {
                  text: "Hủy bỏ",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Xác nhận",
                  onPress: () => {
                    sysFetch(
                      API,
                      {
                        pro: "UPDHRRE011004",
                        in_par: {
                          p1_varchar2: masterPK == "" ? "INSERT" : "UPDATE",
                          p2_varchar2: thr_emp_pk,
                          p3_varchar2: full_name,
                          p4_varchar2: masterPK,
                          p5_varchar2: decisContent,
                          p6_varchar2: lst_emp_pk,
                          p7_varchar2: lst_full_nm,
                          p8_varchar2: currentPhongBan.code,
                          p9_varchar2: convertDateYYYYMMDD(registerDate, "/"),
                          p10_varchar2: lst_start_ot,
                          p11_varchar2: lst_end_ot,
                          p12_varchar2: lst_hol_type,
                          p13_varchar2: lst_ot,
                          p14_varchar2: lst_start_dt,
                          p15_varchar2: lst_end_dt,
                          p16_varchar2: lst_end_dt2,
                          p17_varchar2: lst_reason,
                          p18_varchar2: lst_status,
                          p19_varchar2: dataIns.length,
                          p20_varchar2: lst_approve_pk,
                          p21_varchar2: dataInsertApprove.length,
                          p22_varchar2: lst_meal_yn,
                          p23_varchar2: APP_VERSION,
                          p24_varchar2: crt_by,
                        },
                        out_par: {
                          p1_varchar2: "result",
                          p2_varchar2: "value_pk",
                          p3_varchar2: "decis_no",
                        },
                      },
                      tokenLogin
                    )
                      .then((rs) => {
                        console.log("rs save ", rs);
                        if (rs == "Token Expired") {
                          refreshNewToken("OnSave", "", "");
                        }
                        if (rs != "Token Expired") {
                          console.log(rs);
                          if (rs.results == "F") {
                            var newText = rs.errorData.split(":");
                            let errors = newText[1].trim().split("\n")[0];
                            dialogNoti(errors);
                          } else {
                            if (rs.data.result == "1") {
                              dialogNoti("Sao lưu thành công");
                              setMasterPK(rs.data.value_pk);
                              if (decisNo == "") {
                                setDecisNo(rs.data.decis_no);
                              }
                              sysFetch(
                                API,
                                {
                                  pro: "SELHRRE011004",
                                  in_par: {
                                    p1_varchar2: rs.data.value_pk,
                                    p3_varchar2: APP_VERSION,
                                    p4_varchar2: crt_by,
                                  },
                                  out_par: {
                                    p1_sys: "data",
                                  },
                                },
                                tokenLogin
                              )
                                .then((rs) => {
                                  console.log(rs);
                                  if (rs == "Token Expired") {
                                    refreshNewToken("getData", "", "");
                                  }
                                  if (rs != "Token Expired") {
                                    if (rs.results == "S") {
                                      setDataEmployeeIns(rs.data.data);
                                    }
                                  }
                                })
                                .catch((error) => {
                                  console.log("error getData");
                                  console.log(error);
                                });
                            }
                          }
                        }
                      })
                      .catch((error) => {
                        console.log("error save");
                        console.log(error);
                      });
                  },
                },
              ],
              { cancelable: false }
            );
          }
        }
      } else {
        dialogNoti("Vui lòng chọn nhân viên");
      }
    }
  };

  const OnReset = () => {
    console.log("reset");
    setReason("");
    setMasterPK("");
    setDecisContent("");
    setDecisNo("");
    setDataEmployeeIns([]);
  };
  const [modalVisibleEditEmp, setModalVisibleEditEmp] = useState(false);
  const [dataEditeEmp, setDataEditEmp] = useState([]);
  const OnEditEmp = () => {
    getDataEmployee(
      currentPhongBan.code,
      convertDateYYYYMMDD(registerDate, "/")
    );
    setCurrentSelectedOT({ code: 0, code_nm: "Chọn giới hạn OT" });
    setCurrentSelectedStartOT({ code: 0, code_nm: "Mặc định" });
    setReason(dataEditeEmp.reason);
    setModalVisibleEditEmp(true);
  };
  const OnCheckedMealEdit = (status) => {
    let editEmp = { ...dataEditeEmp };
    editEmp.meal_yn = status;
    setDataEditEmp(editEmp);
    console.log("dataEditeEmp ", dataEditeEmp);
  };
  const OnUpdateLstEmployeeEdit = () => {
    if (currentSelectedOT.code == "0") {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn giới hạn tăng ca",
        [
          {
            text: "Thoát",
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      // setModalVisibleEmp(true);
    } else {
      let newLst = dataEditeEmp;
      let start_time =
        currentSelectedStartOT.code == "0"
          ? dataEditeEmp.start_ot_temp
          : currentSelectedStartOT.code_nm;
      const startShiftTime = moment(
        dataEditeEmp.start_dt + " " + start_time,
        "YYYYMMDD hh:mm"
      );
      let endShiftTime = "";

      endShiftTime = moment(
        dataEditeEmp.end_dt + " " + currentSelectedOT.code_nm,
        "YYYYMMDD hh:mm"
      );
      if (dataEditeEmp.end_dt > dataEditeEmp.start_dt) {
        console.log(1);
        endShiftTime = moment(
          dataEditeEmp.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      } else if (
        dataEditeEmp.end_dt == dataEditeEmp.start_dt &&
        currentSelectedOT.code_nm > start_time
      ) {
        console.log(2);
        endShiftTime = moment(
          dataEditeEmp.end_dt + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      } else {
        console.log(3);
        endShiftTime = moment(
          dataEditeEmp.end_dt_2 + " " + currentSelectedOT.code_nm,
          "YYYYMMDD hh:mm"
        );
      }
      const duration = moment.duration(endShiftTime.diff(startShiftTime));
      let status = 1;
      console.log("otStandard ", otStandard);
      if (duration.asHours() > otStandard) {
        console.log(">");
        status = 2;
      }
      dataEditeEmp.time_code = currentSelectedOT.code;
      dataEditeEmp.start_time = start_time;
      dataEditeEmp.time = start_time;
      dataEditeEmp.end_time = currentSelectedOT.code_nm;
      dataEditeEmp.ot = duration.asHours();
      dataEditeEmp.reason = reason;
      dataEditeEmp.status = status;

      let oldLst = [...dataEmployeeIns];
      console.log("dataEditeEmp ", dataEditeEmp);
      oldLst = oldLst.filter((item) => item.pk != dataEditeEmp.pk);
      // setDataEmployeeIns(oldLst);
      oldLst.push({
        ...dataEditeEmp,
      });
      setDataEmployeeIns(oldLst);
      setModalVisibleEditEmp(false);
    }
  };
  const modalEditEmp = (
    <TVSControlPopup
      title={"CHỈNH SỬA"}
      minHeight={400}
      isShow={modalVisibleEditEmp}
      onHide={() => setModalVisibleEditEmp(false)}
      onAccept={() => OnUpdateLstEmployeeEdit()}
      bottom={
        <View style={{ flexDirection: "row" }}>
          <TVSButton
            type={"danger"}
            buttonStyle={"3"}
            icon={"close"}
            onPress={() => setModalVisibleEditEmp(false)}
          >
            Đóng lại
          </TVSButton>
          <TVSButton
            buttonStyle={"3"}
            icon={"check"}
            onPress={() => OnUpdateLstEmployeeEdit()}
          >
            Xác nhận
          </TVSButton>
        </View>
      }
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            zIndex: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Bắt đầu OT</Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  backgroundColor: Color.gray,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginHorizontal: 5,
                }}
              >
                <Button
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  nextScreen={() => setIsShowStartOT(!isShowStartOT)}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text>{currentSelectedStartOT.code_nm}</Text>
                  </View>
                  <Icon
                    name={"chevron-down"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Button>
                {isShowStartOT && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <ScrollView style={{ maxHeight: 150 }}>
                      {dataOT.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setIsShowStartOT(false);
                              onChangeSelectedStartOT(item);
                            }}
                            key={index.toString()}
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                              backgroundColor: "white",
                              marginBottom: 5,
                              borderRadius: 6,
                            }}
                          >
                            <Text
                              flex={1}
                              flexWrap={"wrap"}
                              paddingLeft={5}
                              paddingRight={5}
                            >
                              {item.code_nm}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Giới hạn OT</Text>
            </View>
            <View style={{}}>
              <View
                style={{
                  backgroundColor: Color.gray,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  marginHorizontal: 5,
                }}
              >
                <Button
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  nextScreen={() => setIsShow(!isShow)}
                >
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          currentSelectedOT.code_nm === "Chọn giới hạn OT"
                            ? "#B2B2B2"
                            : null,
                      }}
                    >
                      {currentSelectedOT.code_nm}
                    </Text>
                  </View>
                  <Icon
                    name={"chevron-down"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Button>
                {isShow && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <ScrollView style={{ maxHeight: 150 }}>
                      {dataOT
                        .filter((item) => item.code_nm != "Mặc định")
                        .map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => {
                                setIsShow(false);
                                onChangeSelectedOT(item);
                              }}
                              key={index.toString()}
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                                backgroundColor: "white",
                                marginBottom: 5,
                                borderRadius: 6,
                              }}
                            >
                              <Text
                                flex={1}
                                flexWrap={"wrap"}
                                paddingLeft={5}
                                paddingRight={5}
                              >
                                {item.code_nm}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            zIndex: 9,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <Text>Lý do tăng ca</Text>
            </View>
            <View style={{}}>
              <View
                padding={5}
                height={50}
                style={{ justifyContent: "center" }}
              >
                <TextInput
                  value={reason}
                  onChangeText={(value) => setReason(value)}
                  placeholder={""}
                  style={{
                    borderRadius: 5,
                    paddingBottom: 10,
                    paddingTop: 10,
                    paddingHorizontal: 5,
                    backgroundColor: Color.gray,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 70,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    paddingVertical: 5,
                  }}
                >
                  <Text>Cơm TC</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 100,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    paddingVertical: 5,
                  }}
                >
                  <Text>Mã NV</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 150,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    paddingVertical: 5,
                  }}
                >
                  <Text>Họ tên</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Giờ BĐ OT</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Giờ KT OT</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>Kiểu ngày</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                  }}
                >
                  <Text>OT</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: 200,
                    justifyContent: "center",
                    borderWidth: 0.2,
                    borderColor: "#BDBDBD",
                    borderTopRightRadius: 8,
                  }}
                >
                  <Text>Lý do</Text>
                </View>
              </View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    // marginTop: 5,
                    paddingVertical: 2,
                    borderBottomColor: "#BDBDBD",
                    borderBottomWidth: 0.2,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 70,
                      paddingLeft: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        OnCheckedMealEdit(
                          dataEditeEmp.meal_yn == "Y" ? "N" : "Y"
                        );
                      }}
                    >
                      <View
                        style={
                          dataEditeEmp.meal_yn == "Y"
                            ? styles.CheckBoxSquareY
                            : styles.CheckBoxSquareN
                        }
                      >
                        {dataEditeEmp.meal_yn == "Y" ? (
                          <Icon name={"check"} color={Color.mainColor} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 100,
                      paddingLeft: 5,
                    }}
                  >
                    <Text>{dataEditeEmp.emp_id}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 150,
                      paddingLeft: 5,
                    }}
                  >
                    <Text>{dataEditeEmp.full_nm}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                    }}
                  >
                    <Text>{dataEditeEmp.time}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                    }}
                  >
                    <Text>{dataEditeEmp.end_time}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                    }}
                  >
                    <Text>{dataEditeEmp.hol_type}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                    }}
                  >
                    <Text>{dataEditeEmp.ot}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 200,
                      paddingLeft: 5,
                    }}
                  >
                    <Text>{dataEditeEmp.reason}</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </TVSControlPopup>
  );
  return (
    <Block style={{ flex: 1 }} backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        <Text>
          {isEdit ? "Chỉnh sửa thông tin đăng ký" : "Thông tin chi tiết"}
        </Text>
      </TVSHeader>
      <View style={{ flex: 1 }} backgroundColor={Color.gray}>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            marginHorizontal: 10,
            marginVertical: 5,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 5,
              marginTop: 10,
              flexDirection: "row",
              zIndex: 11,
            }}
          >
            <View style={{ flex: 2 }}>
              <View
                style={{
                  justifyContent: "flex-end",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Ngày</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => (isEdit ? showDatePicker() : null)}
                    style={{ flex: 1 }}
                  >
                    <View
                      radius={6}
                      backgroundColor={Color.gray}
                      justifyContent={"space-between"}
                      alignCenter
                      style={{
                        flexDirection: "row",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            registerDate == "dd/mm/yyyy"
                              ? "#B2B2B2"
                              : Color.mainColor,
                        }}
                      >
                        {registerDate}
                      </Text>
                      <IconDate />
                    </View>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    cancelTextIOS="Hủy bỏ"
                    confirmTextIOS="Xác nhận"
                    isVisible={datePickerVisible}
                    mode="date"
                    hideTitleContainerIOS={false}
                    date={
                      registerDate !== "dd/mm/yyyy"
                        ? new Date(moment(registerDate, "DD/MM/YYYY"))
                        : new Date()
                    }
                    locale="vi_VN"
                    onConfirm={handleConfirmDate}
                    onCancel={hideDatePickerDate}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Phòng ban</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (isEdit) {
                        masterPK == ""
                          ? setModalVisiblePb(!modalVisiblePb)
                          : null;
                      }
                      setIsShow(false);
                    }}
                    style={{ flex: 1 }}
                  >
                    <View
                      radius={6}
                      backgroundColor={Color.gray}
                      justifyContent={"space-between"}
                      alignCenter
                      style={{
                        flexDirection: "row",
                        borderRadius: 8,
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ justifyContent: "center", flex: 1 }}>
                        <Text
                          style={{
                            color:
                              currentPhongBan.code == 0
                                ? "#B2B2B2"
                                : Color.mainColor,
                          }}
                        >
                          {currentPhongBan.code_nm}
                        </Text>
                      </View>
                      <View>
                        <Icon
                          name={"chevron-down"}
                          color={Color.mainColor}
                          size={22}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              paddingHorizontal: 5,
              marginTop: 10,
              flexDirection: "row",
              zIndex: 9,
            }}
          >
            <View style={{ flex: 2 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Số phiếu</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TextInput
                    value={decisNo}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholder={""}
                    style={{
                      borderRadius: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingHorizontal: 5,
                      backgroundColor: Color.gray,
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 3 }}>
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                }}
              >
                <Text>Lý do tăng ca chính</Text>
              </View>
              <View style={{}}>
                <View
                  padding={5}
                  height={50}
                  style={{ justifyContent: "center" }}
                >
                  <TextInput
                    editable={isEdit}
                    value={decisContent}
                    onChangeText={(value) => setDecisContent(value)}
                    placeholder={""}
                    style={{
                      borderRadius: 5,
                      paddingBottom: 10,
                      paddingTop: 10,
                      paddingHorizontal: 5,
                      backgroundColor: Color.gray,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              zIndex: 8,
            }}
          >
            <View>
              <View
                border={1}
                paddingVertical={10}
                borderColor={Color.gray}
                radius={6}
                borderWidth={2}
                borderRadius={8}
                style={{ marginHorizontal: 5, marginTop: 20 }}
              >
                <View row style={styles.fieldsetTitle}>
                  <View
                    style={
                      {
                        // borderBottomColor: Color.mainColor,
                        // borderBottomWidth: 0.2,
                      }
                    }
                  >
                    <TouchableOpacity
                      onPress={() => {
                        // showPopupSelectApprove();
                      }}
                    >
                      <Text style={{}}>
                        Danh sách người phê duyệt{"  "}
                        {/* <Icon
                          name={'pencil-outline'}
                          color={Color.mainColor}
                          size={15}
                        /> */}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  <ScrollView style={{ maxHeight: 60 }}>
                    {dataInsertApprove.map((item) => (
                      <View style={{ marginHorizontal: 10, marginBottom: 5 }}>
                        <Text>{item.code_nm}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
          <View
            border={1}
            paddingVertical={10}
            borderColor={Color.gray}
            radius={6}
            borderWidth={2}
            borderRadius={8}
            style={{
              marginHorizontal: 5,
              marginTop: 15,
              flex: 1,
              marginBottom: 5,
            }}
          >
            <View row style={styles.fieldsetTitle}>
              <View
                style={{
                  borderBottomColor: Color.mainColor,
                  borderBottomWidth: 0.2,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (isEdit) {
                      if (
                        convertDateYYYYMMDD(registerDate, "/") == "yyyymmdd"
                      ) {
                        Alert.alert(
                          "Thông báo",
                          "Vui lòng chọn ngày",
                          [
                            {
                              text: "Thoát",
                              style: "cancel",
                            },
                          ],
                          { cancelable: false }
                        );
                      } else {
                        showPopupSelectEmp();
                        getDataEmployee(
                          currentPhongBan.code,
                          convertDateYYYYMMDD(registerDate, "/")
                        );
                      }
                    }
                  }}
                >
                  <Text style={{ color: Color.mainColor }}>
                    Danh sách nhân viên{"  "}
                    <Icon
                      name={"pencil-outline"}
                      color={Color.mainColor}
                      size={15}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1, marginHorizontal: 5 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  <View style={{ flexDirection: "row" }}>
                    {isEdit ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 50,
                          borderWidth: 0.2,
                          borderColor: "#BDBDBD",
                          paddingVertical: 5,
                          borderTopLeftRadius: 8,
                        }}
                      >
                        <Text>Xoá</Text>
                      </View>
                    ) : null}

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Mã NV</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 240,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        paddingVertical: 5,
                      }}
                    >
                      <Text>Họ tên</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Giờ BĐ OT</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 80,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Giờ KT OT</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 100,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>Kiểu ngày</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 50,
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                      }}
                    >
                      <Text>OT</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: 70,
                        justifyContent: "center",
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        // borderTopRightRadius: 8,
                      }}
                    >
                      <Text>Cơm TC</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: 200,
                        justifyContent: "center",
                        borderWidth: 0.2,
                        borderColor: "#BDBDBD",
                        borderTopRightRadius: 8,
                      }}
                    >
                      <Text>Lý do</Text>
                    </View>
                  </View>
                  <ScrollView>
                    {dataEmployeeIns.map((item) =>
                      item.status != "3" && item.status != "4" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            // marginTop: 5,
                            paddingVertical: 2,
                            borderBottomColor: "#BDBDBD",
                            borderBottomWidth: 0.2,
                          }}
                        >
                          {isEdit ? (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                width: 50,
                                justifyContent: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  OnDelete(item.pk);
                                }}
                              >
                                <View>
                                  <Icon
                                    name={"trash-can-outline"}
                                    color={"#F64E60"}
                                    size={25}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : null}

                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 100,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.emp_id}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: 240,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.full_nm}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.time}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.end_time}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                if (isEdit) {
                                  OnEditEmp();
                                  setDataEditEmp(item);
                                }
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 100,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.hol_type}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 50,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.ot}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 70,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.meal_yn}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              if (isEdit) {
                                OnEditEmp();
                                setDataEditEmp(item);
                              }
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              width: 200,
                              paddingLeft: 5,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  color: item.status == "2" ? "#F64E60" : null,
                                }}
                              >
                                {item.reason}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : null
                    )}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        {isEdit ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 20,
              flexDirection: "row",
              backgroundColor: "white",
              paddingVertical: 5,
              flexDirection: "row",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <TVSButton
                onPress={() => OnSave()}
                icon={"content-save"}
                buttonStyle={"3"}
                disabled={flagEnabled == "Y" ? false : true}
              >
                Sao lưu
              </TVSButton>
            </View>
            <View style={{ flex: 1 }}>
              <TVSButton
                onPress={() => OnSubmit()}
                icon={"check"}
                buttonStyle={"3"}
                type={"success"}
              >
                Trình ký
              </TVSButton>
            </View>
          </View>
        ) : null}

        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
            flexDirection: 'row',
            backgroundColor: 'white',
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              OnSave();
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: flagEnabled == 'Y' ? '#E7F2FE' : '#E5E7ED',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              flexDirection: 'row',
              flex: 1,
              marginRight: 2,
            }}>
            <View style={{paddingHorizontal: 5}}>
              <Icon
                name={'content-save'}
                color={flagEnabled == 'Y' ? '#5A94E7' : '#677583'}
                size={20}
              />
            </View>
            <View style={{paddingHorizontal: 5}}>
              <Text style={{color: flagEnabled == 'Y' ? '#5A94E7' : '#677583'}}>
                Sao lưu
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              OnSubmit();
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: '#E7F2FE',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{paddingHorizontal: 5}}>
              <Icon name={'content-save'} color={'#5A94E7'} size={20} />
            </View>
            <View style={{paddingHorizontal: 5}}>
              <Text style={{color: '#5A94E7'}}>Trình ký</Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
      {modalNPD}
      {modalEmployee}
      {modalPb}
      {modalEditEmp}
    </Block>
  );
};

export default EditRegOT;
