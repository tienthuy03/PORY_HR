import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { PieChart } from "react-native-svg-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Calender from "../../../../components/Calendar/singleCalendar";
import Texts from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon_calendar from "../../../../icons/Datev";
import { setHeaderChil2 } from "../../../../Language";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";

const TKTQ_MBHRMN004 = ({ navigation: { goBack } }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);
  const styles = StyleSheet.create({
    containerDxn: {
      paddingTop: 10,
      backgroundColor: Color.gray,
      flex: 1,
    },
    modalView: {
      flex: 1,
      justifyContent: "center",
    },
    modalBackground: {
      flex: 1,
    },
    modalBackgroundContent: {
      flex: 1,
    },
    formView: {
      padding: 10,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [dataPb, setDataPb] = useState([]);
  const [valuePb, setValuePb] = useState("");
  const [labelPb, setLabelPb] = useState("Chọn phòng ban");
  const [modalPbVisible, setModalPbVisible] = useState(false);
  const [daySelect, setDateSelect] = useState(moment().format("DD/MM/YYYY"));
  const dataMenuMBHRs = useSelector(
    (state) => state.menuReducer.data.data.menu
  );
  const [dataDulieuLaoDong, setDataDuLieuLaoDong] = useState([]);
  const [totalEmp, setTotalEmp] = useState(0);
  const language = useSelector(
    (state) => state.loginReducers.data.data.user_language
  );
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let crt_by = useSelector((state) => state.loginReducers.crt_by);
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  useEffect(() => {
    getDataPb();
  }, []);
  const getDataPb = () => {
    sysFetch(
      API,
      {
        pro: "SELHRTK0040100",
        in_par: {
          p1_varchar2: userPk,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getDataPb", null, null);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataPb(rs.data.data);
            setLabelPb(rs.data.data[0].code_nm);
            setValuePb(rs.data.data[0].code);
            getData(rs.data.data[0].code, moment().format("YYYYMMDD"));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const randomRGB = () => {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return `rgb(${red}, ${green}, ${blue})`;
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
        if (obj == "getDataPb") {
          getDataPb();
        }
        if (obj == "getData") {
          getData(p1, p2);
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

  const renderOneItemTop = ({ item }) => {
    if (item.col === "Tổng số nhân viên") {
      return null;
    }
    const per =
      ((item.colvalue / totalEmp) * 100) % 1 === 0
        ? (item.colvalue / totalEmp) * 100
        : ((item.colvalue / totalEmp) * 100).toFixed(2);
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          marginBottom: 5,
          alignItems: "center",
          paddingRight: 10,
        }}
      >
        <View
          style={{
            backgroundColor: item.color,
            width: 30,
            height: 30,
            marginRight: 5,
            borderRadius: 5,
          }}
        />
        <Texts flex>{item.col}</Texts>
        <Texts width={100}>
          {item.colvalue} - ({per}%)
        </Texts>
      </View>
    );
  };
  const getData = (valuePbSelected, daySelected) => {
    sysFetch(
      API,
      {
        pro: "SELHRTK0041100",
        in_par: {
          p1_varchar2: valuePbSelected,
          p2_varchar2: daySelected,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData", valuePbSelected, daySelected);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            let temp = [];
            rs.data.data.map((item) => {
              temp.push({
                ...item,
                color: randomRGB(),
              });
            });
            setDataDuLieuLaoDong(temp);
            if (rs.data.data.length > 0) {
              setTotalEmp(rs.data.data[0].colvalue);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const getStateCalendar = async (result) => {
    getData(valuePb, moment(result.dateString).format("YYYYMMDD"));
    setDateSelect(result.day + "/" + result.month + "/" + result.year);
    setModalVisible(false);
  };
  const modal = (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <Button
        nextScreen={() => setModalVisible(false)}
        height={Platform.OS === "ios" ? 160 : 130}
        backgroundColor={"rgba(0,0,0,0.4)"}
      />
      <View style={styles.formView}>
        <Calender getStateCalendar={getStateCalendar} />
      </View>

      <Button
        nextScreen={() => setModalVisible(false)}
        flex
        backgroundColor={"rgba(0,0,0,0.4)"}
      />
    </Modal>
  );

  const getStatePb = async (result) => {
    setTimeout(() => {
      setLabelPb(result.code_nm);
      setValuePb(result.code);
      setModalPbVisible(false);
    }, 100);
  };
  const modalPb = (
    <TVSControlPopup
      title={"CHỌN PHÒNG BAN"}
      maxHeight={400}
      isShow={modalPbVisible}
      onHide={() => setModalPbVisible(false)}
    >
      <FlatList
        data={dataPb}
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
  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      const per =
        ((data.item.colvalue / totalEmp) * 100) % 1 === 0
          ? (data.item.colvalue / totalEmp) * 100
          : ((data.item.colvalue / totalEmp) * 100).toFixed(2);
      return (
        <>
          {data.item.colvalue > 0 ? (
            <Text
              key={index}
              x={pieCentroid[0]}
              y={pieCentroid[1]}
              fill={"white"}
              textAnchor={"middle"}
              alignmentBaseline={"center"}
              fontSize={20}
            >
              {`${per}%`}
            </Text>
          ) : null}
        </>
      );
    });
  };
  return (
    <>
      {/* <PopUpPhongBan /> */}
      <Block flex backgroundColor={Color.backgroundColor}>
        <TVSHeader goBack={goBack}>
          {setHeaderChil2(
            language,
            dataMenuMBHRs,
            "MBHRTK004",
            dataMenuMBHRs.filter((x) => x.menu_cd === "MBHRTK")[0].pk
          )}
        </TVSHeader>
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
          <Block
            backgroundColor="#fff"
            padding={5}
            marginLeft={10}
            marginRight={10}
            marginTop={10}
            radius={5}
          >
            <View>
              <Text>Phòng ban</Text>
              <Button
                nextScreen={() => setModalPbVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.gray,
                  justifyContent: "center",
                  borderRadius: 8,
                  elevation: 3,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valuePb === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelPb}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
              {modalPb}
            </View>
          </Block>
          <Block backgroundColor="#fff" padding={5} margin={10} radius={5}>
            <Block
              column
              backgroundColor="#F3F6F9"
              radius={5}
              alignCenter
              justifyCenter
              height={40}
            >
              <Button
                nextScreen={() => toggleModal()}
                row
                height={40}
                paddingLeft={20}
                alignCenter
                justifyCenter
              >
                <Icon_calendar color={Color.mainColor} />
                <Texts
                  paddingRight={10}
                  center
                  color={Color.mainColor}
                  flex
                  size={14}
                  paddingLeft={10}
                >
                  Ngày {daySelect}
                </Texts>
                <Texts marginRight={10} />
              </Button>
            </Block>
            {modal}
          </Block>

          {dataDulieuLaoDong.length > 0 ? (
            <Block paddingLeft={10} flex={1} paddingBottom={20}>
              <Block>
                <FlatList
                  data={dataDulieuLaoDong}
                  renderItem={renderOneItemTop}
                  keyExtractor={(item, index) => index.toString()}
                />
              </Block>
              <Block marginBottom={10} padding={10} alignCenter flex={1}>
                <PieChart
                  style={{
                    height: 300,
                    width: 300,
                    marginRight: 10,
                  }}
                  valueAccessor={({ item }) => {
                    return ((item.item.colvalue / totalEmp) * 100) % 1 === 0
                      ? (item.item.colvalue / totalEmp) * 100
                      : ((item.item.colvalue / totalEmp) * 100).toFixed(2);
                  }}
                  data={dataDulieuLaoDong
                    .filter(
                      (x) => x.colvalue > 0 && x.col !== "Tổng số nhân viên"
                    )
                    .map((item, index) => {
                      return {
                        item,
                        svg: {
                          fill: item.color,
                          onPress: () => console.log("press", index),
                        },
                        key: `pie-${index}`,
                      };
                    })}
                  spacing={0}
                  innerRadius={0}
                >
                  <Labels />
                </PieChart>
                <Texts marginTop={5}>Tổng nhân viên: {totalEmp}</Texts>
              </Block>
            </Block>
          ) : null}
        </Block>
      </Block>
    </>
  );
};

export default TKTQ_MBHRMN004;
