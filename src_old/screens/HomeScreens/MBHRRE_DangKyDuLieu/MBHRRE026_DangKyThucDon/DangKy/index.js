/**************** START: IMPORT ****************/
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../../components/Block";
import Button from "../../../../../components/Button";
import Load from "../../../../../components/Loading";
import Text from "../../../../../components/Text";
import TVSButton from "../../../../../components/Tvs/Button";
import ShowError from "../../../../../services/errors";
import { updateUserAction } from "../../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../config/Pro";
import Icon_calendar from "../../../../../icons/Datev";
import MonthPicker from "react-native-month-year-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Item from "./Item";

const DK = ({ onCallbackReload }) => {
  const { isLoading } = useSelector((state) => state.GlobalLoadingReducer);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    // style form
    container: {
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainerTime: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
      flexDirection: "row",
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
    },
    titleTextTime: {
      flex: 1,
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    titleText: {
      flexDirection: "row",
      paddingBottom: 5,
      paddingLeft: 5,
      alignItems: "center",
    },
    dropdownlistContainer: {
      paddingVertical: 5,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 6,
      flexDirection: "row",
      backgroundColor: Color.gray,
    },
    dropdownlistChild: {
      marginHorizontal: 20,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: Color.gray,
      borderWidth: 2,
      paddingVertical: 10,
      justifyContent: "center",
      flexDirection: "row",
      backgroundColor: Color.tabColor,
    },
    dropdownlistChildHasAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      height: 120,
      justifyContent: "center",
    },
    dropdownlistChildNoAttach: {
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 6,
      borderColor: "lightgray",
      borderWidth: 2,
      borderStyle: "dashed",
      height: 120,
      justifyContent: "center",
    },
    blockApproveInfo: {
      marginTop: 10,
    },
    approveIntoTitle: {
      position: "absolute",
      top: -20,
      backgroundColor: "white",
      left: 0,
    },

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
    tableTitle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      width: 170,
      borderWidth: 0.2,
      borderColor: "#BDBDBD",
      paddingVertical: 5,
      backgroundColor: Color.gray,
    }
  });

  const dispatch = useDispatch();
  const loginReducers = useSelector((state) => state.loginReducers);

  const API = useSelector((state) => state.SysConfigReducer.API_URL);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    tokenLogin = loginReducers.data.data.tokenLogin;
    company_pk = loginReducers.data.data.company_pk;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) { }

  //************ START: STATE ************
  const [load, setLoad] = useState(false);
  const [date, setDate] = useState(
    moment(new Date().setMonth(new Date().getMonth())).toDate()
  );
  const [show, setShow] = useState(false);
  const showPicker = useCallback((value) => setShow(value), []);
  const [waiting, setWaiting] = useState(false);
  const [masterPK, setMasterPK] = useState("");

  const [modalVisibleTuan, setModalVisibleTuan] = useState(false);
  const [dataTuan, setdataTuan] = useState([]);
  const [currentTuan, setCurrentTuan] = useState({});
  const [dataMenu, setDataMenu] = useState([]);
  const [selectDay, setSelectDay] = useState(2);
  //State cho bang chon thuc don
  const [dataSelect, setDataSelect] = useState([]);
  const [dataThu2Selected, setDataThu2Selected] = useState([]);
  const [dataThu3Selected, setDataThu3Selected] = useState([]);
  const [dataThu4Selected, setDataThu4Selected] = useState([]);
  const [dataThu5Selected, setDataThu5Selected] = useState([]);
  const [dataThu6Selected, setDataThu6Selected] = useState([]);
  const [dataThu7Selected, setDataThu7Selected] = useState([]);
  const [dataThu8Selected, setDataThu8Selected] = useState([]);
  const [modalVisibleThu, setModalVisibleThu] = useState(false);
  const [titleThu, setTitleThu] = useState("");
  const [numberThu, setNumberThu] = useState(2);
  const [dataThu, setDataThu] = useState([]);

  //****************************************** START: HANDLE FUNCTIONS ******************************************
  const validate = () => {
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
  };

  const refreshNewToken = (obj) => {
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

  useEffect(() => {
    setCurrentTuan({ code: 0, code_nm: "Chọn tuần" });
    getData(date);
  }, [date]);

  useEffect(() => {
    getDataMenu(currentTuan, selectDay);
    getDataSelected(currentTuan)
  }, [currentTuan]);

  //---------Lay danh sach tuan
  const getData = (date) => {
    const formattedDate = moment(date).format("YYYYMM");
    const pro = "SELHRRE026000";
    const in_par = {
      p1_varchar2: formattedDate,
      p2_varchar2: crt_by,
      p3_varchar2: APP_VERSION,
    };
    console.log(pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_week",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        //console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setdataTuan(rs.data.lst_week);
            //getStateTuan(rs.data.lst_week[0]);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  //---------Lay ds mon an da chon
  const getDataSelected = (data) => {
    const pro = "SELHRRE026002";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: data.code,
      p3_varchar2: crt_by,
      p4_varchar2: APP_VERSION,
    };

    //console.log('Prooooooooooooooooooo: ', pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_menu_selected",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        //console.log('rs: ', rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            //Lay danh sach menu da chon trong tuan
            //console.log('rs.data.lst_menu_selected: ', rs.data.lst_menu_selected);
            //Lay data theo thu
            getDataSelectedByThu(rs.data.lst_menu_selected);
          }
        }
      })
      .catch((error) => {
        console.log("error getData");
        console.log(error);
      });
  };

  //Hien thi mon an da chon theo tung thu trong tuan
  const getDataSelectedByThu = (data) => {
    //console.log('dataByThu----: ', data);
    let listT2 = [];
    let listT3 = [];
    let listT4 = [];
    let listT5 = [];
    let listT6 = [];
    let listT7 = [];
    let listT8 = [];

    //console.log('data[0]: ', data[0]);

    for (let i = 0; i < data.length; i++) {
      const t2 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_2,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk2,
        week_code: data[i].week_code,
      }
      const t3 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_3,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk3,
        week_code: data[i].week_code,
      }
      const t4 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_4,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk4,
        week_code: data[i].week_code,
      }
      const t5 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_5,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk5,
        week_code: data[i].week_code,
      }
      const t6 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_6,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk6,
        week_code: data[i].week_code,
      }
      const t7 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_7,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk7,
        week_code: data[i].week_code,
      }
      const t8 = {
        shift_name: data[i].shift_name,
        dish: data[i].day_8,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        shift_type: data[i].shift_type,
        emp_pk: data[i].emp_pk,
        item_pk: data[i].item_pk8,
        week_code: data[i].week_code,
      }

      listT2.push(t2);
      listT3.push(t3);
      listT4.push(t4);
      listT5.push(t5);
      listT6.push(t6);
      listT7.push(t7);
      listT8.push(t8);
    }

    //console.log('listT2222222: ', listT2);

    setDataThu2Selected(listT2);
    setDataThu3Selected(listT3);
    setDataThu4Selected(listT4);
    setDataThu5Selected(listT5);
    setDataThu6Selected(listT6);
    setDataThu7Selected(listT7);
    setDataThu8Selected(listT8);
  }

  //Set tuan duoc tra ve sau do lay danh sach suat an
  const getStateTuan = (result) => {
    setCurrentTuan(result);
    setModalVisibleTuan(false);
    setSelectDay(2);
    // Lay danh sach thuc don
    getDataMenu(result, 2);
    //Lay data hien thi len view
    selectThu(2);
  };

  //Chon thu trong tuan (sau do lay danh sach thuc don theo thu)
  const selectThu = (number) => {
    setSelectDay(number);
    getDataMenu(currentTuan, number);
  };

  //---------Lay thuc don theo du lieu duoc truyen vao
  const getDataMenu = (data, thu) => {
    setWaiting(true);
    const pro = "SELHRRE026001";
    const day = thu + '';
    const in_par = {
      p1_varchar2: data.code,
      p2_varchar2: day,
      p3_varchar2: crt_by,
      p4_varchar2: APP_VERSION,
    };

    console.log(pro, in_par);
    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par: {
          p1_sys: "lst_menu",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        setWaiting(false);
        //console.log('rs-----------: ', rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            //Lay danh thuc don
            setDataMenu(rs.data.lst_menu);
            setStateThucDon(rs.data.lst_menu);
            //console.log('rs.data.lst_menu: ', rs.data.lst_menu);
          }
        }
      })
      .catch((error) => {
        setWaiting(false);
        console.log("error getData");
        console.log(error);
      });
  };

  //---------Lay thuc don theo thu
  const setStateThucDon = (data) => {
    const caData = {};
    for (let i = 0; i < data.length; i++) {
      const { shift_type, meal_type, shift_name } = data[i];
      const isMain = meal_type === '1' || meal_type === '2' || meal_type === '3';

      if (!caData[shift_type]) {
        caData[shift_type] = {
          monChinh: [],
          monPhu: [],
          ca: shift_name,
        };
      }

      const obj = {
        menu_name: data[i].menu_name,
        dayy: data[i].dayy,
        meal_type: data[i].meal_type,
        shift_type: data[i].shift_type,
        shift_name: shift_name,
        canteen_name: data[i].canteen_name,
        canteen_pk: data[i].canteen_pk,
        choose_yn: data[i].choose_yn,
        item_pk: data[i].item_pk,
        meal_seq: data[i].meal_seq,
        week_code: data[i].week_code,
      };

      if (isMain) {
        caData[shift_type].monChinh.push(obj);
      } else {
        caData[shift_type].monPhu.push(obj);
      }
    }

    const dataSelect = Object.values(caData);
    //Set danh sach thuc don theo thu da chon
    setDataSelect(dataSelect);

  };

  const dialogNoti = (text) => {
    Alert.alert(
      "Thông báo",
      text,
      [
        {
          text: "Đóng",
          onPress: () => { },
        },
      ],
      { cancelable: false }
    );
  };

  const onSave = () => {
    const listData = [
      dataThu2Selected,
      dataThu3Selected,
      dataThu4Selected,
      dataThu5Selected,
      dataThu6Selected,
      dataThu7Selected,
      dataThu8Selected
    ];

    let cantinPk = '';
    let shiftType = '';
    let itemPk = '';

    let count = 0;
    for (let i = 0; i < listData.length; i++) {
      const data = listData[i];
      for (let j = 0; j < data.length; j++) {
        count++;
        cantinPk += data[j].canteen_pk + '|';
        shiftType += data[j].shift_type + '|';
        if (data[j].item_pk == '') {
          itemPk += '0' + '|';
        } else {
          itemPk += data[j].item_pk + '|';
        }
      }

    }
    const pro = "UPDHRRE026000";
    const in_par = {
      p1_varchar2: "UPDATE",
      p2_varchar2: thr_emp_pk,
      p3_varchar2: cantinPk,
      p4_varchar2: shiftType,
      p5_varchar2: itemPk,
      p6_varchar2: currentTuan.code,
      p7_varchar2: count,
      p8_varchar2: crt_by,
      p9_varchar2: APP_VERSION,
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
        console.log("rs save ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: đăng ký không thành công.";
          }
          dialogNoti(errors);
        } else {
          //console.log("rs save ", rs.data.status);
          dialogNoti("Đã lưu các thay đổi thành công");
          //getDataSelected(currentTuan);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const dialogDeleteItemChoose = (item, day) => {
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xóa món ăn đã chọn không?",
      [
        {
          text: "Hủy bỏ",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: () => {
            deleteItemSelectByDay(item, day);
          },
        },
      ],
      { cancelable: false }
    );
  }

  const deleteItemSelectByDay = (item, day) => {
    const stDate = item.week_code.substring(0, 8);
    const eDate = item.week_code.substring(8, 16);
    console.log('stDate: ', stDate);
    console.log('eDate: ', eDate);
    console.log('day: ', day);

    const sYear = stDate.substring(0, 4);
    const sMonth = stDate.substring(4, 6);
    const sDay = stDate.substring(6, 8);

    const startDate = new Date(`${sYear}-${sMonth}-${sDay}`);

    const daysToAdd = day - 1 - startDate.getDay();
    const selectedDate = new Date(startDate);
    selectedDate.setDate(selectedDate.getDate() + daysToAdd);

    // Chuyển định dạng ngày thành chuỗi theo định dạng 'yyyyMMdd'
    const formattedDate = selectedDate.toISOString().slice(0, 10).replace(/-/g, '');

    const pro = "UPDHRRE026001";
    //console.log('item: ', item);
    const in_par = {
      p1_varchar2: "DELETE",
      p2_varchar2: item.shift_type,
      p3_varchar2: formattedDate,
      p4_varchar2: item.item_pk,
      p5_varchar2: item.emp_pk,
      p6_varchar2: item.canteen_pk,
      p7_varchar2: crt_by,
      p8_varchar2: APP_VERSION,
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
        console.log("rs delete item ", rs);
        if (rs.results == "F") {
          let errors = "";
          try {
            errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
          } catch (error) {
            errors = "Lỗi: xóa món ăn không thành công.";
          }
          dialogNoti(errors);
        } else {
          dialogNoti("Đã xóa món ăn thành công");
          //Cap nhat lai data hien thi len view
          getDataSelected(currentTuan);
          for (let i = 0; i < dataThu.length; i++) {
            if (dataThu[i].shift_type == item.shift_type && dataThu[i].item_pk == item.item_pk) {
              const dataTemp = dataThu[i];
              dataTemp.dish = "";
              dataTemp.item_pk = "";
              dataThu[i] = dataTemp;
              setDataThu([...dataThu.slice(0, i), dataTemp, ...dataThu.slice(i + 1)]);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onValueChange = useCallback(
    async (event, newDate) => {
      const dt = moment(newDate).format("YYYY-MM-DD");
      showPicker(false);
      setDate(dt);
    },
    [date, showPicker]
  );

  const setDataDialog = (number) => {
    if (number == 2) {
      setTitleThu("Thứ 2");
      setNumberThu(2);
      setDataThu(dataThu2Selected);
    } else if (number == 3) {
      setTitleThu("Thứ 3");
      setNumberThu(3);
      setDataThu(dataThu3Selected);
    } else if (number == 4) {
      setTitleThu("Thứ 4");
      setNumberThu(4);
      setDataThu(dataThu4Selected);
    } else if (number == 5) {
      setTitleThu("Thứ 5");
      setNumberThu(5);
      setDataThu(dataThu5Selected);
    } else if (number == 6) {
      setTitleThu("Thứ 6");
      setNumberThu(6);
      setDataThu(dataThu6Selected);
    } else if (number == 7) {
      setTitleThu("Thứ 7");
      setNumberThu(7);
      setDataThu(dataThu7Selected);
    } else if (number == 8) {
      setTitleThu("Chủ nhật");
      setNumberThu(8);
      setDataThu(dataThu8Selected);
    }
  }

  //------------------show modal tuan thu da chon-----------------
  const showPopupDaySelect = (number) => {
    setModalVisibleThu(true);
    setDataDialog(number);
  }

  const modalThu = (
    <TVSControlPopup
      title={titleThu}
      isShow={modalVisibleThu}
      onHide={() => setModalVisibleThu(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleThu(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataThu}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ paddingHorizontal: 10, justifyContent: 'center' }}>
              {
                item.dish != '' ?
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8
                  }}>
                    <View>
                      <Text style={{ fontWeight: '700' }}>{item.shift_name}</Text>
                      <Text>{item.dish}</Text>
                    </View>
                    {/* <TVSButton
                      type={"danger"}
                      icon={"close"}
                      buttonStyle={"3"}
                      onPress={() => setModalVisibleThu(false)}
                    >
                      Đóng lại
                    </TVSButton> */}
                    <TouchableOpacity
                      style={{
                        borderColor: Color.dangerText,
                        borderWidth: 1,
                        // backgroundColor: 'white',
                        borderRadius: 12,
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onPress={() => { dialogDeleteItemChoose(item, numberThu) }}
                    >
                      <Text style={{ color: Color.dangerText, fontWeight: '700' }}>Bỏ chọn</Text>
                    </TouchableOpacity>
                  </View> : null
              }
            </View>
          );
        }}
      />
    </TVSControlPopup>
  );

  // -------Modal Show danh sach tuan------------
  const modalTuan = (
    <TVSControlPopup
      title={"Chọn tuần"}
      isShow={modalVisibleTuan}
      onHide={() => setModalVisibleTuan(false)}
    >
      <FlatList
        data={dataTuan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateTuan(item);
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

  //Lưu tam mon an da chon xuong thuc don da chon
  const saveTemp = (item) => {
    if (item.item_pk == '') return;
    if (selectDay == 2) {
      for (let i = 0; i < dataThu2Selected.length; i++) {
        if (dataThu2Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu2Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;

          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu2Selected([...dataThu2Selected.slice(0, i), itemTemp, ...dataThu2Selected.slice(i + 1)]);
        }
      }
    } else if (selectDay == 3) {
      for (let i = 0; i < dataThu3Selected.length; i++) {
        if (dataThu3Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu3Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu3Selected([...dataThu3Selected.slice(0, i), itemTemp, ...dataThu3Selected.slice(i + 1)]);
        }
      }
    } else if (selectDay == 4) {
      for (let i = 0; i < dataThu4Selected.length; i++) {
        if (dataThu4Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu4Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu4Selected([...dataThu4Selected.slice(0, i), itemTemp, ...dataThu4Selected.slice(i + 1)]);
        }
      }

    } else if (selectDay == 5) {
      for (let i = 0; i < dataThu5Selected.length; i++) {
        if (dataThu5Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu5Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu5Selected([...dataThu5Selected.slice(0, i), itemTemp, ...dataThu5Selected.slice(i + 1)]);
        }
      }
    } else if (selectDay == 6) {
      for (let i = 0; i < dataThu6Selected.length; i++) {
        if (dataThu6Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu6Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu6Selected([...dataThu6Selected.slice(0, i), itemTemp, ...dataThu6Selected.slice(i + 1)]);
        }
      }
    } else if (selectDay == 7) {
      for (let i = 0; i < dataThu7Selected.length; i++) {
        if (dataThu7Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu7Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu7Selected([...dataThu7Selected.slice(0, i), itemTemp, ...dataThu7Selected.slice(i + 1)]);
        }
      }
    } else if (selectDay == 8) {
      for (let i = 0; i < dataThu8Selected.length; i++) {
        if (dataThu8Selected[i].shift_name == item.shift_name) {
          let itemTemp = dataThu8Selected[i];
          itemTemp.dish = item.dayy;
          itemTemp.item_pk = item.item_pk;
          itemTemp.canteen_name = item.canteen_name;
          itemTemp.canteen_pk = item.canteen_pk;
          itemTemp.choose_yn = item.choose_yn;
          itemTemp.meal_seq = item.meal_seq;
          itemTemp.shift_type = item.shift_type;
          itemTemp.menu_name = item.menu_name;
          itemTemp.shift_name = item.shift_name;
          itemTemp.shift_type = item.shift_type;
          itemTemp.week_code = item.week_code;
          //Thay the dataThu2Selected[i] = itemTemp
          setDataThu8Selected([...dataThu8Selected.slice(0, i), itemTemp, ...dataThu8Selected.slice(i + 1)]);
        }
      }
    }
  }

  return (
    <Block paddingTop={0} paddingBottom={10} flex>
      <Block flex>
        <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
          {!isLoading && (
            <ScrollView>
              <Block style={styles.container}>
                {/************ START: MonthPicker /************/}
                <Block
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Block
                    flex={1}
                    marginHorizontal={10}
                    marginVertical={5}
                    radius={8}
                    backgroundColor={Color.gray}
                  >
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
                </Block>
                {/************ END: MonthPicker /************/}

                {/*************** START: TUAN - XUAT AN ************** */}
                <View style={{ flex: 1 }}>
                  <Block
                    flex={1}
                    margin={10}
                    marginTop={1}
                    radius={8}
                    backgroundColor={Color.gray}
                  >
                    <View
                      height={45}
                      paddingHorizontal={10}
                      style={{ justifyContent: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          masterPK == ""
                            ? setModalVisibleTuan(!modalVisibleTuan)
                            : null;
                          // setIsShow(false);
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
                                  currentTuan.code == 0
                                    ? "#B2B2B2"
                                    : Color.mainColor,
                              }}
                            >
                              {currentTuan.code_nm}
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
                  </Block>
                </View>

                {/************ START: List thuc don /************/}
                <Block style={[styles.titleText, { marginLeft: 10 }]}>
                  <Text fontWeight={'700'} color={Color.mainColor}>Thực đơn</Text>
                  <Text fontWeight={'700'} color={Color.red}> *</Text>
                </Block>
                <View
                  style={{
                    flexDirection: 'row', flex: 1,
                    marginHorizontal: 10, marginBottom: 10,
                    justifyContent: 'space-between'
                  }}>
                  {/* View cac thu trong tuan */}
                  <Block
                    width={"25%"}
                    flexDirection={"column"}
                  >
                    {/* Thu 2 */}
                    <TouchableOpacity
                      onPress={() => selectThu(2)}
                    >
                      {selectDay == 2 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 2</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 2</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Thu 3 */}
                    <TouchableOpacity
                      onPress={() => selectThu(3)}
                    >
                      {selectDay == 3 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 3</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 3</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Thu 4 */}
                    <TouchableOpacity
                      onPress={() => selectThu(4)}
                    >
                      {selectDay == 4 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 4</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 4</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Thu 5 */}
                    <TouchableOpacity
                      onPress={() => selectThu(5)}
                    >
                      {selectDay == 5 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 5</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 5</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Thu 6 */}
                    <TouchableOpacity
                      onPress={() => selectThu(6)}
                    >
                      {selectDay == 6 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 6</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 6</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Thu 7 */}
                    <TouchableOpacity
                      onPress={() => selectThu(7)}
                    >
                      {selectDay == 7 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Thứ 7</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Thứ 7</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                    {/* Chu nhat */}
                    <TouchableOpacity
                      onPress={() => selectThu(8)}
                    >
                      {selectDay == 8 ?
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={"#498DE3"}
                        >
                          <Text style={{ fontWeight: '700', color: 'white' }}>Chủ nhật</Text>
                        </Block> :
                        <Block
                          flex={1}
                          justifyCenter={true}
                          alignCenter={true}
                          padding={10}
                          marginBottom={5}
                          borderRadius={8}
                          borderWidth={1}
                          borderColor={Color.gray}
                          backgroundColor={Color.gray}
                        >
                          <Text style={{ fontWeight: '700' }}>Chủ nhật</Text>
                        </Block>
                      }
                    </TouchableOpacity>

                  </Block>


                  {/* View state thuc don */}
                  <Block
                    width={"73%"}
                    flexDirection={"column"}
                    borderRadius={8}
                    padding={10}
                    borderWidth={1}
                    borderColor={Color.gray}
                    backgroundColor={Color.gray}
                  >
                    <View style={{ height: 400 }}>
                      <ScrollView nestedScrollEnabled>
                        {
                          dataMenu.length > 0 ?
                            <View style={{ flexDirection: 'column' }}>
                              <View style={{ flexDirection: 'column' }}>
                                {
                                  dataSelect.length > 0 ? dataSelect.map((item, index) => {
                                    return (
                                      <Item
                                        item={item}
                                        index={index}
                                        key={index}
                                        onPress={saveTemp}
                                      />
                                    )
                                  }) : null
                                }
                              </View>
                            </View> :
                            <View>
                              <Text>Chưa có thực đơn</Text>
                            </View>
                        }
                      </ScrollView>
                    </View>
                  </Block>
                </View>

                {/************ START: List thuc don da chon /************/}
                <Block style={[styles.titleText, { marginLeft: 10 }]}>
                  <Text fontWeight={'700'} color={Color.mainColor}>Món ăn đã chọn</Text>
                  <Text fontWeight={'700'} color={Color.red}> *</Text>
                </Block>
                <View
                  style={{ flexDirection: 'column', flex: 1, marginHorizontal: 10, marginBottom: 10 }}
                >
                  {/* Thu 2 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(2)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 2</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu2Selected.length > 0 ? dataThu2Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Thu 3 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(3)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 3</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu3Selected.length > 0 ? dataThu3Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Thu 4 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(4)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 4</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu4Selected.length > 0 ? dataThu4Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Thu 5 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(5)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 5</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu5Selected.length > 0 ? dataThu5Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Thu 6 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(6)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 6</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu6Selected.length > 0 ? dataThu6Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Thu 7 */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(7)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Thứ 7</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu7Selected.length > 0 ? dataThu7Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                  {/* Chu nhat */}
                  <TouchableOpacity
                    onPress={() => showPopupDaySelect(8)}
                  >
                    <Block
                      flex={1}
                      flexDirection={"row"}
                      marginBottom={5}
                      backgroundColor={Color.gray}
                      borderRadius={8}
                      justifyContent={"space-between"}
                    >
                      <Block
                        width={"25%"}
                        alignCenter={true}
                        justifyCenter={true}
                        padding={10}
                        marginBottom={5}
                        borderRadius={8}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        <Text style={{ fontWeight: '700' }}>Chủ nhật</Text>
                      </Block>

                      <Block
                        width={"73%"}
                        borderRadius={8}
                        padding={5}
                        borderWidth={1}
                        borderColor={Color.gray}
                        backgroundColor={Color.gray}
                      >
                        {
                          dataThu8Selected.length > 0 ? dataThu8Selected.map((item, index) => {
                            return (
                              <View
                                style={{
                                  marginLeft: 10,
                                }}
                              >
                                {
                                  item.dish ?
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>{item.dish}</Text>
                                    </View> :
                                    <View>
                                      <Text style={{ fontWeight: 'bold' }}>{item.shift_name}</Text>
                                      <Text>Chưa chọn món ăn</Text>
                                    </View>
                                }

                              </View>
                            )
                          }) : null
                        }
                      </Block>



                    </Block>
                  </TouchableOpacity>

                </View>

                {/* START: button bottom */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <TVSButton
                      onPress={validate}
                      icon={"content-save"}
                      buttonStyle={"3"}
                      minWidth={150}
                    >
                      Sao lưu
                    </TVSButton>
                  </View>
                </View>

              </Block>
              <Load visible={load} />
            </ScrollView>
          )}
        </Block>
      </Block>

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={new Date(date)}
          okButton="Chọn"
          cancelButton="Huỷ"
          enableAutoDarkMode={Platform.OS === "ios" ? true : false}
        />
      )}

      {modalTuan}
      {modalThu}
    </Block>
  );
}

export default DK;