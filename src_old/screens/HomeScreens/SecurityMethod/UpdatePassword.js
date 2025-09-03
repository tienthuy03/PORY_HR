import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import md5 from "md5";
import NetInfo from "@react-native-community/netinfo";
import Block from "../../../components/Block";
import Button from "../../../components/Button.js";
import TVSHeader from "../../../components/Tvs/Header";
import TVSButton from "../../../components/Tvs/Button";
import { ScrollView, Text, View, TextInput, Alert } from "react-native";
import EyeClose from "../../../icons/EyeClose";
import EyeOpen from "../../../icons/EyeOpen";
import Icon_pass from "../../../icons/Password";
import sysFetch from "../../../services/fetch";
import axios from "axios";
import DefaultPreference from "react-native-default-preference";
import RNRestart from "react-native-restart";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../services/redux/GlobalLoading/action";
import { updateUserAction } from "../../../actions";

const UpdatePassword = ({ navigation: { goBack } }) => {
    const dispatch = useDispatch();
    const Color = useSelector((s) => s.SystemReducer.theme);
    const state = useSelector((state) => state);
    const API = useSelector((state) => state.SysConfigReducer.API_URL);
    let language;
    let loadLanguage;
    let user_name;
    let pass;
    let fullname;
    let emp_pk;
    let dataLanguage;
    try {
        loadLanguage = state.languageReducer.isLoading;
        language =
            state.loginReducers.data.data.user_language == undefined
                ? "VIE"
                : state.loginReducers.data.data.user_language;
        user_name = state.loginReducers.user_name;
        pass = state.loginReducers.pass_word;
        fullname = state.loginReducers.data.data.full_name;
        tokenss = state.loginReducers.data.data.tokenLogin;
        emp_pk = state.loginReducers.data.data.thr_emp_pk;
        dataLanguage = state.languageReducer.data.data.language;
    } catch (error) {
        //
    }
    let tokenLogin = useSelector(
        (state) => state.loginReducers.data.data.tokenLogin
    );
    let userPk = useSelector(
        (state) => state.loginReducers.data.data.tes_user_pk
    );
    let refreshToken = useSelector(
        (state) => state.loginReducers.data.data.refreshToken
    );


    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [eye1, setEye1] = useState(true);
    const [eye2, setEye2] = useState(true);
    const [eye3, setEye3] = useState(true);

    const dialogNoti = (message) => {
        Alert.alert("Thông báo", message, [{ text: "Thoát" }], {
            cancelable: false,
        });
    };

    const validateInput = () => {
        if (password === "") {
            dialogNoti("Vui lòng nhập mật khẩu cũ!");
            return;
        }
        if (newPassword === "") {
            dialogNoti("Vui lòng nhập mật khẩu mới!");
            return;
        }
        if (confirmPassword === "") {
            dialogNoti("Vui lòng nhập mật khẩu xác nhận!");
            return;
        }

        if (newPassword !== confirmPassword) {
            dialogNoti("Xác nhận mật khẩu không trùng khớp!");
            return;
        }

        Alert.alert(
            "Đổi mật khẩu",
            "Bạn có muốn đổi mật khẩu?",
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
                                updatePass();
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

    const updatePass = async () => {
        dispatch(ShowGlobalLoading);
        let pass_old = md5(password);
        let pass_new = md5(newPassword);

        console.log({
            p1_varchar2: user_name,
            p2_varchar2: pass_old,
            p3_varchar2: pass_new,
        })
        sysFetch(
            API,
            {
                pro: "UPDGSAU0040100",
                in_par: {
                    p1_varchar2: user_name,
                    p2_varchar2: pass_old,
                    p3_varchar2: pass_new,
                },
                out_par: {
                    p1_varchar2: "alert",
                    p2_varchar2: "output",
                },
            },
            tokenLogin
        )
            .then((rs) => {
                dispatch(HideGlobalLoading);
                if (rs == "Token Expired") {
                    refreshNewToken("updatePass", null);
                }
                if (rs != "Token Expired") {
                    if (rs.results === "S") {
                        if (rs.data.output === "Y") {
                            Alert.alert("Thông báo", rs.data.alert, [
                                {
                                    text: "Thoát",
                                    onPress: async () => {
                                        setTimeout(async () => {
                                            goBack();
                                            deleteDataUser();
                                        }, 0);
                                    },
                                },
                            ]);
                        } else if (rs.data.output === "N") {
                            Alert.alert("Thông báo", rs.data.alert, [
                                {
                                    text: "Thoát",
                                    onPress: async () => {
                                        goBack();
                                    },
                                },
                            ]);
                        }
                    }
                    if (rs.results === "F") {
                        Alert.alert("Thông báo", "Hệ thống lỗi!", [
                            {
                                text: "Thoát",
                                onPress: async () => {
                                    goBack();
                                    console.log("Error");
                                },
                            },
                        ]);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteDataUser = async () => {
        axios
            .post(API + "User/RevokeToken/", {
                token: tokenLogin,
                userPk: userPk,
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
                if (error == "AxiosError: Request failed with status code 401") {
                    refreshNewToken("deleteDataUser");
                }
                console.log("error logout ", error);
            });
    };

    const refreshNewToken = (obj, p1) => {
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
                if (obj == "updatePass") {
                    updatePass();
                }
                if (obj == "deleteDataUser") {
                    deleteDataUser();
                }
            })
            .catch((error) => {
                if (
                    error == "AxiosError: Request failed with status code 400" &&
                    obj !== "deleteDataUser"
                ) {
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
                if (
                    error == "AxiosError: Request failed with status code 400" &&
                    obj == "deleteDataUser"
                ) {
                    console.log("error refresh ", error);
                    DefaultPreference.set("logout", "true");

                    RNRestart.Restart();
                }
            });
    };


    return (
        <Block flex backgroundColor={Color.backgroundColor}>
            <TVSHeader goBack={goBack}>Đổi mật khẩu</TVSHeader>
            <Block flex backgroundColor={Color.white}>
                <View style={{
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: 'black',
                        opacity: 0.6,
                        paddingHorizontal: 10,
                        paddingVertical: 15
                    }}>
                        Mật khẩu phải từ 4 đến 20 ký tự, bao gồm chữ cái và số
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        marginTop: 10,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: 'black',
                            opacity: 0.8,
                            paddingHorizontal: 10
                        }}>
                            Mật khẩu hiện tại
                        </Text>

                        <Block
                            marginHorizontal={10}
                            paddingLeft={10}
                            alignCenter
                            row
                            backgroundColor={Color.gray}
                            radius={12}
                            marginTop={10}
                        >
                            <Icon_pass />
                            <TextInput
                                style={{ flex: 1, }}
                                size={15}
                                height={55}
                                paddingLeft={15}
                                placeholder={"Nhập mật khẩu hiện tại"}
                                autoCompleteType={"password"}
                                color={Color.mainColor}
                                placeholderTextColor={Color.grayPlahoder}
                                secureTextEntry={eye1}
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                            />
                            <Button
                                justifyCenter
                                height={30}
                                width={30}
                                nextScreen={() => setEye1(!eye1)}
                            >
                                {eye1 ? <EyeOpen /> : <EyeClose />}
                            </Button>
                        </Block>


                        <Text style={{
                            fontSize: 14,
                            color: 'black',
                            opacity: 0.8,
                            paddingHorizontal: 10,
                            marginTop: 20
                        }}>
                            Mật khẩu mới
                        </Text>

                        <Block
                            marginHorizontal={10}
                            paddingLeft={10}
                            alignCenter
                            row
                            backgroundColor={Color.gray}
                            radius={12}
                            marginTop={10}
                        >
                            <Icon_pass />
                            <TextInput
                                style={{ flex: 1, paddingLeft: 15}}
                                size={15}
                                height={55}
                                paddingLeft={15}
                                placeholder={"Nhập mật khẩu mới"}
                                autoCompleteType={"password"}
                                color={Color.mainColor}
                                placeholderTextColor={Color.grayPlahoder}
                                secureTextEntry={eye2}
                                value={newPassword}
                                onChangeText={(text) => setNewPassword(text)}
                            />
                            <Button
                                justifyCenter
                                height={30}
                                width={30}
                                nextScreen={() => setEye2(!eye2)}
                            >
                                {eye2 ? <EyeOpen /> : <EyeClose />}
                            </Button>
                        </Block>

                        <Block
                            marginHorizontal={10}
                            paddingLeft={10}
                            alignCenter
                            row
                            backgroundColor={Color.gray}
                            marginTop={4}
                            radius={12}
                        >
                            <Icon_pass />
                            <TextInput
                                style={{ flex: 1, }}
                                size={15}
                                height={55}
                                paddingLeft={15}
                                placeholder={"Nhập mật khẩu mới"}
                                autoCompleteType={"password"}
                                color={Color.mainColor}
                                placeholderTextColor={Color.grayPlahoder}
                                secureTextEntry={eye3}
                                value={confirmPassword}
                                onChangeText={(text) => setConfirmPassword(text)}
                            />
                            <Button
                                justifyCenter
                                height={30}
                                width={30}
                                nextScreen={() => setEye3(!eye3)}
                            >
                                {eye3 ? <EyeOpen /> : <EyeClose />}
                            </Button>
                        </Block>

                        <View style={{
                            marginVertical: 20,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }} >
                            <TVSButton
                                paddingHorizontal={80}
                                paddingVertical={15}
                                borderRadius={30}
                                type={"login"}
                                onPress={() => validateInput()}
                            >
                                <Text style={{ color: "white", fontSize: 16 }}>
                                    Cập nhật
                                </Text>
                            </TVSButton>
                        </View>



                    </View>


                </ScrollView>
            </Block>
        </Block>
    )
}

export default UpdatePassword;