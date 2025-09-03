import moment from "moment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Alert, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNRestart from "react-native-restart";
import Block from "../../../../../components/Block";
import Text from "../../../../../components/Text";
import sysFetch from "../../../../../services/fetch_v1";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Calender from '../../../../../components/Calendes';
import Button from '../../../../../components/Button';
import Icon_time from '../../../../../icons/Datev';
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";
import Item_LS from '../../MBHRWO_ItemCongViec';
import ModalFilter from "../../MBHRWO_ItemCongViec/ModalFilter";

const DanhSach = ({ goDetail, goUpdate }) => {
    //--------------START DECLARE VARIABLE------------------//
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
    //--------------END DECLARE VARIABLE------------------//

    //MonthPicker
    const valFromDate = moment().startOf("month");
    const valToDate = moment(new Date().setMonth(new Date().getMonth())).toDate();
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

        searchButton(from_dt, to_dt);
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

    // --------------START NANG CAO --------------//
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

    // --------------START FETCH API FILTER NANG CAO--------------//
    const [dataTinhTrang, setDataTinhTrang] = useState([]);
    const [dataMucDoUuTien, setDataMucDoUuTien] = useState([]);
    const [dataDuAn, setDataDuAn] = useState([]);
    const [dataLoaiCongViec, setDataLoaiCongViec] = useState([]);

    const fetchData = () => {
        console.log("fetchData");
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

    const countReload = useSelector(
        (state) => state.HRWO001_CongViecGiaoLoadDSReducer.countReload
    );

    useEffect(() => {
        if(countReload > 0){
            console.log('countReload', countReload);
            handleSearch(fromDate, toDate);
        }
    }, [countReload]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        handleSearch(fromDate, toDate);
    }, [jobName, currentLoaiCongViec,
        currentTinhTrang, currentDuAn,
        currentMucDoUuTien
    ]);

    // --------------START LAY DANH SACH CONG VIEC --------------//
    const [dataCongViec, setDataCongViec] = useState([]);

    const searchButton = (from_dt, to_dt) => {
        handleSearch(from_dt, to_dt);
    };

    const handleSearch = (from_dt, to_dt) => {
        dispatch(ShowGlobalLoading);
        console.log('handleSearch');
        setCheckLoadmore(false);
        setPageNo(0);
        setPageSize(10);
        const p_pageNo = 0;
        const p_elemPerPage = 10;
        const pro = "SELHRWO001002";
        const fromDate = from_dt ? moment(from_dt, "YYYY-MM-DD").format("YYYYMMDD") : "";
        const toDate = to_dt ? moment(to_dt, "YYYY-MM-DD").format("YYYYMMDD") : "";
        const in_par = {
            p1_varchar2: jobName,
            p2_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
            p3_varchar2: currentTinhTrang.code ? currentTinhTrang.code : "",
            p4_varchar2: currentDuAn.pk ? currentDuAn.pk : "",
            p5_varchar2: currentMucDoUuTien.code ? currentMucDoUuTien.code : "",
            p6_varchar2: fromDate,
            p7_varchar2: toDate,
            p8_varchar2: thr_emp_pk,
            p9_varchar2: crt_by,
            p10_number: p_pageNo,
            p11_number: p_elemPerPage,

        };
        const out_par = {
            p1_sys: "dataDanhSachCongViec",
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
                        console.log('rs.data.dataDanhSachCongViec', rs.data.dataDanhSachCongViec.length);
                        setDataCongViec(rs.data.dataDanhSachCongViec);
                        dispatch(HideGlobalLoading);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
            });
    };

    // --------------START LOAD MORE --------------//
    const [pageNo, setPageNo] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [checkLoadMore, setCheckLoadmore] = useState(false);
    const handleLoadMore = () => {
        if (checkLoadMore) return;
        dispatch(ShowGlobalLoading);
        console.log('handleLoadmore');

        const p_pageNo = pageNo + 1;
        setPageNo(p_pageNo);
        const p_elemPerPage = pageSize + 3;
        setPageSize(p_elemPerPage);

        const pro = "SELHRWO001002";
        const from_date = fromDate ? moment(fromDate, "YYYY-MM-DD").format("YYYYMMDD") : "";
        const to_date = toDate ? moment(toDate, "YYYY-MM-DD").format("YYYYMMDD") : "";
        const in_par = {
            p1_varchar2: jobName,
            p2_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
            p3_varchar2: currentTinhTrang.code ? currentTinhTrang.code : "",
            p4_varchar2: currentDuAn.pk ? currentDuAn.pk : "",
            p5_varchar2: currentMucDoUuTien.code ? currentMucDoUuTien.code : "",
            p6_varchar2: from_date,
            p7_varchar2: to_date,
            p8_varchar2: thr_emp_pk,
            p9_varchar2: crt_by,
            p10_number: p_pageNo,
            p11_number: p_elemPerPage,
        };
        const out_par = {
            p1_sys: "dataDanhSachCongViec",
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
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        console.log('rs.data.dataDanhSachCongViec', rs.data.dataDanhSachCongViec.length);
                        const dataTemp2 = dataCongViec.concat(rs.data.dataDanhSachCongViec);
                        if (rs.data.dataDanhSachCongViec.length == 0) {
                            setCheckLoadmore(true);
                        }
                        setDataCongViec(dataTemp2);
                    }
                }
                dispatch(HideGlobalLoading);
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
            });
    };

    // --------------START RENDER ITEM CONG VIEC --------------//
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
                if (rs == "Token Expired") {
                    refreshNewToken("getData", "", "");
                }
                if (rs != "Token Expired") {
                    if (rs.results == "S") {
                        const dataNTH = rs.data.dataNTH;
                        const dataNTD = rs.data.dataNTD;
                        const dataHoatDong = rs.data.dataHoatDong;
                        const itemCV = item;
                        let tab = '';
                        if(itemCV.trangthai_code == '01'){
                            tab = 'CanThucHien';
                        }else if(itemCV.trangthai_code == '02'){
                            tab = 'DangThucHien';
                        }else if(itemCV.trangthai_code == '03'){
                            tab = 'DaHoanThanh';
                        }else if(itemCV.trangthai_code == '04'){
                            tab = 'ChuaThucHien';
                        }else if(itemCV.trangthai_code == '05'){
                            tab = 'DaHuy';
                        }else{
                            tab = 'DaKiemXong';
                        }
                        const itemNew = {
                            ...itemCV,
                            nguoiThucHien: dataNTH,
                            nguoiTheoDoi: dataNTD,
                            listHoatDong: dataHoatDong,
                            tab: tab,
                        };
                        goDetail(itemNew);
                    }
                }
                dispatch(HideGlobalLoading);
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
                return { error: error };
            });
    };

    // --------------END LAY DANH SACH CONG VIEC --------------//

    return (
        <Block paddingTop={0} paddingBottom={10} flex>
            <Block flex>
                <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>

                    <Block style={{
                        marginRight: 10,
                        marginLeft: 10,
                        paddingTop: 6,
                        flex: 1,
                        backgroundColor: Color.gray,
                    }}>
                        {/************ START: MonthPicker /************/}
                        <Block
                            radius={8}
                            row
                            justifyContent={'space-between'}
                        >
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
                                <Text
                                    center
                                    color={Color.mainColor}
                                    size={14}
                                    padding={10}
                                    alignCenter
                                    flex
                                >
                                    {daySelect}
                                </Text>
                                <Text marginRight={10} />
                            </Button>

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

                        {/* ********START: NANG CAO ********* */}
                        {
                            modalVisibalNangCao && (
                                <Block>
                                    {showModalNangCao()}
                                </Block>
                            )
                        }

                        {/************ START: List cong viec giao /************/}
                        <View
                            style={{
                                flexDirection: 'row', flex: 1,
                                marginBottom: 10,
                                justifyContent: 'space-between',
                                // marginTop: 10,
                            }}>
                            <Block flex>
                                <Block 
                                    marginTop={5} flex
                                    style={{
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        refreshing={false}
                                        onRefresh={() => handleSearch(fromDate, toDate)}
                                        data={dataCongViec}
                                        renderItem={({ item }) => {
                                            return (
                                                <Item_LS
                                                    item={item}
                                                    onSelect={() => handleShowChiTietCongViec(item)}
                                                />
                                            )
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                        extraData={dataCongViec}
                                        ListEmptyComponent={onRenderNoItem}
                                        onEndReachedThreshold={0.1}
                                        initialNumToRender={10}
                                        maxToRenderPerBatch={10}
                                        onEndReached={
                                            dataCongViec.length >= 9
                                                ? () => handleLoadMore() : null
                                        }
                                    />
                                </Block>
                            </Block>

                        </View>

                    </Block>

                </Block>
            </Block>

            {/* Modal */}
            {modalDate}
        </Block>
    )
}

export default DanhSach;

