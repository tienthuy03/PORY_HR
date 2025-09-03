import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Alert } from "react-native";
import Block from "../../../../../components/Block";
import sysFetch from "../../../../../services/fetch_v1";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import {
    HRWO004ResetReload,
} from "../../../../../services/redux/HRWO004_CongViecTheoDoi/action";
import Item_LS2 from '../../MBHRWO_ItemCongViec';

const Tab = ({ data, onReload, goDetail, handleLoadMore, flagEnd }) => {
    const dispatch = useDispatch();
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
    const API = useSelector((state) => state.SysConfigReducer.API_URL);
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

    const countReload = useSelector(
        (state) => state.HRWO004_CongViecTheoDoiReducer.countReload
    );
    useEffect(() => {
        console.log('countReload', countReload);
        if (countReload > 0) {
            onReload();
            dispatch(HRWO004ResetReload());
        }
    }, [countReload]);

    const [indexLoadMore, setIndexLoadMore] = useState(0);
    const loadMore = () => {
        if (flagEnd == true) {
            return;
        }
        setIndexLoadMore(indexLoadMore + 1);
        handleLoadMore({
            tab: data.tab,
            index: indexLoadMore + 1,
        });
    };
    //Khong co du lieu
    const onRenderNoItem = () => {
        return (
            <Block justifyCenter alignCenter flex marginTop={20}>
                <Text>Không có dữ liệu !</Text>
            </Block>
        );
    };

    const handleShowChiTietCongViec = (item) => {
        fetchData_NTH_NTD(item)
    };

    //Refresh token
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

    //Lay nguoi thuc hien va nguoi theo doi
    const fetchData_NTH_NTD = (item) => {
        dispatch(ShowGlobalLoading);
        const pro = 'SELHRWO001003';
        const in_par = {
            p1_varchar2: item.pk,
            p2_varchar2: thr_emp_pk,
            p3_varchar2: crt_by,
        }
        const out_par = {
            p1_sys: 'dataNTH',
            p2_sys: 'dataNTD',
            p3_sys: 'dataHoatDong',
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
                dispatch(HideGlobalLoading);
                if (rs == "Token Expired") {
                    refreshNewToken("getData", "", "");
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        const dataNTH = rs.data.dataNTH;
                        const dataNTD = rs.data.dataNTD;
                        const itemCV = item;
                        const itemNew = {
                            ...itemCV,
                            nguoiThucHien: dataNTH,
                            nguoiTheoDoi: dataNTD,
                            listHoatDong: rs.data.dataHoatDong,
                            tab: data.tab,
                        };
                        goDetail(itemNew);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
            });
    };
    return (
        <View
            style={{
                flexDirection: 'row', flex: 1,
                marginBottom: 10,
                justifyContent: 'space-between',
                // marginTop: 10,
            }}>
            <Block flex>
                <Block paddingHorizontal={10} flex>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        refreshing={false}
                        data={data.data}
                        renderItem={({ item }) => {
                            return (
                                <Item_LS2
                                    item={item}
                                    onSelect={(item) => handleShowChiTietCongViec(item)}
                                />
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={data}
                        ListEmptyComponent={onRenderNoItem}
                        onRefresh={() => onReload()}
                        maxToRenderPerBatch={10}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => {
                            // Kiểm tra nếu có nhiều hơn 10 phần tử
                            if (data.data.length >= 10) {
                                loadMore();
                            }
                        }}
                    />
                </Block>
            </Block>
        </View>
    )
}

export default Tab;