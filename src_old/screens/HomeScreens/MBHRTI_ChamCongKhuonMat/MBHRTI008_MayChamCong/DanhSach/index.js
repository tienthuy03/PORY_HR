import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import sysFetch from "../../../../../services/fetch_v1";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import ModalFilter from "../TimKiem";

const DSMayChamCong = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // ---------------------GET DATA FROM REDUX---------------------
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

  //---------------------TIM KIEM---------------------
  const [maMay, setMaMay] = useState("");
  const [tenMay, setTenMay] = useState("");
  const [diaChiIP, setDiaChiIP] = useState("");
  const [trangThai, setTrangThai] = useState("ALL");
  const [loaiMay, setLoaiMay] = useState("ALL");
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [dataTrangThai, setDataTrangThai] = useState([]);
  const [dataLoaiMay, setDataLoaiMay] = useState([]);

  const handleShowModal = () => {
    setModalVisible(!modalVisible);
  };

  const showModalNangCao = () => {
    return (
      <ModalFilter
        resultNangCaoModal={resultNangCaoModal}
        isShowModal={modalVisible}
        dataTrangThai={dataTrangThai}
        dataLoaiMay={dataLoaiMay}
      />
    );
  };

  const resultNangCaoModal = (result) => {
    setModalVisible(false);
    setMaMay(result.maMayChamCongResult);
    setTenMay(result.tenMayChamCongResult);
    setDiaChiIP(result.diaChiIPResult);
    setTrangThai(result.trangThaiResult);
    setLoaiMay(result.loaiMayResult);

    pageNo.current = 0;
    if (result.flagSearch)
      fetchData(
        result.maMayChamCongResult,
        result.tenMayChamCongResult,
        result.diaChiIPResult,
        result.trangThaiResult == "" ? "ALL" : result.trangThaiResult,
        result.loaiMayResult == "" ? "ALL" : result.loaiMayResult,
        0,
        10
      );
  };

  // ---------------------------FETCH DATA---------------------------
  const pageNo = useRef(0);
  const countReload = useSelector(
    (state) => state.HRTI008_MayChamCongReducer.countReload
  );

  useEffect(() => {
    pageNo.current = 0;
    if (countReload > 0) {
      fetchData(maMay, tenMay, diaChiIP, trangThai, loaiMay, 0, 10);
    }
  }, [countReload]);

  useEffect(() => {
    pageNo.current = 0;
    fetchData(maMay, tenMay, diaChiIP, trangThai, loaiMay, 0, 10);
  }, []);

  const fetchData = (
    maMay,
    tenMay,
    diaChiIP,
    trangThai,
    loaiMay,
    pageNo,
    pageSize
  ) => {
    dispatch(ShowGlobalLoading);
    const pro = "SELHRTI008000";
    const in_par = {
      p1_varchar2: userPk,
      p2_varchar2: maMay, //Ma may cham cong
      p3_varchar2: tenMay, //Ten may cham cong
      p4_varchar2: diaChiIP, //Dia chi IP
      p5_varchar2: trangThai, //Trang thai su dung
      p6_varchar2: loaiMay, //Loai may cham cong
      p7_varchar2: crt_by, //user dang nhap
      p8_varchar2: pageNo,
      p9_varchar2: pageSize,
    };
    const out_par = {
      p1_sys: "dsMayChamCong",
      p2_sys: "dsTrangThai",
      P3_sys: "dsLoaiMay",
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
            setData(rs.data.dsMayChamCong);
            if (pageNo == 0) {
              setDataTrangThai(rs.data.dsTrangThai);
              setDataLoaiMay(rs.data.dsLoaiMay);
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  const ItemValue = ({ title, value, isLable, index, iconName }) => {
    return (
      <View style={{}}>
        {isLable ? (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              paddingHorizontal: 10,
              overflow: "hidden",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 15,
                opacity: 0.9,
              }}
            >
              {value}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              marginBottom: 2,
              alignItems: "center",
            }}
          >
            <Icon name={iconName} size={14} color={Color.mainColor} />
            <Text
              style={{
                fontSize: 14,
                opacity: 0.7,
                marginLeft: 5,
              }}
            >
              {title}: &nbsp;
            </Text>
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              {value}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const ItemMayChamCong = ({ item, onSelect, index }) => {
    const link = "../../../../../assets/images/mcc.png";
    return (
      <TouchableOpacity onPress={onSelect}>
        <View
          style={
            index == 0
              ? {
                  backgroundColor: "white",
                  marginBottom: 2,
                  padding: 10,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }
              : index == data.length - 1
              ? {
                  backgroundColor: "white",
                  marginBottom: 2,
                  padding: 10,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }
              : {
                  backgroundColor: "white",
                  marginBottom: 2,
                  padding: 10,
                }
          }
        >
          <ItemValue
            title={"Tên máy"}
            value={item.tenmay}
            isLable={true}
            index={index}
          />
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 1 }}>
              <ItemValue
                title={"Mã máy"}
                value={item.mamay}
                index={index + 1}
                iconName={"barcode-scan"}
              />
              <ItemValue
                title={"Địa chỉ IP"}
                value={item.diachiip}
                index={index}
                iconName={"web"}
              />
              <ItemValue
                title={"Loại máy"}
                value={item.loaimay}
                index={index + 1}
                iconName={"file-tree-outline"}
              />
            </View>
            <View style={{}}>
              <Image
                source={require(link)}
                style={{
                  width: 70,
                  height: 70,
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onRenderNoItem = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Color.gray,
            fontSize: 16,
          }}
        >
          Không có dữ liệu
        </Text>
      </View>
    );
  };

  const handleLoadMore = () => {
    pageNo.current = pageNo.current + 1;
    fetchData(maMay, tenMay, diaChiIP, trangThai, loaiMay, pageNo.current, 10);
  };

  //---------------------CHI TIET + THEM---------------------
  const handleSelectItem = (item) => {
    if (item) {
      navigation.navigate("MBHRTI008_ChiTiet", {
        pk_maychamcong: item.pk,
        loaiMayChamCong: item.loaimay,
        flag: "edit",
      });
    } else {
      navigation.navigate("MBHRTI008_ChiTiet", {
        pk_maychamcong: "",
        loaiMayChamCong: "",
        flag: "add",
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        zIndex={20}
        style={{
          marginVertical: 5,
          marginHorizontal: 10,
          marginBottom: 0,
          marginHorizontal: 10,
          flex: 1,
        }}
      >
        {/* Tim kiem */}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <TextInput
            onChangeText={(newText) => setTenMay(newText)}
            value={tenMay}
            placeholder={"Tìm kiếm"}
            style={{
              padding: Platform.OS === "ios" ? 10 : 6,
              backgroundColor: Color.white,
              justifyContent: "center",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              flex: 1,
              paddingHorizontal: 20,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              pageNo.current = 0;
              fetchData(maMay, tenMay, diaChiIP, "ALL", "ALL", 0, 10);
            }}
          >
            <View style={{}}>
              <Icon
                name={"magnify"}
                color={Color.mainColor}
                size={20}
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleShowModal()}>
            <View style={{ borderRadius: 8 }}>
              <Icon
                name={"filter-outline"}
                color={Color.mainColor}
                size={20}
                style={{
                  padding: 10,
                  backgroundColor: Color.white,
                  borderTopRightRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* DAnh sach */}
        <View
          style={{
            flex: 1,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={false}
            onRefresh={() => {
              pageNo.current = 0;
              fetchData(maMay, tenMay, diaChiIP, trangThai, loaiMay, 0, 10);
            }}
            data={data}
            renderItem={({ item, index }) => {
              return (
                <ItemMayChamCong
                  item={item}
                  index={index}
                  onSelect={() => handleSelectItem(item)}
                />
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            extraData={data}
            ListEmptyComponent={onRenderNoItem}
            onEndReachedThreshold={0.1}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            onEndReached={data.length >= 9 ? () => handleLoadMore() : null}
          />
        </View>
      </View>

      {/* Button */}
      <Icon
        name="plus-circle"
        size={50}
        color={Color.mainColor}
        onPress={() => handleSelectItem(null)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          zIndex: 999,
        }}
      />

      {modalVisible && showModalNangCao()}
    </View>
  );
};

export default DSMayChamCong;
