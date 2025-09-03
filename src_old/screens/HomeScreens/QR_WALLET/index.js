import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MaterialComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TVSHeader from "../../../components/Tvs/Header";

const QR_Wallet = ({ navigation: { goBack } }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const Color = useSelector((s) => s.SystemReducer.theme);
  const qrDefault = useSelector((s) => s.qrWalletReducer.data.payload);

  const loginReducers = useSelector((state) => state.loginReducers);
  let urlImageLogin;
  let fullnameLogin;
  let empIdLogin;
  try {
    urlImageLogin = loginReducers.data.data.avatar;
    fullnameLogin = loginReducers.data.data.full_name;
    empIdLogin = loginReducers.data.data.emp_id;
  } catch (error) {
    console.log("error home main2");
    console.log(error);
  }

  // --------Danh sach QR code -------------
  const [itemDeXuat, setItemDeXuat] = useState({});
  const [listQrData, setListQrData] = useState([]);

  useEffect(() => {
    // const list = [
    //   {
    //     pk: 1,
    //     type: "TNV",
    //     nameQR: "Thẻ nhân viên",
    //     avatar: "https://zpsocial-f55-org.zadn.vn/4412dc9200a3e1fdb8b2.jpg",
    //     name: "Đỗ Thị Hồng Nhung",
    //     code: "123456789",
    //     qrcode:
    //       "https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png",
    //   },
    //   {
    //     pk: 2,
    //     type: "CCCD",
    //     nameQR: "CMND/CCCD",
    //     avatar: "https://zpsocial-f55-org.zadn.vn/4412dc9200a3e1fdb8b2.jpg",
    //     name: "Đỗ Thị Hồng Nhung",
    //     code: "123456789",
    //     qrcode:
    //       "https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png",
    //   },
    // ];
    // setListQrData(list);
    // if (list.length == 1) {
    //   setItemDeXuat(list[0]);
    // } else if (list.length > 1) {
    //   setItemDeXuat(list[list.length - 1]);
    // } else {
    //   setItemDeXuat(null);
    // }
  }, []);

  const onRenderNoItem = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "black",
            opacity: 0.6,
          }}
        >
          Không có dữ liệu
        </Text>
      </View>
    );
  };

  const ItemQR = ({ color, item, itemBottom }) => {
    return (
      //   <View>
      //     {itemBottom ? (
      //       <TouchableOpacity
      //         onPress={() =>
      //           navigation.navigate("QR_Detail", {
      //             pk_detail: itemBottom.pk,
      //             type: itemBottom.type,
      //           })
      //         }
      //       >
      //         <View
      //           style={{
      //             position: "relative",
      //           }}
      //         >
      //           <Image
      //             source={require("../../../assets/images/bg_qrcode3.jpg")}
      //             style={{
      //               width: "100%",
      //               height: 180,
      //             }}
      //           />
      //           <View
      //             style={{
      //               position: "absolute",
      //               top: 10,
      //               flexDirection: "row",
      //               left: 10,
      //               justifyContent: "center",
      //               alignItems: "center",
      //             }}
      //           >
      //             <Image
      //               source={{ uri: itemDeXuat.avatar }}
      //               style={{
      //                 width: 50,
      //                 height: 50,
      //                 borderRadius: 12,
      //               }}
      //             />
      //             <Text
      //               style={{
      //                 fontSize: 16,
      //                 color: "black",
      //                 fontWeight: "bold",
      //                 opacity: 0.6,
      //                 marginLeft: 10,
      //               }}
      //             >
      //               {itemDeXuat.nameQR}
      //             </Text>
      //           </View>

      //           <View
      //             style={{
      //               position: "absolute",
      //               bottom: 10,
      //               flexDirection: "row",
      //               right: 10,
      //               left: 10,
      //               justifyContent: "space-between",
      //               alignItems: "center",
      //             }}
      //           >
      //             <View
      //               style={{
      //                 flexDirection: "column",
      //                 justifyContent: "flex-end",
      //                 height: 60,
      //               }}
      //             >
      //               <Text
      //                 style={{
      //                   fontSize: 14,
      //                   color: "black",
      //                   fontWeight: "bold",
      //                   opacity: 0.6,
      //                 }}
      //               >
      //                 {itemDeXuat.name}
      //               </Text>
      //               <Text
      //                 style={{
      //                   fontSize: 14,
      //                   color: "black",
      //                   opacity: 0.6,
      //                 }}
      //               >
      //                 {itemDeXuat.code}
      //               </Text>
      //             </View>

      //             <View>
      //               <Image
      //                 source={{ uri: itemDeXuat.qrcode }}
      //                 style={{
      //                   width: 80,
      //                   height: 80,
      //                   borderRadius: 4,
      //                 }}
      //               />
      //             </View>
      //           </View>
      //         </View>
      //       </TouchableOpacity>
      //     ) : (
      //       <TouchableOpacity onPress={() => handleClickItem(item)}>
      //         <View
      //           style={{
      //             flexDirection: "row",
      //             backgroundColor: color ? color : Color.gray,
      //           }}
      //         >
      //           <Image
      //             source={{ uri: item.avatar }}
      //             style={{
      //               width: 50,
      //               height: 50,
      //               borderRadius: 12,
      //               margin: 10,
      //             }}
      //           />
      //           <View
      //             style={{
      //               flex: 1,
      //               justifyContent: "center",
      //               overflow: "hidden",
      //               paddingRight: 10,
      //             }}
      //           >
      //             <Text
      //               numberOfLines={1}
      //               style={{
      //                 fontSize: 16,
      //                 color: "white",
      //                 fontWeight: "bold",
      //               }}
      //             >
      //               {item.nameQR}
      //             </Text>
      //           </View>
      //         </View>
      //       </TouchableOpacity>
      //     )}
      //   </View>
      null
    );
  };

  // useEffect(() => {
  //     if (qrDefault) {
  //         setItemDeXuat(qrDefault);
  //     }
  // }, [qrDefault]);

  const handleClickItem = (item) => {
    setListQrData([...listQrData.filter((i) => i.pk !== item.pk), item]);
    setItemDeXuat(item);
    navigation.navigate("QR_Detail", { pk_detail: item.pk, type: item.type });
  };

  return (
    <View
      style={{
        flex: 1,
        color: Color.backgroundColor,
      }}
    >
      <TVSHeader goBack={goBack}>Ví QR code</TVSHeader>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: Color.gray,
          paddingVertical: 10,
          paddingHorizontal: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text>test</Text>
        </View>
        {/* <View style={{
                    borderRadius: 12,
                    backgroundColor: Color.gray,
                    overflow: 'hidden',
                }}>
                    {
                        listQrData.length > 0 ?
                            listQrData.map((item, index) => {
                                return (
                                    <ItemQR
                                        key={index}
                                        item={item}
                                        itemBottom={index == listQrData.length - 1}
                                        color={
                                            index == 1 ? '#008080' :
                                                index == 2 ? '#808000' :
                                                    index == 3 ? '#800080' :
                                                        Color.mainColor
                                        }
                                    />
                                )
                            }) : onRenderNoItem()
                    }
                </View> */}
      </ScrollView>

      {/* Button */}
      {/* <MaterialComunityIcons
                name="plus-circle"
                size={50}
                color={Color.mainColor}
                onPress={() => handleAdd()}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    zIndex: 999,
                }}
            /> */}
    </View>
  );
};

export default QR_Wallet;
