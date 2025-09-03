import moment from "moment";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Image, Alert } from "react-native";
import { Slider } from '@miblanchard/react-native-slider';
import RenderHtml from "react-native-render-html";
import Text from "../../../../../components/Text";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import TVSHeader from "../../../../../components/Tvs/Header";
import Block from "../../../../../components/Block";
import TVSButton from "../../../../../components/Tvs/Button";
import sysFetch from "../../../../../services/fetch_v1";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import {
    HRWO002Reload
} from "../../../../../services/redux/HRWO002_CongViecThucHien/action";

const ChiTietCongViec = ({ route }) => {
    const { itemCongViec } = route.params;
    // ------------------REDUX------------------------
    const navigation = useNavigation();
    const API = useSelector((state) => state.SysConfigReducer.API_URL);
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
    const dispatch = useDispatch();
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
    } catch (error) { }
    // ------------------END REDUX------------------------

    // ------------------STATE------------------------
    const avatar = itemCongViec.avatar ? itemCongViec.avatar : "N";
    const nguoiThucHien = itemCongViec.nguoiThucHien ? itemCongViec.nguoiThucHien : [];
    const nguoiTheoDoi = itemCongViec.nguoiTheoDoi ? itemCongViec.nguoiTheoDoi : [];
    const listHoatDong = itemCongViec.listHoatDong ? itemCongViec.listHoatDong : [];
    let quaHan = false;
    let soGioQuaHan = 0;
    let soNgayQuaHan = 0;
    let soGioConLai = 0;
    let soNgayConLai = 0;
    let strTrangThaiCongViec = "";
    let color = "black";
    const colorBorderBottom = "#ddd";
    const fontLable = "600";
    const fontSizeLable = 15;

    switch (itemCongViec.trangthai_code) {
        case "01": //mau vang
            color = "#D2691E";
            break;
        case "02": //mau do
            color = Color.primaryColor;
            break;
        case "03": //mau xanh
            color = Color.green;
            break;
        case "04": //mau tim
            color = "#800080";
            break;
        case "05": //mau tim
            color = "red";
            break;
        default: //mau den
            color = Color.black;
            break;
    }
    if (itemCongViec.deadline_date) {
        const deadline_date = itemCongViec.deadline_date;
        const deadline = moment(deadline_date, "HH:mm - DD/MM/YYYY");
        const ngayHoanThanh = itemCongViec.finish_date
            ? itemCongViec.finish_date
            : "";
        if (ngayHoanThanh != "") {
            const finish_date = moment(ngayHoanThanh, "HH:mm - DD/MM/YYYY");
            const diff = deadline.diff(finish_date);
            if (diff < 0) {
                quaHan = true;
                soNgayQuaHan = deadline.diff(finish_date, "days");
                soGioQuaHan = deadline.diff(finish_date, "hours") - soNgayQuaHan * 24;
                if (soNgayQuaHan == 0) {
                    strTrangThaiCongViec = "Quá hạn "
                        + Math.abs(soGioQuaHan) + " giờ";
                } else {
                    strTrangThaiCongViec = "Quá hạn "
                        + Math.abs(soNgayQuaHan) + " ngày "
                        + Math.abs(soGioQuaHan) + " giờ";
                }
            } else {
                quaHan = false;
                soNgayConLai = deadline.diff(finish_date, "days");
                soGioConLai = deadline.diff(finish_date, "hours") - soNgayConLai * 24;
                if (soNgayConLai == 0) {
                    strTrangThaiCongViec = "Trước hạn "
                        + Math.abs(soGioConLai) + " giờ";
                } else {
                    strTrangThaiCongViec = "Trước hạn "
                        + Math.abs(soNgayConLai) + " ngày "
                        + Math.abs(soGioConLai) + " giờ";
                }
            }
        } else {
            const now = moment();
            const diff = deadline.diff(now);
            if (diff < 0) {
                quaHan = true;
                soNgayQuaHan = deadline.diff(now, "days");
                soGioQuaHan = deadline.diff(now, "hours") - soNgayQuaHan * 24;
                if (soNgayQuaHan == 0) {
                    strTrangThaiCongViec = "Quá hạn "
                        + Math.abs(soGioQuaHan) + " giờ";
                } else {
                    strTrangThaiCongViec = "Quá hạn "
                        + Math.abs(soNgayQuaHan) + " ngày "
                        + Math.abs(soGioQuaHan) + " giờ";
                }
            } else {
                quaHan = false;
                soNgayConLai = deadline.diff(now, "days");
                soGioConLai = deadline.diff(now, "hours") - soNgayConLai * 24;
                if (soNgayConLai == 0) {
                    strTrangThaiCongViec = "Còn lại "
                        + Math.abs(soGioConLai) + " giờ";
                } else {
                    strTrangThaiCongViec = "Còn lại "
                        + Math.abs(soNgayConLai) + " ngày "
                        + Math.abs(soGioConLai) + " giờ";
                }
            }
        }
    }
    // ------------------END STATE------------------------

    // --------------START UPDATE CONG VIEC --------------//
    const [phanTran, setPhanTran] = useState(itemCongViec.rate_finish ? itemCongViec.rate_finish : 0);
    const [modalVisibleUpdateCongViec, setModalVisibleUpdateCongViec] = useState(false);

    const handleUpdateCongViec = (action) => {
        if (action == 'capnhat') {
            setModalVisibleUpdateCongViec(true);
        }
        if (action == 'hoanthanh') {
            Alert.alert(
                "Thông báo",
                "Bạn có muốn hoàn thành công việc?",
                [
                    {
                        text: "Hủy bỏ",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "Xác nhận",
                        onPress: () => {
                            fetchUpdateCongViec(100, 1);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        if (action == 'thuchien') {
            Alert.alert(
                "Thông báo",
                "Bạn có muốn thực hiện công việc?",
                [
                    {
                        text: "Hủy bỏ",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "Xác nhận",
                        onPress: () => {
                            fetchUpdateCongViec(0, 1);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
        if (action == 'thuchienlai') {
            Alert.alert(
                "Thông báo",
                "Bạn có muốn thực hiện lại công việc?",
                [
                    {
                        text: "Hủy bỏ",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "Xác nhận",
                        onPress: () => {
                            // fetchUpdateCongViec(0, 0);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };
    const moldalUpdateCongViec = () => {
        return (
            <TVSControlPopup
                title={"Cập nhật công việc"}
                isShow={modalVisibleUpdateCongViec}
                onHide={() => setModalVisibleUpdateCongViec(false)}
                bottom={
                    <View
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        paddingHorizontal={10}
                        paddingVertical={10}
                    >
                        <TVSButton
                            type="danger"
                            onPress={() => setModalVisibleUpdateCongViec(false)}
                            icon={"close"}
                            buttonStyle="3"
                        >
                            Đóng lại
                        </TVSButton>
                        <TVSButton
                            type="primary"
                            onPress={() => fetchUpdateCongViec(phanTran, 1)}
                            icon={"update"}
                            buttonStyle="3"
                        >
                            Cập nhật
                        </TVSButton>
                    </View>
                }
            >
                {/* Tao thanh keo phan tram */}
                <View style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 10,
                }}>
                    <Text style={{
                        marginRight: 10,
                        marginBottom: 10,
                        fontWeight: "600",
                    }}>
                        Tiến độ công việc:  {phanTran}%
                    </Text>
                    <View style={{
                        flex: 1,
                        width: 200,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 10,
                        alignItems: 'stretch',
                        justifyContent: 'center',
                    }}>
                        <Slider
                            style={{
                                width: '100%',
                                height: 40,
                                backgroundColor: "red"
                            }}
                            value={phanTran}
                            minimumValue={0}
                            maximumValue={100}
                            minimumTrackTintColor="#000000"
                            maximumTrackTintColor="#000000"
                            onValueChange={(value) => setPhanTran(Math.round(value))}
                        />
                    </View>

                </View>
            </TVSControlPopup>
        );
    };

    const fetchUpdateCongViec = (ptram, action) => {
        setModalVisibleUpdateCongViec(false);
        let status_code = "";
        if (ptram == 100 && action == 1) {
            status_code = '03';
        }
        if (ptram > 0 && ptram < 100 && action == 1) {
            status_code = '02';
        }
        if (ptram == 0 && action == 1) {
            status_code = '02';
        }
        if (ptram == 0 && action == 0) {
            status_code = '01';
        }

        const pro = "UPDHRWO002001";
        const in_par = {
            p1_varchar2: "UPDATE",
            p2_varchar2: ptram,
            p3_varchar2: status_code,
            p4_varchar2: itemCongViec.pk,
            p5_varchar2: thr_emp_pk,
            p6_varchar2: crt_by,
        };

        const out_par = {
            p1_varchar2: "dataUpdate",
        };

        console.log("in_par", in_par);
        dispatch(ShowGlobalLoading);

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
                    refreshNewToken("getData", "", "");
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        Alert.alert(
                            "Thông báo",
                            'Đã lưu các thay đổi',
                            [
                                {
                                    text: "Đóng",
                                    onPress: () => reloadParentComponent(),
                                },
                            ],
                            { cancelable: false }
                        );
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
                return {
                    error: error,
                };
            });
    };

    const reloadParentComponent = () => {
        dispatch(HRWO002Reload());
        navigation.goBack();
    }

    const refreshNewToken = (obj) => {
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

    const OneField2 = ({
        value,
        keyName,
        typeValue,
        avatar,
        html,
        paddingBottom,
        borderBottomWidth,
        borderBottomColor,
    }) => {
        let color = "black";
        switch (typeValue) {
            case "01": //mau vang
                color = "#D2691E";
                break;
            case "02": //mau do
                color = Color.primaryColor;
                break;
            case "03": //mau xanh
                color = Color.green;
                break;
            case "04": //mau tim
                color = "#800080";
                break;
            case "05": //mau tim
                color = "red";
                break;
            default: //mau den
                color = Color.black;
                break;
        }
        //Avatar la base64
        let avatarBase64 = null;
        if (!avatar) {
            avatarBase64 = null;
        } else if (avatar == "N") {
            avatarBase64 =
                "https://api-private.atlassian.com/users/f3ba6e3feb7b6867012f05b2f873affb/avatar";
        } else {
            avatarBase64 = "data:image/png;base64," + avatar;
        }
        return (
            <View
                style={{
                    flexDirection: "column",
                    borderBottomWidth: 1,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    paddingBottom: paddingBottom,
                    borderBottomWidth: borderBottomWidth,
                    borderBottomColor: colorBorderBottom,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 2,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: fontLable,
                            fontSize: fontSizeLable,
                            // textDecorationLine: "underline",
                        }}
                    >
                        {keyName}
                    </Text>
                </View>
                {avatarBase64 ? (
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: Color.gray,
                        padding: 10,
                        borderRadius: 10,
                    }}>
                        <Image
                            source={{ uri: avatarBase64 }}
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                        />
                        <Text style={{ color }}>{value}</Text>
                    </View>
                ) : (
                    <View style={{
                        backgroundColor: Color.gray,
                        padding: 10,
                        borderRadius: 4,
                    }}>
                        {html ? (
                            <RenderHtml
                                contentWidth={300}
                                color={color}
                                marginBottom={10}
                                source={{ html: value }}
                            />
                        ) : (
                            <Text
                                style={{
                                    color,
                                    marginBottom: 10,
                                }}
                            >
                                {value}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <Block
            flex
            backgroundColor={Color.white}
        >
            <TVSHeader goBack={() => navigation.goBack()}>
                Chi tiết công việc
            </TVSHeader>
            <ScrollView style={{
                height: '100%',
                paddingHorizontal: 10,
                paddingTop: 10,
            }}>
                {itemCongViec.tencv == "" ||
                    itemCongViec.tencv == undefined ? null : (
                    <OneField2
                        keyName={"Tên công việc"}
                        value={itemCongViec.tencv}
                        html={true}
                        isShow={true}
                    />
                )}

                {itemCongViec.motacv == "" ||
                    itemCongViec.motacv == undefined ? null : (
                    <OneField2
                        keyName={"Mô tả công việc"}
                        value={itemCongViec.motacv}
                        html={true}
                        isShow={true}
                    />
                )}

                {itemCongViec.full_name ? (
                    <OneField2
                        avatar={avatar}
                        keyName={"Người thực hiện"}
                        value={itemCongViec.full_name}
                        isShow={true}
                    />
                ) : null}
                {nguoiThucHien.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: 10,
                            marginBottom: 10
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontWeight: fontLable,
                                    marginBottom: 2,
                                    fontSize: fontSizeLable,
                                    marginBottom: 10
                                }}
                            >
                                Người thực hiện
                            </Text>
                        </View>

                        <View style={{
                            padding: 10,
                            paddingBottom: 0,
                            backgroundColor: Color.gray,
                            borderRadius: 8,
                        }}>
                            {nguoiThucHien.map((item, index) => {
                                return (
                                    <View style={{
                                        flexDirection: 'column',
                                        marginBottom: 10,
                                    }}>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}>
                                            <Image
                                                source={{
                                                    uri: "data:image/png;base64," + item.avatar,
                                                }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                }}
                                            />
                                            <Text style={{
                                                color: Color.black,
                                                marginLeft: 10,
                                            }}>
                                                {item.fullname}
                                            </Text>
                                        </View>

                                    </View>

                                );
                            })}
                        </View>


                    </View>
                ) : null}

                {nguoiTheoDoi.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: 10,
                            marginBottom: 10
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    fontWeight: fontLable,
                                    fontSize: fontSizeLable,
                                    marginBottom: 2,
                                    marginBottom: 10
                                }}
                            >
                                Người theo dõi
                            </Text>
                        </View>
                        <View style={{
                            padding: 10,
                            paddingBottom: 0,
                            backgroundColor: Color.gray,
                            borderRadius: 8,
                        }}>
                            {nguoiTheoDoi.map((item, index) => {
                                return (
                                    <View style={{
                                        flexDirection: 'column',
                                        marginBottom: 10,
                                    }}>
                                        <View style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}>
                                            <Image
                                                source={{
                                                    uri: "data:image/png;base64," + item.avatar,
                                                }}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 20,
                                                }}
                                            />
                                            <Text style={{
                                                color: Color.black,
                                                marginLeft: 10,
                                            }}>
                                                {item.fullname}
                                            </Text>
                                        </View>

                                    </View>

                                );
                            })}
                        </View>
                    </View>
                ) : null}



                {itemCongViec.deadline_date != ''
                    || itemCongViec.deadline_date != undefined
                    || itemCongViec.deadline_date != null ? (
                    <View
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: fontLable,
                                marginBottom: 2,
                                fontSize: fontSizeLable,
                                // textDecorationLine: "underline",
                            }}
                        >
                            Thời hạn hoàn thành
                        </Text>
                        <View style={{
                            backgroundColor: Color.gray,
                            padding: 10,
                            borderRadius: 4,
                        }}>
                            <Text style={{ color: Color.black }}>
                                {itemCongViec.deadline_date ? itemCongViec.deadline_date : "Thời hạn hoàn thành"}
                            </Text>
                            <Text style={{ color: color, marginTop: 10, marginBottom: 10 }}>
                                {itemCongViec.trangthai_name ? itemCongViec.trangthai_name : "Trang thai"}
                            </Text>
                            {quaHan ? (
                                <Text style={{ color: "red" }}>{strTrangThaiCongViec}</Text>
                            ) : (
                                <Text style={{ color: Color.black }}>
                                    {strTrangThaiCongViec}
                                </Text>
                            )}
                        </View>
                    </View>
                ) : null}

                {listHoatDong.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "column",
                            paddingHorizontal: 10,
                            marginBottom: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: fontLable,
                                marginBottom: 2,
                                fontSize: fontSizeLable,
                            }}
                        >
                            Hoạt động
                        </Text>
                        {listHoatDong.map((item, index) => {
                            const ngay_batdau = moment(item.ngay_batdau, "YYYYMMDD").format(
                                "DD/MM/YYYY"
                            );
                            const gio_batdau = item.gio_batdau ? item.gio_batdau : "00:00";
                            const ngay_gio = gio_batdau + " - " + ngay_batdau;
                            const image = item.image ? item.image : avatar;
                            const noidung =
                                item.nguoi_thaydoi_name + " - " + item.noidunghoatdong;

                            return (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        borderBottomColor: Color.gray,
                                        borderBottomWidth: 1,
                                        paddingBottom: 10,
                                        backgroundColor: Color.gray,
                                        padding: 10,
                                        borderRadius: 4,
                                        marginBottom: 5
                                    }}
                                >
                                    <Image
                                        source={{ uri: "data:image/png;base64," + image }}
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text>{ngay_gio}</Text>
                                        <RenderHtml
                                            contentWidth={300}
                                            color={color}
                                            marginBottom={10}
                                            source={{ html: noidung }}
                                        />
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : null}
            </ScrollView>

            <View style={{
                bottom: 0,
                left: 0,
                width: '100%',
                zIndex: 999,
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderTopColor: '#ddd',
                borderTopWidth: 1,
            }}>
                {
                    itemCongViec.tab == 'DangThucHien' ? (
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',

                        }}>
                            <TVSButton
                                type="primary"
                                onPress={() => handleUpdateCongViec('capnhat')}
                                icon={"update"}
                                buttonStyle="3"
                            >
                                Cập nhật
                            </TVSButton>
                            <TVSButton
                                type="success"
                                onPress={() => handleUpdateCongViec('hoanthanh')}
                                icon={"content-save"}
                                buttonStyle="3"
                            >
                                Hoàn thành
                            </TVSButton>
                        </View>
                    ) : itemCongViec.tab == 'DaHoanThanh' ? (
                        <View
                            flexDirection={"row"}
                            justifyContent={"space-between"}
                            paddingHorizontal={10}
                        >
                            <TVSButton
                                type="primary"
                                onPress={() => handleUpdateCongViec('capnhat')}
                                icon={'update'}
                                buttonStyle="3"
                            >
                                Cập nhật
                            </TVSButton>
                        </View>
                    ) : itemCongViec.tab == 'CanThucHien' ? (
                        <View
                            flexDirection={"row"}
                            justifyContent={"space-between"}
                            paddingHorizontal={10}
                        >
                            <TVSButton
                                type="secondary"
                                onPress={() => handleUpdateCongViec('thuchien')}
                                icon={'flash'}
                                buttonStyle="3"
                            >
                                Thực hiện
                            </TVSButton>
                        </View>
                    ) : (
                        <View
                            flexDirection={"row"}
                            justifyContent={"space-between"}
                            paddingHorizontal={10}
                        >
                            <TVSButton
                                type="primary"
                                onPress={() => handleUpdateCongViec('thuchienlai')}
                                icon={'update'}
                                buttonStyle="3"
                            >
                                Thực hiện lại
                            </TVSButton>
                        </View>
                    )
                }

            </View>

            {moldalUpdateCongViec()}
        </Block>
    )
}

export default ChiTietCongViec