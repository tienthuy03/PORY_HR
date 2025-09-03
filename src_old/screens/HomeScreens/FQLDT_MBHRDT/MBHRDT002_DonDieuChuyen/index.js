/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import {
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import TVSHeader from "../../../../components/Tvs/Header";
import { setHeaderChil2 } from "../../../../Language";
import TVSList from "../../../../components/Tvs/TVSList";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";
import TVSButton from "../../../../components/Tvs/Button";
import TVSDate from "../../../../components/Tvs/TVSDate";

import sysFetch from "../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../config/Pro";

const DonThoiViec = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);

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
    console.log(fullname);

  } catch (error) {
    console.log(error);
  }
  //Control Ngay
  const [colorFrom, setColorFrom] = useState("#B2B2B2"); //Mau text
  const [fromDate, setFromDate] = useState("dd/mm/yyyy"); //
  const [startDatePickerVisible, setStartDatePickerVisible] = useState(false); //flag tat mo modal
  const showDatePickerStart = () => {
    setStartDatePickerVisible(true);
  };

  const hideDatePickerStart = () => {
    setStartDatePickerVisible(false);
  };

  const handleConfirmStart = (val) => {
    hideDatePickerStart();

    setFromDate(moment(val).format("DD/MM/YYYY"));
    setColorFrom(null);
  };

  //Control Loai vang
  const [colorLoai, setColorLoai] = useState("#B2B2B2");
  const [modalVisibleLV, setModalVisibleLV] = useState(false);
  const [dataLV, setDataLV] = useState([
    { code: 1, code_nm: "loai 1" },
    { code: 2, code_nm: "loai 2" },
  ]);
  const [loaivang_val, setLoaivang_val] = useState("Chọn loại vắng");
  const [loaivang_pk, setLoaivang_pk] = useState("");
  const getStateLV = (result) => {
    setLoaivang_val(result.code_nm);
    setLoaivang_pk(result.code);
    setModalVisibleLV(false);
    setColorLoai(null);
  };
  const modalLV = (
    <TVSControlPopup
      title={"Chọn loại vắng"}
      isShow={modalVisibleLV}
      onHide={() => setModalVisibleLV(false)}
      bottom={
        <TVSButton
          type={"danger"}
          icon={"close"}
          buttonStyle={"3"}
          onPress={() => setModalVisibleLV(false)}
        >
          Đóng lại
        </TVSButton>
      }
    >
      <FlatList
        data={dataLV}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateLV(item);
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

  //Control input
  const [description, setDescription] = useState("");
  // Call API
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    sysFetch(
      API,
      {
        pro: "SELHRDT002000",
        in_par: {
          p1_varchar2: APP_VERSION,
          p2_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "lst_loaivang",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log("API response:", rs.data); // Log toàn bộ response

        setDataLV(rs.data.lst_loaivang);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSave = () => {
    Alert.alert(
      "Thong bao",
      "Bạn có muốn sao luu không?",
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
                pro: "UPDHRDT002000",
                in_par: {
                  p1_varchar2: "UPDATE",
                  p2_varchar2: loaivang_pk,
                  p3_varchar2: description,
                  p4_varchar2: APP_VERSION,
                  p5_varchar2: crt_by,
                },
                out_par: {
                  p1_varchar2: "result_upd",
                },
              },
              tokenLogin
            )
              .then((rs) => {
                if (rs.results == "F") {
                  let newText = rs.errorData.split("ORA");
                  let errors = "";
                  try {
                    errors = newText[1].trim().split(":")[1];
                  } catch (error) {
                    errors = "Lỗi: đăng ký không thành công.";
                  }

                  Alert.alert(
                    "Thông báo",
                    errors,
                    [
                      {
                        text: "Thoát",
                        onPress: () => { },
                        style: "cancel",
                      },
                    ],
                    { cancelable: false }
                  );
                }
              })
              .catch((error) => {
                console.log(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };
  const styles = StyleSheet.create({
    // style form
    container: {
      paddingTop: 10,
      marginRight: 10,
      marginLeft: 10,
      flex: 1,
      backgroundColor: Color.white,
    },
    titleContainer: {
      // flex: 1,
      paddingHorizontal: 5,
      marginBottom: 10,
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
  });
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          loginReducers.data.data.user_language,
          menuReducer.data.data.menu,
          "MBHRDT002",
          menuReducer.data.data.menu.filter((x) => x.menu_cd === "MBHRDT002")[0]
            .p_pk
        )}
      </TVSHeader>
      <Block backgroundColor={Color.white} flex>
        <Block style={styles.titleContainer}>
          <Block style={styles.titleText}>
            <Text color={Color.mainColor}>Loại vắng</Text>
          </Block>
          <TVSList
            onPress={() => setModalVisibleLV(true)}
            colorText={colorLoai}
            code_nm={loaivang_val}
          />
        </Block>
        <Block style={{ paddingHorizontal: 5, marginBottom: 10 }}>
          <Block
            style={{
              flexDirection: "row",
              paddingBottom: 5,
              paddingLeft: 5,
              alignItems: "center",
            }}
          >
            <Text color={Color.mainColor}>Ngày vắng</Text>
            <Text color={Color.red}> *</Text>
          </Block>
          <TVSDate
            onPress={() => showDatePickerStart()}
            colorText={colorFrom}
            date={fromDate}
            modalVisible={startDatePickerVisible}
            onConfirm={handleConfirmStart}
            onCancel={hideDatePickerStart}
          />
        </Block>
        <Block style={styles.titleContainer}>
          <Block style={styles.titleText}>
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
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </Block>
        </Block>
        <Block>
          <TVSButton
            // type={'danger'}
            icon={"content-save"}
            buttonStyle={"3"}
            onPress={() => onSave()}
          >
            Sao luu
          </TVSButton>
        </Block>
      </Block>
      {modalLV}
    </Block>
  );
};
export default DonThoiViec;
