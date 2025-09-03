import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  Easing,
} from "react-native";
import Block from "../../../../components/Block";
import MaterialComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const index = ({ item, onSelect }) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const avatar = item.avatar
    ? "data:image/png;base64," + item.avatar
    : "data:image/png;base64," + item.avatar2;
  let color = "black";
  switch (item.trangthai_code) {
    case "01": //mau vang (can thuc hien)
      color = "#D2691E";
      break;
    case "02": // dang thuc hien
      color = "#17a2b8";
      break;
    case "03": //mau xanh
      color = "#2262e3";
      break;
    case "04": // chua hoan thanh
      color = "#800080";
      break;
    case "05": //da huy bo
      color = "red";
      break;
    default: //mau den (da kiem xong)
      color = "#28A745";
      break;
  }

  const deadline_date = item.deadline_date
    ? item.deadline_date
    : "Không thời hạn";
  let strRate = "";
  if (item.rate_finish == 0 && item.trangthai_code == "01") {
    strRate = "";
  }
  if (item.rate_finish == 0 && item.trangthai_code != "01") {
    strRate = "0%";
  }
  if (item.rate_finish != 0 && item.trangthai_code != "01") {
    strRate = item.rate_finish + "%";
  }
  if (item.rate_finish == 0 && item.trangthai_code == "05") {
    strRate = "";
  }
  const strTrangThai = item.trangthai_name + " " + strRate;

  const [progress, setProgress] = useState(new Animated.Value(0));
  const [targetProgress, setTargetProgress] = useState(
    item.rate_finish ? item.rate_finish : 0
  );
  const [widthInterpolate, setWidthInterpolate] = useState(
    progress.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    })
  );

  const onAnimate = () => {
    Animated.timing(progress, {
      toValue: targetProgress, // Sử dụng giá trị mục tiêu từ state
      duration: 500, // Thời gian để đạt được giá trị mục tiêu
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    onAnimate();
  }, [targetProgress]);

  useEffect(() => {
    setTargetProgress(item.rate_finish ? item.rate_finish : 0);
  }, [item.rate_finish]);

  return (
    <TouchableOpacity
      style={{
        marginTop: 2,
        backgroundColor: Color.white,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: Color.gray,
        // borderRadius: 6,
      }}
      onPress={() => onSelect(item)}
    >
      <Block flex row={true}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: Color.gray,
            borderWidth: 1,
            borderColor: "#ddd",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: avatar }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 45,
            }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            paddingHorizontal: 10,
            flex: 1,
          }}
        >
          <Text
            numberOfLines={1}
            overflow="hidden"
            marginRight={10}
            style={{
              fontWeight: "600",
              marginBottom: 6,
              fontSize: 15,
            }}
          >
            {item.ten_duan}
          </Text>
          <Text
            numberOfLines={1}
            overflow="hidden"
            marginRight={10}
            style={{
              color: "#3d3d3d",
              marginBottom: 6,
              fontSize: 14,
            }}
          >
            {item.tencv}
          </Text>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
            <MaterialComunityIcons
              name="calendar-clock"
              size={14}
              color="#3d3d3d"
            />
            <Text
              style={{
                color: "#3d3d3d",
                fontSize: 14,
                marginLeft: 5,
              }}
            >
              {deadline_date}
            </Text>
          </View>

          {item.trangthai_code == "01" || item.trangthai_code == "05" ? (
            <Text
              style={{
                color: color,
                fontSize: 14,
                fontWeight: "600",
                marginTop: 6,
              }}
            >
              {strTrangThai}
            </Text>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  width: 150,
                  height: 10,
                  backgroundColor: "white",
                  borderColor: "#ddd",
                  borderWidth: 1,
                  borderRadius: 5,
                }}
              >
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      left: 0,
                      height: 8,
                      width: targetProgress + "%",
                      zIndex: 1,
                      backgroundColor: color,
                      borderRadius: 5,
                    },
                    {
                      width: widthInterpolate,
                    },
                  ]}
                />
              </View>
              <Text
                style={{
                  color: color,
                  fontSize: 14,
                  fontWeight: "600",
                  marginLeft: 10,
                }}
              >
                {strRate}
              </Text>
            </View>
          )}
        </View>
      </Block>
    </TouchableOpacity>
  );
};

export default index;
