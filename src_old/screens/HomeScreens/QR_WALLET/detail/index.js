import React, { useEffect, useState } from "react";
import {
  Text, TextInput, View, StyleSheet,
  Alert, ScrollView, Image, TouchableOpacity,
  Dimensions
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import QRCode from 'react-native-qrcode-svg';
import TVSHeader from "../../../../components/Tvs/Header";
import TVSButton from "../../../../components/Tvs/Button";

import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../services/redux/GlobalLoading/action";

const widthScreen = Dimensions.get('window').width;

const QRDetail = ({ navigation: { goBack }, route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { pk_detail, type } = route.params;
  const Color = useSelector((s) => s.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  let urlImageLogin;
  let fullnameLogin;
  let empIdLogin;
  let thr_emp_pk = "";
  let tokenLogin = "";
  let userPk;
  let refreshToken;
  let crt_by = "";
  try {
    urlImageLogin = loginReducers.data.data.avatar;
    fullnameLogin = loginReducers.data.data.full_name;
    empIdLogin = loginReducers.data.data.emp_id;
    tokenLogin = loginReducers.data.data.tokenLogin;
    thr_emp_pk = loginReducers.data.data.thr_emp_pk;
    fullname = loginReducers.data.data.full_name;
    org_pk = loginReducers.data.data.org_pk;
    userPk = loginReducers.data.data.tes_user_pk;
    refreshToken = loginReducers.data.data.refreshToken;
    crt_by = loginReducers.data.data.crt_by;
  } catch (error) {
    console.log("error home main2");
    console.log(error);
  }

  const [itemChiTiet, setItemChiTiet] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    //Lay du lieu tu API theo pk_detail
    const pro = "SELHRQR001000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p2_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
      p3_varchar2: crt_by,

    };
    const out_par = {
      p1_sys: "data",
    }

    console.log('in_par', in_par);

    sysFetch(
      API,
      {
        pro,
        in_par,
        out_par
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
          dispatch(HideGlobalLoading);
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            // setItemChiTiet(rs.data.data[0]);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
    setTimeout(() => {
      const data1 = {
        pk: 2,
        avatar: 'https://zpsocial-f55-org.zadn.vn/4412dc9200a3e1fdb8b2.jpg',
        name: 'Đỗ Thị Hồng Nhung',
        code: '19055',
        type: 'CCCD',
        address: 'Số 1, đường 2, phường 3, quận 4, TP.HCM',
        dateCreate: '20/10/2021',
        img1: 'https://res.cloudinary.com/dn46v6yn9/image/upload/v1701424277/samples/nhrla7ph7hz7mvhs9vt7.png',
        img2: 'https://res.cloudinary.com/dn46v6yn9/image/upload/v1701424277/samples/nhrla7ph7hz7mvhs9vt7.png',
      };

      const data2 = {
        pk: 3,
        avatar: 'https://zpsocial-f55-org.zadn.vn/4412dc9200a3e1fdb8b2.jpg',
        name: 'Đỗ Thị Hồng Nhung',
        code: '19597',
        type: 'TNV',
        chucDanh: 'Nhân viên',
        phongBan: 'Phòng kinh doanh',
        ngayVaoLam: '20/10/2021',
        img1: 'https://res.cloudinary.com/dn46v6yn9/image/upload/v1701424277/samples/nhrla7ph7hz7mvhs9vt7.png',
        img2: 'https://res.cloudinary.com/dn46v6yn9/image/upload/v1701424277/samples/nhrla7ph7hz7mvhs9vt7.png',
      };

      if (type == 'CCCD') {
        setItemChiTiet(data1);
      } else {
        setItemChiTiet(data2);
      }
      // dispatch(HideGlobalLoading);
    }, 100);
  };

  const ItemThongTin = (label, value) => {
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
      }}>
        <Text style={{
          fontSize: 14,
          color: 'black',
          opacity: 0.8,
          flex: 1,
        }}>
          {label}:&nbsp;
        </Text>

        <Text style={{
          fontSize: 14,
          color: 'black',
          opacity: 0.8,
          flex: 1,
        }}>
          {value}
        </Text>
      </View>
    )
  };

  const ItemImage = (url, label) => {
    return (
      <View>
        <Text style={{
          fontSize: 16,
          color: 'black',
          fontWeight: 'bold',
          opacity: 0.8,
          marginBottom: 6,
          marginTop: 10,
        }}>
          {label}
        </Text>
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 6,
          width: widthScreen - 24,
          height: 250,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <Image
            source={{ uri: url }}
            style={{
              width: widthScreen - 24,
              height: 250,
            }}
            resizeMode="cover"
          />
        </View>
      </View>
    )
  }


  return (
    <View style={{
      flex: 1,
      backgroundColor: Color.background,
    }}>
      <TVSHeader goBack={goBack}>Chi tiết QR</TVSHeader>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginBottom: 60,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        {
          itemChiTiet ? (
            <View>

              {/* QR code */}
              <View style={{
                borderRadius: 12,
                backgroundColor: Color.gray,
                overflow: 'hidden',
                marginBottom: 20,
                height: 400,
                position: 'relative',
              }}>
                <Image
                  source={require('../../../../assets/images/bg_qrcode3.jpg')}
                  style={{
                    width: '100%',
                    height: 400,
                  }}
                />

                <View style={{
                  position: 'absolute',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  flexDirection: 'column',
                  height: '100%',
                  width: '100%',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                    <Image
                      source={{ uri: itemChiTiet.avatar }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                      }}
                    />
                    <Text style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      opacity: 0.6,
                      marginLeft: 10,
                    }}>
                      {
                        type == 'CCCD'
                          ? 'Chứng minh nhân dân' : 'Thẻ nhân viên'
                      }
                    </Text>
                  </View>

                  <View style={{
                    borderColor: 'white',
                    opacity: 0.6,
                    borderWidth: 0.5,
                    marginVertical: 6,
                  }} />

                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                    <QRCode
                      value={JSON.stringify(itemChiTiet)}
                      // value={itemChiTiet.pk.toString()}
                      logo={{ uri: itemChiTiet.avatar }}
                      logoSize={36}
                      logoBorderRadius={36}
                      logoBackgroundColor={Color.mainColor}
                      size={220}
                      ecl="L"
                    />

                  </View>

                  <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: 'bold',
                      opacity: 0.6,
                    }}>
                      {itemChiTiet.name}
                    </Text>

                    <Text style={{
                      fontSize: 16,
                      color: 'black',
                      opacity: 0.6,
                    }}>
                      Quét mã QR để xem thông tin
                    </Text>
                  </View>
                </View>
              </View>


              {/* Thông tin chi tiết */}
              <View style={{
                marginBottom: 20,
              }}>
                <View style={{}}>
                  <Text style={{
                    fontSize: 16,
                    color: 'black',
                    fontWeight: 'bold',
                    opacity: 0.8,
                    marginBottom: 10,
                  }}>
                    Thông tin chi tiết
                  </Text>
                </View>

                {
                  type == 'CCCD' ? (
                    <View>
                      {ItemThongTin('Họ và tên', itemChiTiet.name)}
                      {ItemThongTin('Số CCCD', itemChiTiet.code)}
                      {ItemThongTin('Địa chỉ', itemChiTiet.address)}
                      {ItemThongTin('Ngày cấp', itemChiTiet.dateCreate)}
                      {
                        itemChiTiet.img1 ? (
                          <View style={{ marginTop: 20 }}>
                            {ItemImage(itemChiTiet.img1, 'Mặt trước')}
                          </View>
                        ) : null
                      }
                      {
                        itemChiTiet.img2 ? (
                          <View>
                            {ItemImage(itemChiTiet.img2, 'Mặt sau')}
                          </View>
                        ) : null
                      }
                    </View>
                  ) : type == 'TNV' ? (
                    <View>
                      {ItemThongTin('Họ và tên', itemChiTiet.name)}
                      {ItemThongTin('Mã nhân viên', itemChiTiet.code)}
                      {ItemThongTin('Chức danh', itemChiTiet.chucDanh)}
                      {ItemThongTin('Phòng ban', itemChiTiet.phongBan)}
                      {ItemThongTin('Ngày vào làm', itemChiTiet.ngayVaoLam)}
                      {
                        itemChiTiet.img1 ? (
                          <View style={{ marginTop: 20 }}>
                            {ItemImage(itemChiTiet.img1, 'Mặt trước')}
                          </View>
                        ) : null
                      }
                      {
                        itemChiTiet.img2 ? (
                          <View>
                            {ItemImage(itemChiTiet.img2, 'Mặt sau')}
                          </View>
                        ) : null
                      }
                    </View>
                  ) : null
                }

              </View>
            </View>
          ) : null
        }


      </ScrollView>
      {/* Button */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: Color.gray,
        width: '100%',
        borderTopColor: 'white',
        borderTopWidth: 0.5,
        height: 60,
      }}>
        <TVSButton
          type="secondary"
          onPress={() => handleShare()}
          icon={'share-outline'}
          buttonStyle="3"
        >
          Chia sẻ
        </TVSButton>

        <TVSButton
          type="primary"
          onPress={() => handleSave()}
          icon={'cloud-download-outline'}
          buttonStyle="3"
        >
          Lưu
        </TVSButton>
      </View>

    </View>
  )
}

export default QRDetail