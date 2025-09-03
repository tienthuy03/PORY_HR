import moment from "moment";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { View, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RNRestart from "react-native-restart";
import Block from "../../../../../components/Block";
import Text from "../../../../../components/Text";
import sysFetch from "../../../../../services/fetch_v1";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";
import Calender from '../../../../../components/Calendes';
import Button from '../../../../../components/Button';
import Icon_time from '../../../../../icons/Datev';
import TVSTab from '../../../../../components/Tvs/Tab2';
import Tab from '../TabTongHop';
import ModalFilter from "../../MBHRWO_ItemCongViec/ModalFilter";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";

const DanhSach = ({ goDetail }) => {
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

    const [jobName, setJobName] = useState("");
    const [currentLoaiCongViec, setCurrentLoaiCongViec] = useState({ code: "", code_nm: "" });
    const [currentTinhTrang, setCurrentTinhTrang] = useState({ code: "", code_nm: "" });
    const [currentDuAn, setCurrentDuAn] = useState({ pk: "", project_nm: "" });
    const [currentMucDoUuTien, setCurrentMucDoUuTien] = useState({ code: "", code_nm: "" });
    
    useEffect(() => {
        fetchDataFilter();
    }, []);

    const fetchDataFilter = () => {
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

    const resultNangCaoModal = (result) => {
        setModalVisibleNangCao(false);
        setJobName(result.jobName);
        setCurrentLoaiCongViec(result.currentLoaiCongViec);
        setCurrentTinhTrang(result.currentTinhTrang);
        setCurrentDuAn(result.currentDuAn);
        setCurrentMucDoUuTien(result.currentMucDoUuTien);
    }

    //-----------------END FETCH API FILTER NANG CAO-----------------//

    // --------------START FETCH API --------------//
    const [countCanThucHien, setCountCanThucHien] = useState(0);
    const [countDaHoanThanh, setCountDaHoanThanh] = useState(0);
    const [countDaHuy, setCountDaHuy] = useState(0);
    const [countDangThucHien, setCountDangThucHien] = useState(0);

    const [dataCanThucHien, setDataCanThucHien] = useState([]);
    const [dataDaHoanThanh, setDataDaHoanThanh] = useState([]);
    const [dataDaHuy, setDataDaHuy] = useState([]);
    const [dataDangThucHien, setDataDangThucHien] = useState([]);

    const [indexCanThucHien, setIndexCanThucHien] = useState(0);
    const [indexDaHoanThanh, setIndexDaHoanThanh] = useState(0);
    const [indexDaHuy, setIndexDaHuy] = useState(0);
    const [indexDangThucHien, setIndexDangThucHien] = useState(0);

    const [flagEndDataCanThucGien, setFlagEndDataCanThucHien] = useState(false);
    const [flagEndDataDaHoanThanh, setFlagEndDataDaHoanThanh] = useState(false);
    const [flagEndDataDaHuy, setFlagEndDataDaHuy] = useState(false);
    const [flagEndDataDangThucHien, setFlagEndDataDangThucHien] = useState(false);

    const isFirstLoad = useRef(true);
    const [isFirstLoadState, setIsFirstLoadState] = useState(true);
    const handleLoadMore = (result) => {
        if(!flagEndDataCanThucGien){
            if(result.tab == 'CanThucHien'){
                setIndexCanThucHien(result.index);
                fetchData(fromDate, toDate, result.index, 0, 0, 0);
            }
        }
        if(!flagEndDataDaHoanThanh){
            if(result.tab == 'DaHoanThanh'){
                setIndexDaHoanThanh(result.index);
                fetchData(fromDate, toDate, 0, result.index, 0, 0);
            }
        }
        if(!flagEndDataDaHuy){
            if(result.tab == 'DaHuy'){
                setIndexDaHuy(result.index);
                fetchData(fromDate, toDate, 0, 0, result.index, 0);
            }
        }
        if(!flagEndDataDangThucHien){
            if(result.tab == 'DangThucHien'){
                setIndexDangThucHien(result.index);
                fetchData(fromDate, toDate, 0, 0, 0, result.index);
            }
        }
    };

    const handleFirstReload = () => {
        setIsFirstLoadState(!isFirstLoadState);
        isFirstLoad.current = true;
    };

    useEffect(() => {
        //Neu ket qua tim kiem va ngay thang thay doi thi load lai
        if(!isFirstLoad.current){
            isFirstLoad.current = true;
            setIndexCanThucHien(0);
            setIndexDaHoanThanh(0);
            setIndexDaHuy(0);
            setIndexDangThucHien(0);

            setFlagEndDataCanThucHien(false);
            setFlagEndDataDaHoanThanh(false);
            setFlagEndDataDaHuy(false);
            setFlagEndDataDangThucHien(false);
        }
       
    }, [fromDate, toDate,
        jobName, currentLoaiCongViec, 
        currentTinhTrang, currentDuAn, 
        currentMucDoUuTien,]);

    useEffect(() => {
        console.log("isFirstLoad.current", isFirstLoad.current);
        if(isFirstLoad.current){
            fetchData(fromDate, toDate, 0, 0, 0, 0);
        }
    }, [isFirstLoad.current, isFirstLoadState]);

    const fetchData = (fromDate, toDate, indexCanThucHien, indexDaHoanThanh, indexDaHuy, indexDangThucHien) => {
        dispatch(ShowGlobalLoading);
        const from_dt = moment(fromDate).format("YYYYMMDD");
        const to_dt = moment(toDate).format("YYYYMMDD");
        const pro = "SELHRWO002001";
        const in_par = {

            p1_varchar2: indexCanThucHien ? indexCanThucHien : 0,
            p2_varchar2: indexDaHoanThanh ? indexDaHoanThanh : 0,
            p3_varchar2: indexDaHuy ? indexDaHuy : 0,
            p4_varchar2: indexDangThucHien ? indexDangThucHien : 0,
            p5_varchar2: 0, //indexDangThucHien,
            p6_varchar2: 0, //indexDangThucHien,

            p7_varchar2: jobName,
            p8_varchar2: currentLoaiCongViec.code ? currentLoaiCongViec.code : "",
            p9_varchar2: currentTinhTrang.code ? currentTinhTrang.code : "",
            p10_varchar2: currentDuAn.pk ? currentDuAn.pk : "",
            p11_varchar2: currentMucDoUuTien.code ? currentMucDoUuTien.code : "",
            p12_varchar2: from_dt,
            p13_varchar2: to_dt,
            p14_varchar2: thr_emp_pk,
            p15_varchar2: crt_by
        };
        const out_par = {
            p1_sys: "dataCanThucHien",
            p2_sys: "dataDangThucHien",
            p3_sys: "dataDaHoanThanh",
            p4_sys: "dataChuaHoanThanh",
            p5_sys: "dataDaKiemXong",
            p6_sys: "dataDaHuy",
        }
        console.log("SELHRWO002001: ", in_par);
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
                        if(rs.data.dataCanThucHien.length == 0){
                            setFlagEndDataCanThucHien(true);
                        }
                        if(rs.data.dataDangThucHien.length == 0){
                            setFlagEndDataDangThucHien(true);
                        }
                        if(rs.data.dataDaHoanThanh.length == 0){
                            setFlagEndDataDaHoanThanh(true);
                        }
                        if(rs.data.dataDaHuy.length == 0){
                            setFlagEndDataDaHuy(true);
                        }

                        const cthData = rs.data.dataCanThucHien;
                        const dthData = rs.data.dataDangThucHien;
                        const dhtData = rs.data.dataDaHoanThanh;
                        const dhData = rs.data.dataDaHuy;

                        if(isFirstLoad.current){
                            setCountCanThucHien( 
                                rs.data.dataCanThucHien[0] && rs.data.dataCanThucHien[0].max_item ? 
                                rs.data.dataCanThucHien[0].max_item : 0
                            );
                            setCountDangThucHien(
                                rs.data.dataDangThucHien[0] && rs.data.dataDangThucHien[0].max_item ? 
                                rs.data.dataDangThucHien[0].max_item : 0
                            );
                            setCountDaHoanThanh(
                                rs.data.dataDaHoanThanh[0] && rs.data.dataDaHoanThanh[0].max_item ? 
                                rs.data.dataDaHoanThanh[0].max_item : 0
                            );
                            setCountDaHuy(
                                rs.data.dataDaHuy[0] && rs.data.dataDaHuy[0].max_item ? 
                                rs.data.dataDaHuy[0].max_item : 0
                            );
                            isFirstLoad.current = false;
                        }

                        if(indexCanThucHien == 0){
                            setDataCanThucHien({
                                data: cthData,
                                tab: "CanThucHien",
                            });
                        }else{
                            const dataCamThucHienTemp = [...dataCanThucHien.data, ...cthData] 
                            setDataCanThucHien({
                                data: dataCamThucHienTemp, 
                                tab: "CanThucHien",
                            })
                        }

                        if(indexDangThucHien == 0){
                            setDataDangThucHien({
                                data: dthData,
                                tab: "DangThucHien",
                            });
                        }else{
                            const dataDangThucHienTemp = [...dataDangThucHien.data, ...dthData]
                            setDataDangThucHien({
                                data: dataDangThucHienTemp,
                                tab: "DangThucHien",
                            })
                        }

                        if(indexDaHoanThanh == 0){
                            setDataDaHoanThanh({
                                data: dhtData,
                                tab: "DaHoanThanh",
                            });
                        }else{
                            const dataDaHoanThanhTemp = [...dataDaHoanThanh.data, ...dhtData]
                            setDataDaHoanThanh({
                                data: dataDaHoanThanhTemp,
                                tab: "DaHoanThanh",
                            })
                        }

                        if(indexDaHuy == 0){
                            setDataDaHuy({
                                data: dhData,
                                tab: "DaHuy",
                            });
                        }else{
                            const dataDaHuyTemp = [...dataDaHuy.data, ...dhData]
                            setDataDaHuy({
                                data: dataDaHuyTemp,
                                tab: "DaHuy",
                            })
                        }
                    }
                }
                dispatch(HideGlobalLoading);
            })
            .catch((error) => {
                console.log(error);
                dispatch(HideGlobalLoading);
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

    return (
        <Block paddingTop={0} paddingBottom={10} flex>
            <Block flex>
                <Block flex borderTopLeftRadius={6} borderTopRightRadius={6}>
                    <Block style={{
                        paddingTop: 6,
                        flex: 1,
                        backgroundColor: Color.gray,
                    }}>
                        {/************ START: MonthPicker /************/}
                        <Block
                            radius={8}
                            row
                            marginHorizontal={10}
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
                            {/* ********START: NANG CAO ********* */}
                            <View style={{
                                justifyContent: 'flex-end',
                                marginLeft: 6,
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

                        {/************ START: List tong hop /************/}
                        <View style={{ flex: 1, marginTop: 6 }}>
                            <Block flex backgroundColor={Color.gray}>
                                <TVSTab
                                    data={[
                                        {
                                            id: 0,
                                            name: 'Cần thực hiện',
                                            count: countCanThucHien,
                                            screen: (
                                                <Tab
                                                    data={dataCanThucHien}
                                                    onReload={() => handleFirstReload()}
                                                    goDetail={goDetail}
                                                    handleLoadMore={handleLoadMore}
                                                    flagEnd={flagEndDataCanThucGien}
                                                />
                                            ),
                                        },
                                        {
                                            id: 1,
                                            name: 'Đang thực hiện',
                                            count: countDangThucHien,
                                            screen: (
                                                <Tab
                                                    data={dataDangThucHien}
                                                    onReload={() => handleFirstReload()}
                                                    goDetail={goDetail}
                                                    handleLoadMore={handleLoadMore}
                                                    flagEnd={flagEndDataDangThucHien}
                                                />
                                            ),
                                        },
                                        {
                                            id: 2,
                                            name: 'Đã hoàn thành',
                                            count: countDaHoanThanh,
                                            screen: (
                                                <Tab
                                                    data={dataDaHoanThanh}
                                                    onReload={() => handleFirstReload()}
                                                    goDetail={goDetail}
                                                    handleLoadMore={handleLoadMore}
                                                    flagEnd={flagEndDataDaHoanThanh}
                                                />
                                            ),
                                        },
                                        {
                                            id: 3,
                                            name: 'Đã hủy',
                                            count: countDaHuy,
                                            screen: (
                                                <Tab
                                                    data={dataDaHuy}
                                                    onReload={() => handleFirstReload()}
                                                    goDetail={goDetail}
                                                    handleLoadMore={handleLoadMore}
                                                    flagEnd={flagEndDataDaHuy}
                                                />
                                            ),
                                        },


                                    ]}
                                />
                            </Block>
                        </View>
                    </Block>
                </Block>
            </Block>

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

export default DanhSach;