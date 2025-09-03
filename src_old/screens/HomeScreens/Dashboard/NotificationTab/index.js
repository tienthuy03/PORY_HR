import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import Text from "../../../../components/Text";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../services/fetch_v1";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import PopupPDF from "./Popup_PDF";
import PopupIMG from "./Popup_IMG";
import { APP_VERSION } from "../../../../config/Pro";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";
import { showAlert } from "../../../../components/Tvs/TVSAlertORA";

const CongTyNoti = ({ onCallbackSetDate, startDate, endDate }) => {
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((s) => s.SystemReducer.theme);

  const navigation = useNavigation();
  const loginReducers = useSelector((state) => state.loginReducers);

  let thr_emp_pk = "";
  let tokenLogin = "";
  let fullnames = "";
  let crt_by = "";
  let userPk;
  let refreshToken;
  try {
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    tokenLogin = loginReducers.data.data.tokenLogin;
    fullnames = loginReducers.data.data.full_name;
    crt_by = loginReducers.data.data.crt_by;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
  } catch (error) {
    console.log(error);
  }
  const [data, setData] = useState([]);

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
        if (obj == "updateExperience") {
          updateExperience(p1);
        }
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
  const [pageCurrent, setPageCurrent] = useState(0);
  const handleLoadMore = () => {
    if (!isLoading && !isListEnd) {
      setPageCurrent(pageCurrent + 1);
      setIsLoading(true);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      getData();
    }, 2000);
  }, [pageCurrent]);

  const getData = () => {
    sysFetch(
      API,
      {
        pro: "SELHRAN002000",
        in_par: {
          p1_varchar2: thr_emp_pk,
          p2_varchar2: 10,
          p3_varchar2: pageCurrent,
        },
        out_par: {
          p1_sys: "notifycation",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.notifycation.length > 0) {
              setData(data.concat(rs.data.notifycation));
              setIsLoading(false);
              setIsListEnd(false);
            } else {
              setIsLoading(false);
              setIsListEnd(true);
            }
          } else {
            setIsListEnd(true);
            setIsLoading(false);
          }
        } else {
          setIsListEnd(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsListEnd(true);
        setIsLoading(false);
      });
  };

  const ShowMore = (item) => {
    let arrData = [...data];
    arrData.forEach(function (itemFilter) {
      if (itemFilter.pk == item.pk) {
        itemFilter.is_show = "Y";
      }
    });
    setData(arrData);
  };
  const CloseShowMore = (item) => {
    let arrData = [...data];
    arrData.forEach(function (itemFilter) {
      if (itemFilter.pk == item.pk) {
        itemFilter.is_show = "N";
      }
    });
    setData(arrData);
  };
  const getDataBase64 = (type, table_pk) => {
    dispatch(ShowGlobalLoading);
    console.log({
      p1_varchar2: table_pk,
      p2_varchar2: crt_by,
      p3_varchar2: APP_VERSION,
    });
    sysFetch(
      API,
      {
        pro: "SELHRAN002001",
        in_par: {
          p1_varchar2: table_pk,
          p2_varchar2: crt_by,
          p3_varchar2: APP_VERSION,
        },
        out_par: {
          p1_sys: "data_base64",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log(rs);
        if (rs == "Token Expired") {
          refreshNewToken("getData");
          dispatch(HideGlobalLoading);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            if (rs.data.data_base64.length > 0) {
              if (type == "PDF") {
                setPDFContent(rs.data.data_base64[0].base64);
                setModalPDFVisible(true);
                dispatch(HideGlobalLoading);
              }
              if (type == "IMG") {
                setIMGContent(rs.data.data_base64[0].base64);
                setModalIMGVisible(true);
                dispatch(HideGlobalLoading);
              }
            } else {
              Alert.alert(
                "Thông báo",
                "Không tìm thấy file đính kèm",
                [
                  {
                    text: "Đóng",
                    onPress: () => { },
                  },
                ],
                { cancelable: true }
              );
              dispatch(HideGlobalLoading);
            }
          } else {
            showAlert(rs.errorData);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const renderTitle = ({ item, index }) => {
    const currentTabName = item.tab_name;
    return (
      <>
        <View
          style={{
            backgroundColor: Color.tabColor,
            padding: 10,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 13,
            elevation: 2,
            marginHorizontal: 10,
            marginBottom: 5,
            borderRadius: 8,
          }}
        >
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  paddingBottom: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Block
                  marginLeft={10}
                  height={10}
                  width={10}
                  radius={5}
                  backgroundColor={Color.titleColor}
                />
                <Text
                  flex
                  paddingLeft={10}
                  height={60}
                  size={16}
                  color={Color.titleColor}
                  fontFamily={"Roboto-Bold"}
                >
                  {currentTabName}
                </Text>
                {item.file_yn == "Y" ? (
                  item.image_yn == "Y" ? (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(item.att_file_pk);
                        // setIMGContent(item.pdf_content);
                        // setModalIMGVisible(true);
                        getDataBase64("IMG", item.att_file_pk);
                        console.log("image");
                      }}
                    >
                      <Icon
                        color={item.read_yn === "Y" ? "#808080" : "#F5B041"}
                        size={25}
                        name={"attachment"}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        // setPDFContent(item.pdf_content);
                        // setModalPDFVisible(true);
                        getDataBase64("PDF", item.att_file_pk);
                      }}
                    >
                      <Icon
                        color={item.read_yn === "Y" ? "#808080" : "#F5B041"}
                        size={25}
                        name={"attachment"}
                      />
                    </TouchableOpacity>
                  )
                ) : null}
              </View>
              {Object.entries(item).map((oneField, index) => {
                return (
                  oneField[0].substr(0, 1) === "_" && (
                    <Block
                      row
                      borderBottomWidth={1}
                      borderBottomColor={"#F4F6F7"}
                      marginLeft={10}
                      marginRight={10}
                      paddingTop={5}
                      paddingBottom={5}
                      justifyContent={"space-between"}
                    >
                      <Text flex={0}>
                        {oneField[0]
                          .replace("_", "")
                          .substr(0, 1)
                          .toUpperCase() +
                          oneField[0]
                            .replace("_", "")
                            .substr(1, oneField[0].replace("_", "").length)}
                      </Text>

                      <Text right flex={1}>
                        {oneField[1]}
                      </Text>
                    </Block>
                  )
                );
              })}
            </View>
          </View>
          {item.is_show == "Y" ? (
            <Block
              keyExtractor={index.toString()}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  padding: 10,
                  backgroundColor: Color.blueB,
                }}
              >
                <Text color={Color.keyColor} flex={1}>
                  {item.content}
                </Text>
              </View>
            </Block>
          ) : null}

          {item.is_show == "N" ? (
            <Button
              nextScreen={() => {
                ShowMore(item);
              }}
            >
              <View style={{ alignItems: "center", flex: 1, paddingTop: 10 }}>
                <Text
                  textDecorationLine={"underline"}
                  style={{ color: Color.mainColor }}
                >
                  Xem thêm
                </Text>
              </View>
            </Button>
          ) : null}
          {item.is_show == "Y" ? (
            <Button
              nextScreen={() => {
                CloseShowMore(item);
              }}
            >
              <View style={{ alignItems: "center", flex: 1, paddingTop: 10 }}>
                <Text
                  textDecorationLine={"underline"}
                  style={{ color: Color.mainColor }}
                >
                  Ẩn bớt
                </Text>
              </View>
            </Button>
          ) : null}
        </View>
      </>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);
  const renderFooter = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator />
      </View>
    ) : null;
  };
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const [PDFContent, setPDFContent] = useState("");
  const modalPDF = (
    <PopupPDF
      title={"File đính kèm"}
      isShow={modalPDFVisible}
      dataPDF={PDFContent}
      onHide={() => {
        setModalPDFVisible(false);
      }}
    ></PopupPDF>
  );
  const [modalIMGVisible, setModalIMGVisible] = useState(false);
  const [IMGContent, setIMGContent] = useState("");
  const modalIMG = (
    <PopupIMG
      title={"File đính kèm"}
      isShow={modalIMGVisible}
      dataIMG={IMGContent}
      onHide={() => {
        setModalIMGVisible(false);
      }}
    ></PopupIMG>
  );
  return (
    <Block marginBottom={Platform.OS === "ios" ? 20 : 5} flex>
      {modalPDF}
      {modalIMG}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString() + "_a"}
        renderItem={renderTitle}
        refreshing={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        onEndReached={() => {
          handleLoadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View
            style={{
              margin: 10,
              marginTop: 20,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Không có dữ liệu !</Text>
          </View>
        )}
      />
    </Block>
  );
};

export default CongTyNoti;
