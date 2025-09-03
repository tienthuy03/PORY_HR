import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Person from "../../../icons/Person";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import TVSControlPopup from "../../../components/Tvs/ControlPopup";
import DeafaultPreference from "react-native-default-preference";
import { ntProcessNotification } from "../../../services/redux/Notification/action";
import { useNavigation } from "@react-navigation/native";
import PopupPDF from "./Popup_PDF";
import PopupIMG from "./Popup_IMG";

const OneNotificationItem = ({ item, key }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { image } = useSelector((state) => state.NotificationReducer);
  const currentImageArr = image
    ? image.filter((x) => x.thr_emp_pk === item.from_emp_pk)
    : [];
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPDFVisible, setModalPDFVisible] = useState(false);
  const displayTime = (time) => {
    if (!item) {
      return "";
    }

    const ymd = moment(new Date()).format("YYYYMMDD") - time.substr(0, 8);

    switch (ymd) {
      case 0:
        const mnt =
          parseInt(moment(new Date()).format("HHmm")) - time.substr(8, 4);

        if (mnt < 60) {
          return `${mnt} Phút trước`;
        } else {
          if (mnt < 200) {
            return `1 Giờ trước`;
          } else {
            return `${Math.floor(mnt / 100)} Giờ trước`;
          }
        }
      case 1:
        return `${moment(time, "YYYYMMDDHHmmss").format("HH:mm:ss")} Hôm qua`;
      default:
        return moment(time, "YYYYMMDDHHmmss").format("HH:mm:ss DD/MM/YYYY");
    }
  };
  const Color = useSelector((s) => s.SystemReducer.theme);
  const arrContent = item.content.split("*");
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
  //handle show one item notification
  const onShow = () => {
    console.log("onmshow");
    try {
      DeafaultPreference.get("readNoti").then((rs) => {
        if (rs) {
          const arrTemp = rs.split("|");
          if (arrTemp.indexOf(item.ann_emp_pk.toString()) < 0) {
            const temp = rs + "|" + item.ann_emp_pk;
            DeafaultPreference.set("readNoti", temp);
          }
        }
      });
    } catch (error) {}
    setModalVisible(true);
  };
  const modalPDF = (
    <PopupPDF
      title={"File đính kèm"}
      isShow={modalPDFVisible}
      dataPDF={item.pdf_content}
      onHide={() => {
        setModalPDFVisible(false);
        setTimeout(function () {
          setModalVisible(true);
        }, 0);
      }}
    ></PopupPDF>
  );
  const modal = (
    <TVSControlPopup
      scrollable={true}
      isShow={modalVisible}
      onHide={() => {
        dispatch(ntProcessNotification());
        setModalVisible(false);
      }}
      title={"Nội dung thông báo"}
    >
      <View style={{ paddingBottom: 30 }}>
        {arrContent.map((x) => (
          <Text
            style={{
              marginBottom: 5,
            }}
          >
            {x.toString().trim()}
          </Text>
        ))}
        <Text
          style={{
            paddingTop: 10,
            color: "#808080",
          }}
        >
          <Icon name={"calendar"} /> {displayTime(item.post_dt)}
        </Text>
        {item.file_yn == "Y" ? (
          item.image_yn == "Y" ? (
            <TouchableOpacity
              onPress={() => {
                console.log(item.pdf_content);
                setIMGContent(item.pdf_content);
                // setModalIMGVisible(true);
                setTimeout(function () {
                  setModalIMGVisible(true);
                }, 0);
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
              style={{
                paddingTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={() => {
                setModalVisible(false);
                setTimeout(function () {
                  setModalPDFVisible(true);
                }, 0);
              }}
            >
              <View>
                <Text
                  style={{
                    color: Color.mainColor,
                    textDecorationLine: "underline",
                  }}
                >
                  File đính kèm
                </Text>
              </View>
            </TouchableOpacity>
          )
        ) : null}
        {item.url_id ? (
          <TouchableOpacity
            style={{
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={0.7}
            onPress={() => {
              dispatch(ntProcessNotification());
              setModalVisible(false);
              navigation.navigate(item.url_id);
            }}
          >
            <Text
              style={{
                color: Color.mainColor,
                textDecorationLine: "underline",
              }}
            >
              Xem chi tiết
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TVSControlPopup>
  );
  return (
    <View key={key}>
      {modal}
      {modalPDF}
      {modalIMG}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onShow}
        style={{
          padding: 10,
          borderRadius: 10,
          backgroundColor: item.read_yn === "N" ? "#EBF5FB" : "white",
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
          }}
        >
          {currentImageArr.length > 0 ? (
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 50,
              }}
              source={{
                uri: "data:image/png;base64," + currentImageArr[0].image,
              }}
            />
          ) : (
            <Person />
          )}
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <View
            style={{
              marginHorizontal: 10,
              flex: 1,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: Color.mainColor,
                marginBottom: 5,
              }}
            >
              {item.title}
            </Text>
            <Text style={{ marginBottom: 5 }}>
              {item.from_emp_name} - {item.from_org_nm}
            </Text>
            <Text style={{ fontSize: 12, marginBottom: 5, color: "#808080" }}>
              {displayTime(item.post_dt)}
            </Text>
          </View>
          {item.file_yn == "Y" ? (
            <View>
              <Icon
                color={item.read_yn === "Y" ? "#808080" : "#F5B041"}
                size={25}
                name={"attachment"}
              />
            </View>
          ) : null}
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 5,
            right: 10,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            color={item.read_yn === "Y" ? "#808080" : "#F5B041"}
            size={8}
            name={"checkbox-blank-circle"}
          />
          <Text
            style={{
              color: item.read_yn === "Y" ? "#808080" : null,
              fontSize: 12,
            }}
          >
            {item.read_yn === "Y" ? " Đã xem" : " Chưa xem"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OneNotificationItem;
