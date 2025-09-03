import React, { useEffect, useState } from "react";
import {
    Text, TextInput, View, StyleSheet,
    Alert, ScrollView, Image, TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TVSHeader from "../../../components/Tvs/Header";
import { APP_VERSION } from "../../../config/Pro";
import sysFetch from "../../../services/fetch_v1";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../services/redux/GlobalLoading/action";
import moment from "moment/moment";

const MBHRCD = ({ navigation: { goBack } }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const API = useSelector((state) => state.SysConfigReducer.API_URL);
    const Color = useSelector((s) => s.SystemReducer.theme);
    const loginReducers = useSelector((state) => state.loginReducers);
    let urlImageLogin;
    let fullnameLogin;
    let empIdLogin;
    let tokenLogin = "";
    let thr_emp_pk = "";
    let crt_by = "";
    try {
        urlImageLogin = loginReducers.data.data.avatar;
        fullnameLogin = loginReducers.data.data.full_name;
        empIdLogin = loginReducers.data.data.emp_id;
        tokenLogin = loginReducers.data.data.tokenLogin;
        thr_emp_pk = loginReducers.data.data.thr_emp_pk;
        crt_by = loginReducers.data.data.crt_by;
    } catch (error) {
        console.log("error home main2");
        console.log(error);
    }

    const [dataResult, setDataResult] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        dispatch(ShowGlobalLoading);
        //Lay du lieu tu API theo pk_detail
        const pro = "SELHRCD001000";
        const in_par = {
            p1_varchar2: thr_emp_pk,
            p2_varchar2: APP_VERSION,
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
                dispatch(HideGlobalLoading);
                if (rs == "Token Expired") {
                    // refreshNewToken("getData", "", "");
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        // console.log('rs', rs.data.data[0]);
                        const chucDanh = rs.data.data[0].chuc_danh ? rs.data.data[0].chuc_danh : '';
                        const phongBan = rs.data.data[0].phong_ban ? rs.data.data[0].phong_ban : '';
                        const ngayVaoLam = rs.data.data[0].begin_contract ?
                            moment(rs.data.data[0].begin_contract, 'YYYYMMDD').format('DD/MM/YYYY') : '';

                        const dataTemp = {
                            name: fullnameLogin,
                            empId: empIdLogin,
                            chucDanh,
                            phongBan,
                            ngayVaoLam,
                            tco_company_name: rs.data.data[0].tco_company_name,
                            logo: rs.data.data[0].tco_company_logo,
                        }
                        setDataResult(dataTemp);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
            });
    };

    const ItemThongTin = (label, value) => {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: 6,
            }}>
                <Text style={{
                    fontSize: 14,
                    color: 'black',
                    opacity: 0.8,
                    flex: 2,
                }}>
                    {label}:&nbsp;
                </Text>

                <Text style={{
                    fontSize: 14,
                    color: 'black',
                    opacity: 0.8,
                    flex: 3,
                }}>
                    {value}
                </Text>
            </View>
        )
    };

    return (
        <View style={{
            flex: 1,
            color: Color.backgroundColor,
        }}>
            <TVSHeader goBack={goBack}>Thẻ nhân viên điện tử</TVSHeader>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: Color.white,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                }}
                showsVerticalScrollIndicator={false}
            >
                {
                    dataResult ? (
                        <View style={{}}>
                            {/* <Text style={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: 'black',
                                opacity: 0.6,
                                marginTop: 10,
                                marginBottom: 6,
                            }}>
                                Mặt trước:
                            </Text> */}
                            <View style={{
                                borderRadius: 8,
                                borderWidth: 2,
                                borderColor: '#ddd',
                                overflow: 'hidden',
                            }}>
                                {/* Header */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <View style={{
                                        flex: 1,
                                        borderRightColor: '#ddd',
                                        borderRightWidth: 2,
                                        paddingHorizontal: 10,
                                    }}>
                                        <Image
                                        // Base64 + dataResult.logo
                                            source={{uri: 
                                                'data:image/png;base64,' + dataResult.logo 
                                            }}
                                            style={{
                                                width: '100%',
                                                height: 50,
                                                resizeMode: 'contain',
                                            }}
                                        />
                                    </View>
                                    <View style={{
                                        flex: 3,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: 'black',
                                            opacity: 0.6,
                                            textAlign: 'center'
                                        }}>
                                            {dataResult.tco_company_name ? dataResult.tco_company_name : ''}
                                        </Text>
                                    </View>
                                </View>

                                {/* Body */}
                                <View style={{
                                    borderTopColor: '#ddd',
                                    borderTopWidth: 2,
                                }}>
                                    <View style={{}}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            color: 'black',
                                            opacity: 0.6,
                                            textAlign: 'center',
                                            marginTop: 10,
                                        }}>
                                            THẺ NHÂN VIÊN ĐIỆN TỬ
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                        <View style={{
                                            flex: 1,
                                            padding: 10,
                                        }}>
                                            <Image
                                                source={{ uri: urlImageLogin }}
                                                style={{
                                                    width: '100%',
                                                    height: 90,
                                                    resizeMode: 'contain',
                                                }}
                                            />
                                        </View>

                                        <View style={{
                                            flex: 3,
                                            padding: 10,
                                        }}>
                                            {ItemThongTin('Họ và tên', fullnameLogin)}
                                            {ItemThongTin('Mã nhân viên', empIdLogin)}
                                            {ItemThongTin('Chức danh', dataResult.chucDanh)}
                                            {ItemThongTin('Phòng ban', dataResult.phongBan)}
                                            {ItemThongTin('Ngày vào', dataResult.ngayVaoLam)}
                                        </View>

                                    </View>
                                </View>

                            </View>
                        </View>
                    ) : null
                }
                {/* Mat truoc */}


                {/* Mat sau */}
                {/* <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: 'black',
                    opacity: 0.6,
                    marginTop: 10,
                    marginBottom: 6,
                }}>
                    Mặt sau:
                </Text>
                <View></View> */}

            </ScrollView>
        </View>
    )
}

export default MBHRCD;