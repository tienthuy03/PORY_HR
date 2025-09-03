
import { View, Alert, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Block from '../../../../../components/Block';
import Button from '../../../../../components/Button';
import Texts from '../../../../../components/Text';
import axios from 'axios';
import { updateUserAction } from '../../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from "../../../../../services/fetch_v1";
import moment from "moment";
import React, { useEffect, useState } from "react";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Calender from '../../../../../components/Calendes';
import Icon_time from '../../../../../icons/Datev';
import TVSTab from '../../../../../components/Tvs/Tab2';
import ModalFilter from "../../MBHRWO_ItemCongViec/ModalFilter";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import Tab from "../TabTongHop";

const BieuDo = () => {
    // Start redux
    const dispatch = useDispatch();
    const API = useSelector(state => state.SysConfigReducer.API_URL);
    const Color = useSelector(s => s.SystemReducer.theme);
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
    } catch (error) { }
    // End redux

    //------- MonthPicker ---------
    const valFromDate = moment().startOf("month");
    const valToDate = moment(new Date().setMonth(new Date().getMonth())).toDate();
    // const valToDate = moment().endOf("month");
    const [fromDate, setFromDate] = useState(moment(valFromDate).format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(moment(valToDate).format("YYYY-MM-DD"));

    const [modalVisibleDate, setModalvisibleDate] = useState(false);
    const [daySelect, setDateSelect] = useState(
        moment(new Date()).format('01/MM/YYYY') +
        ' - ' +
        moment(new Date()).endOf('month').format('DD/MM/YYYY'),
    );
    const toggleModal = () => {
        setModalvisibleDate(!modalVisibleDate);
    };

    const getStateCalendar = async result => {
        setModalvisibleDate(false);
        setDateSelect(result.daySelecteds);
        setFromDate(moment(result.startingDays).format("YYYY-MM-DD"));
        setToDate(moment(result.endingDays).format("YYYY-MM-DD"));

        const from_dt = moment(result.startingDays).format("YYYY-MM-DD");
        const to_dt = moment(result.endingDays).format("YYYY-MM-DD");

        fetchData(from_dt, to_dt);
    };

    const modalDate = (
        <TVSControlPopup
            maxHeight={500}
            title={'Chọn ngày'}
            onHide={() => setModalvisibleDate(false)}
            bottom={
                <TVSButton
                    type="danger"
                    onPress={() => setModalvisibleDate(false)}
                    icon={'close'}
                    buttonStyle="3"
                >
                    Đóng lại
                </TVSButton>
            }

            isShow={modalVisibleDate}>
            <Calender
                getState={getStateCalendar}
                startDayss={fromDate}
                endDayss={toDate}
            />
        </TVSControlPopup>
    );
    // --------------End MonthPicker-----------------

    // --------------START FETCH API FILTER NANG CAO--------------//
    //Button Nang cao
    const [modalVisibalNangCao, setModalVisibleNangCao] = useState(false);
    const handleShowNangCao = () => {
        setModalVisibleNangCao(!modalVisibalNangCao);
    }

    const showModalNangCao = () => {
        return (
            <ModalFilter
                resultNangCaoModal={resultNangCaoModal}
                isShowModal={modalVisibalNangCao}
                dataTinhTrangValue={dataTinhTrang}
                dataMucDoUuTienValue={dataMucDoUuTien}
                dataDuAnValue={dataDuAn}
                dataLoaiCongViecValue={dataLoaiCongViec}
            />

        );
    };

    const [dataTinhTrang, setDataTinhTrang] = useState([]);
    const [dataMucDoUuTien, setDataMucDoUuTien] = useState([]);
    const [dataDuAn, setDataDuAn] = useState([]);
    const [dataLoaiCongViec, setDataLoaiCongViec] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const pro = "SELHRWO001001";
        const in_par = {
            p1_varchar2: "",
            p2_varchar2: "",
            p3_varchar2: crt_by,
        };
        const out_par = {
            p1_sys: "dataTinhTrang",
            p2_sys: "dataMucDoUuTien",
            p3_sys: "dataNgayThang",
            p4_sys: "dataDuAn",
            p5_sys: "dataLoaiCongViec",
        }
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
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        setDataTinhTrang(rs.data.dataTinhTrang);
                        setDataMucDoUuTien(rs.data.dataMucDoUuTien);
                        setDataDuAn(rs.data.dataDuAn);
                        setDataLoaiCongViec(rs.data.dataLoaiCongViec);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [jobName, setJobName] = useState("");
    const [currentLoaiCongViec, setCurrentLoaiCongViec] = useState({ code: "", code_nm: "" });
    const [currentTinhTrang, setCurrentTinhTrang] = useState({ code: "", code_nm: "" });
    const [currentDuAn, setCurrentDuAn] = useState({ pk: "", project_nm: "" });
    const [currentMucDoUuTien, setCurrentMucDoUuTien] = useState({ code: "", code_nm: "" });

    const resultNangCaoModal = (result) => {
        console.log('result', result);
        setModalVisibleNangCao(false);
        setJobName(result.jobName);
        setCurrentLoaiCongViec(result.currentLoaiCongViec);
        setCurrentTinhTrang(result.currentTinhTrang);
        setCurrentDuAn(result.currentDuAn);
        setCurrentMucDoUuTien(result.currentMucDoUuTien);
    }

    //-----------------END FETCH API FILTER NANG CAO-----------------//

    // --------------START FETCH DATA BIEU DO --------------//
    const [data, setData] = useState(null);
    const [dataThucHien, setDataThucHien] = useState(null);
    const [dataTheoDoi, setDataTheoDoi] = useState(null);

    const refreshNewToken = obj => {
        axios
            .post(API + 'User/RefreshToken/', {
                token: tokenLogin,
                userPk: userPk,
                refreshToken: refreshToken,
            })
            .then(response => {
                dispatch(
                    updateUserAction({
                        index: 0,
                        value: response.data.token,
                        key: 'tokenLogin',
                    }),
                );
                dispatch(
                    updateUserAction({
                        index: 0,
                        value: response.data.refreshToken,
                        key: 'refreshToken',
                    }),
                );
                tokenLogin = response.data.token;
                refreshToken = response.data.refreshToken;
                if (obj == 'getData') {
                    dispatch(ShowGlobalLoading);
                    getData(fromDate, toDate);
                }
            })
            .catch(error => {
                if (error == 'AxiosError: Request failed with status code 400') {
                    Alert.alert(
                        'Thông báo',
                        'Phiên bản làm việc đã hết hạn. Vui lòng đăng nhập lại hệ thống',
                        [
                            {
                                text: 'Đóng',
                                onPress: () => {
                                    RNRestart.Restart();
                                },
                            },
                        ],
                        { cancelable: true },
                    );
                }
                console.log(error);
            });
    };

    useEffect(() => {
        getData(fromDate, toDate);
    }, [jobName, currentLoaiCongViec,
        currentTinhTrang, currentDuAn,
        currentMucDoUuTien
    ]);

    const getData = (fromDate, toDate) => {
        dispatch(ShowGlobalLoading);
        const from_dt = moment(fromDate).format("YYYYMMDD");
        const to_dt = moment(toDate).format("YYYYMMDD");
        const logInfo = {
            p1_varchar2: jobName,
            p2_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
            p3_varchar2: currentTinhTrang.code ? currentTinhTrang.code : "",
            p4_varchar2: currentDuAn.pk ? currentDuAn.pk : "",
            p5_varchar2: currentMucDoUuTien.code ? currentMucDoUuTien.code : "",
            p6_varchar2: from_dt,
            p7_varchar2: to_dt,
            p8_varchar2: thr_emp_pk,
            p9_varchar2: crt_by
        }
        console.log('SELHRWO003001: ', logInfo);
        sysFetch(
            API,
            {
                pro: 'SELHRWO003001',
                in_par: {
                    p1_varchar2: jobName,
                    p2_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
                    p3_varchar2: currentTinhTrang.code ? currentTinhTrang.code : "",
                    p4_varchar2: currentDuAn.pk ? currentDuAn.pk : "",
                    p5_varchar2: currentMucDoUuTien.code ? currentMucDoUuTien.code : "",
                    p6_varchar2: from_dt,
                    p7_varchar2: to_dt,
                    p8_varchar2: thr_emp_pk,
                    p9_varchar2: crt_by
                },
                out_par: {
                    p1_sys: 'data',
                    p2_sys: 'dataThucHien',
                    p3_sys: 'dataTheoDoi',
                },
            },
            tokenLogin,
        )
            .then(rs => {
                dispatch(HideGlobalLoading);
                if (rs == 'Token Expired') {
                    refreshNewToken('getData');
                }
                if (rs != 'Token Expired') {
                    setData(rs.data.data);
                    setDataThucHien(rs.data.dataThucHien);
                    setDataTheoDoi(rs.data.dataTheoDoi);
                }
            })
            .catch(error => {
                console.log(error);
                dispatch(HideGlobalLoading);
            });
    };
    // --------------END FETCH DATA BIEU DO --------------//

    return (
        <Block flex backgroundColor={Color.gray} paddingTop={5}>
            <Block style={{
                marginRight: 10,
                marginLeft: 10,
                paddingTop: 10,
                backgroundColor: Color.gray,
            }}>
                <Block
                    radius={8}
                    row
                    justifyContent={'space-between'}
                >
                    {/************ START: MonthPicker /************/}
                    <Button
                        nextScreen={toggleModal}
                        row
                        alignCenter
                        justifyContent={'space-between'}
                        flex={1}
                        backgroundColor={Color.white}
                        radius={6}
                    >
                        <Icon_time style={{ marginLeft: 20 }} />
                        <Texts
                            center
                            color={Color.mainColor}
                            size={14}
                            padding={10}
                            alignCenter
                            flex
                        >
                            {daySelect}
                        </Texts>
                        <Texts marginRight={10} />
                    </Button>

                    {/* ********START: NANG CAO ********* */}
                    <View style={{
                        justifyContent: 'flex-end',
                        marginLeft: 10,
                    }}>
                        <TouchableOpacity
                            onPress={() => handleShowNangCao()}
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: Color.white,
                            }}>
                            <Icon
                                name={'filter'}
                                color={Color.mainColor}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                </Block>

            </Block>


            {/************ START: List tong hop /************/}
            <View style={{ flex: 1, marginTop: 10 }}>
                <Block flex backgroundColor={Color.gray}>
                    <TVSTab
                        data={[
                            {
                                id: 0,
                                name: 'Công việc giao',
                                screen: (
                                    <Tab
                                        dataSend={data}
                                        onReload={() => getData(fromDate, toDate)}
                                    />
                                ),
                            },
                            {
                                id: 1,
                                name: 'Công việc thực hiện',
                                screen: (
                                    <Tab
                                        dataSend={dataThucHien}
                                        onReload={() => getData(fromDate, toDate)}
                                    />
                                ),
                            },
                            {
                                id: 2,
                                name: 'Công việc theo dõi',
                                screen: (
                                    <Tab
                                        dataSend={dataTheoDoi}
                                        onReload={() => getData(fromDate, toDate)}
                                    />
                                ),
                            },


                        ]}
                    />
                </Block>
            </View>



            {/* Modal */}
            {modalDate}
            {
                modalVisibalNangCao && (
                    <Block>
                        {showModalNangCao()}
                    </Block>
                )
            }
        </Block>
    )
}

export default BieuDo