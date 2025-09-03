import NetInfo from "@react-native-community/netinfo";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import DefaultPreference from "react-native-default-preference";
import { Badge } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLanguageAction,
  fetchMenuAction,
  fetchTTCNAction,
} from "../../actions";
import { deviceId } from "../../constants/index";
import ShowError from "../../services/errors";
import Dashboard from "../HomeScreens/Dashboard";
import HomeScreen from "../HomeScreens/HomeMain";
import NotiScreen from "../HomeScreens/NotificationMain";
import SystemScreen from "../HomeScreens/SystemMain";
import QRCodeScreen from "./QRCodeScreen";

import IconHome from "../../icons/Menu/BieuDoThongKe";

// const Tab = createBottomTabNavigator();
// const Tab = createMaterialTopTabNavigator();
const Tab = createBottomTabNavigator();
const Index = () => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const dispatch = useDispatch();
  // const navigation = useNavigation();
  const state = useSelector((state) => state.loginReducers);
  const { notification, notificationGen, notificationSys, countNotiTab } =
    useSelector((state) => state.NotificationReducer);
  const languageReducer = useSelector((state) => state.languageReducer);
  const menuReducer = useSelector((state) => state.menuReducer);
  const [system, setSystem] = useState("Tài khoản");
  const [home, setHome] = useState("Trang chủ");
  const [noti, setNoti] = useState("Thông báo");
  const [DashboardTitle, setDashboardTitle] = useState("Bảng tin");
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  let fullname;
  let tokenLogin;
  let thr_emp_pk;
  let language;
  let dataLanguage;
  let tes_user_pk;
  let user_name;
  let loadMenu;
  let loadLanguage;
  let login_status;
  try {
    fullname = state.data.data.full_name;
    user_name = state.user_name;
    tes_user_pk = state.data.data.tes_user_pk;
    tokenLogin = state.data.data.tokenLogin;
    thr_emp_pk = state.data.data.thr_emp_pk;
    loadMenu = menuReducer.isLoading;
    login_status = state.data.data.login_status;
    // PushNotificationIOS
  } catch (error) {}

  try {
    language = state.data.data.user_language;
    dataLanguage = languageReducer.data.data.language;
    loadLanguage = languageReducer.isLoading;
  } catch (error) {}

  useEffect(() => {
    console.log("get DefaultPreference");
    DefaultPreference.getAll().then((valueAll) => {
      console.log("valueAll.status ====> ", valueAll.status);
      console.log("valueAll.temp ====> ", valueAll.temp);
      console.log("valueAll.nameAuthen ====> ", valueAll.nameAuthen);

      if (valueAll.status === "" || valueAll.status === undefined) {
        DefaultPreference.set("status", "11");
        console.log("confirm fast login");
      }
    });
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        DefaultPreference.set("fullname", fullname);
        DefaultPreference.set("username", user_name);
        DefaultPreference.set("tokenLogin", tokenLogin);
        DefaultPreference.set("API", API);
        dispatch(
          fetchMenuAction({
            token: tokenLogin,
            machine_id: deviceId,
            tes_user_pk: tes_user_pk,
            thr_emp_pk: thr_emp_pk,
            user_name: user_name,
          })
        );
        dispatch(
          fetchLanguageAction({
            token: tokenLogin,
            machine_id: deviceId,
          })
        );
        dispatch(
          fetchTTCNAction({
            token: tokenLogin,
            machine_id: deviceId,
            userPK: thr_emp_pk,
            fullname: fullname,
          })
        );
      } else {
        ShowError("No internet");
      }
    });
  }, []);
  useEffect(() => {
    try {
      languageReducer.data.data.language.filter((item) => {
        var lowerLanguage = language.toLowerCase();
        if (item.field_name === "account") {
          setSystem(item[lowerLanguage]);
        }
        if (item.field_name === "notification") {
          setNoti(item[lowerLanguage]);
        }
        if (item.field_name === "dashboard") {
          setDashboardTitle(item[lowerLanguage]);
        }
        if (item.field_name === "home") {
          setHome(item[lowerLanguage]);
        }
      });
    } catch (error) {}
  }, [languageReducer]);
  //handle noti count
  useEffect(() => {
    const handleFirstLoadData = async () => {
      DefaultPreference.get("countNotiTab").then((rs) => {
        if (!rs) {
          DefaultPreference.set("countNotiTab", "0-0");
        }
      });
    };
    // DefaultPreference.clear('countNotiTab');
    handleFirstLoadData();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        initialRouteName: { home },
        activeTintColor: "#2f95dc",
        inactiveTintColor: "gray",
        tabBarActiveTintColor: Color.mainColor,
        showIcon: true,
        showLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingBottom: Platform.OS == "ios" ? 25 : 5,
          paddingTop: 5,
          height: Platform.OS == "ios" ? 70 : 50,
        },
      }}
      // tabBarOptions={{
      //   initialRouteName: "Home",
      //   activeTintColor: "#2f95dc",
      //   inactiveTintColor: "gray",
      //   showIcon: true,
      //   showLabel: false,
      //   style: {
      //     backgroundColor: "#fff",
      //     borderTopWidth: 1,
      //     borderTopColor: "#ccc",
      //   },
      // }}
    >
      <Tab.Screen
        name={home}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"home"}
                  color={Color.mainColor}
                />
              </View>
            ) : (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"home"}
                  color={Color.grayPlahoder}
                />
              </View>
            ),
        }}
      />
      {/* DashBoard START */}
      <Tab.Screen
        name={DashboardTitle}
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"clipboard-text-multiple"}
                  color={Color.mainColor}
                />
              </View>
            ) : (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"clipboard-text-multiple"}
                  color={Color.grayPlahoder}
                />
              </View>
            ),
        }}
      />
      {/* QRCode */}
      <Tab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View
                style={[
                  styles.tabs,
                  {
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderWidth: 2,
                    borderColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    top: -10,
                    backgroundColor: Color.gray,
                  },
                ]}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 10,
                    shadowColor: Color.grayPlahoder,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <MaterialCommunityIcons
                    size={30}
                    name={"qrcode"}
                    color={Color.mainColor}
                  />
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.tabs,
                  {
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    borderWidth: 2,
                    borderColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    top: -10,
                    backgroundColor: Color.gray,
                  },
                ]}
              >
                <View
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 10,
                    shadowColor: Color.grayPlahoder,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <MaterialCommunityIcons
                    size={30}
                    name={"qrcode"}
                    color={Color.grayPlahoder}
                  />
                </View>
              </View>
            ),
        }}
      />
      {/* DashBoard END */}
      <Tab.Screen
        name={noti}
        component={NotiScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"bell"}
                  color={Color.mainColor}
                />
                <View style={styles.tabIcon}>
                  {countNotiTab > 0 && (
                    <Badge
                      value={countNotiTab}
                      status="error"
                      textStyle={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "white",
                      }}
                    />
                  )}
                </View>
              </View>
            ) : (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"bell"}
                  color={Color.grayPlahoder}
                />
                <View style={styles.tabIcon}>
                  {countNotiTab > 0 && (
                    <Badge
                      value={countNotiTab}
                      status="error"
                      textStyle={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "white",
                      }}
                    />
                  )}
                </View>
              </View>
            ),
        }}
      />
      <Tab.Screen
        name={system}
        component={SystemScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"account"}
                  color={Color.mainColor}
                />
              </View>
            ) : (
              <View style={[styles.tabs]}>
                <MaterialCommunityIcons
                  size={24}
                  name={"account"}
                  color={Color.grayPlahoder}
                />
                {/* <Text
                  style={{
                    color: Color.grayPlahoder,
                    fontFamily: "Roboto-Medium",
                    fontSize: 12,
                  }}
                >
                  {system}
                </Text> */}
              </View>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabs: {
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  tabIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    paddingTop: 0,
    paddingLeft: 25,
  },
});

export default Index;
