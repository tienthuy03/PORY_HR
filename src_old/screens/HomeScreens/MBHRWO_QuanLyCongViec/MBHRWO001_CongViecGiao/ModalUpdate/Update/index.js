import moment from "moment";
import axios from "axios";
import React, { useEffect, useState, useCallBack } from "react";
import { Dimensions, ScrollView, View, Text, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RNRestart from "react-native-restart";
import { useNavigation } from '@react-navigation/native';
import sysFetch from "../../../../../../services/fetch_v1";
import TVSTextInput from "../../../../../../components/Tvs/TVSTextInput";
import TVSList3 from "../../../../../../components/Tvs/TVSList3";
import TVSDateTime from "../../../../../../components/Tvs/TVSDateTime2";
import TVSFieldSet from "../../../../../../components/Tvs/TVSFieldSet";
import TVSButton from "../../../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../../../config/Pro";
import ModalPickUser from "../../ModalPickUser";
import {
    HideGlobalLoading,
    ShowGlobalLoading,
} from "../../../../../../services/redux/GlobalLoading/action";

import {
    HRWO001ReloadList
} from "../../../../../../services/redux/HRWO001_CongViecGiao/action";

const Update = ({ route }) => {
    const { dataUpdate } = route.params;
    const navigation = useNavigation();
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
    //--------------START DECLARE VARIABLE------------------//
    //===>Ten cong viec
    const [jobName, setJobName] = useState("");
    //===>Chi tiet cong viec
    const [description, setDescription] = useState("");
    //===>Loai cong viec
    const [dataSelectJobType, setDataSelectJobType] = useState([]);
    const [selectCodeJobType, setSelectCodeJobType] = useState("");
    const [selectNameJobType, setSelectNameJobType] = useState("Chọn loại công việc");
    const onChangeSelectJobType = (result) => {
        setSelectCodeJobType(result.code);
        setSelectNameJobType(result.code_nm);
        console.log("JobType: ", result);
    };
    //===>Du an khach hang
    const [dataSelectCustomer, setDataSelectCustomer] = useState([]);
    const [selectNameCustomer, setSelectNameCustomer] = useState("Chọn dự án/khách hàng");
    const [selectCodeCustomer, setSelectCodeCustomer] = useState("");
    const onChangeSelectCustomer = (result) => {
        setSelectNameCustomer(result.code_nm);
        setSelectCodeCustomer(result.code);
        console.log("Customer: ", result);
    };
    //===>Cong viec lien quan du an khach hang
    const [dataSelectProject, setDataSelectProject] = useState([]);
    const [selectNameProject, setSelectNameProject] = useState("Chọn công việc");
    const [selectCodeProject, setSelectCodeProject] = useState("");
    const onChangeSelectProject = (result) => {
        setSelectNameProject(result.code_nm);
        setSelectCodeProject(result.code);
        console.log("Project: ", result);
    };
    //===>Uu tien
    const [dataSelectPriority, setDataSelectPriority] = useState([]);

    const [selectNamePriority, setSelectNamePriority] = useState("Chọn mức độ ưu tiên");
    const [selectCodePriority, setSelectCodePriority] = useState("");
    const onChangeSelectPriority = (result) => {
        setSelectNamePriority(result.code_nm);
        setSelectCodePriority(result.code);
        console.log("Priority: ", result);
    };
    //===>Ngay den han
    const [date, setDate] = useState("dd/mm/yyyy");
    const onChangeDate = (val) => {
        //Date dang 2023-11-10T05:53:00.044Z
        console.log("val: ", moment(val).format("DD/MM/YYYY"));
        setDate(moment(val).format("DD/MM/YYYY"));
    };
    const [time, setTime] = useState("hh:mm");
    const onChangeTime = (val) => {
        //Time dang 2023-11-09T08:52:08.659Z
        setTime(moment(val).format("HH:mm"));
    };
    //===> Assign
    const [dataAssign, setDataAssign] = useState([]);
    const onSelectAssign = (obj) => {
        let arr = [];
        obj.forEach((item) => {
            if (item.sel == "Y") {
                arr.push(item);
            }
        });
        setDataItemAssignSelected(arr);
    };
    useEffect(() => {
        onSelectAssign(dataAssign);
    }, [dataAssign]);

    //===> Implement
    const [dataImplement, setDataImplement] = useState([]);
    const onSelectImplement = (obj) => {
        let arr = [];
        obj.forEach((item) => {
            if (item.sel == "Y") {
                arr.push(item);
            }
        });
        setDataItemImplementSelected(arr);
    };
    useEffect(() => {
        onSelectImplement(dataImplement);
    }, [dataImplement]);

    //===> Follow
    const [dataFollow, setDataFollow] = useState([]);
    const onSelectFollow = (obj) => {
        let arr = [];
        obj.forEach((item) => {
            if (item.sel == "Y") {
                arr.push(item);
            }
        });
        setDataItemFollowSelected(arr);
    };
    useEffect(() => {
        onSelectFollow(dataFollow);
    }, [dataFollow]);
    //
    const dialogError = (text) => {
        Alert.alert(
            "Thông báo",
            text,
            [
                {
                    text: "Thoát",
                    onPress: () => {
                        console.log("press");
                    },
                    style: "cancel",
                },
            ],
            { cancelable: false }
        );
    };
    //Validate
    const [dataItemAssignSelected, setDataItemAssignSelected] = useState([]);
    const [dataItemImplementSelected, setDataItemImplementSelected] = useState([]);
    const [dataItemFollowSelected, setDataItemFollowSelected] = useState([]);
    const OnValidate = () => {
        if (jobName.trim() == "") {
            dialogError("Vui lòng nhập Tên công việc!");
            return;
        }
        if (description.trim() == "") {
            dialogError("Vui lòng nhập Chi tiết công việc!");
            return;
        }
        if (selectCodeCustomer == "") {
            dialogError("Vui lòng chọn Dự án/Khách hàng!");
            return;
        }
        if (time == "hh:mm") {
            dialogError("Vui lòng chọn giờ đến hạn!");
            return;
        }
        if (date == "dd/mm/yyyy") {
            dialogError("Vui lòng chọn ngày đến hạn!");
            return;
        }
        if (dataItemImplementSelected.length == 0) {
            dialogError("Vui lòng chọn người thực hiện!");
            return;
        }

        OnConfirm();
    };
    //Confirm
    const OnConfirm = () => {
        Alert.alert(
            "Thông báo",
            "Bạn có muốn sao lưu?",
            [
                {
                    text: "Hủy bỏ",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Xác nhận",
                    onPress: () => {
                        saveJob();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const saveJob = () => {
        const issues_pk = dataUpdate.pk ? dataUpdate.pk : "";
        let txtJobNm = jobName.trim();
        let txtDescription = description.trim();
        let codeJobType = selectCodeJobType;
        let nmJobType = selectNameJobType;
        let codeCustomer = selectCodeCustomer;
        let nmCustomer = selectNameCustomer;
        let codePriority = selectCodePriority;
        let nmPriority = selectNamePriority;
        // let selDate = date;
        let selDate = moment(date).format("DD/MM/YYYY");
        let selTime = time;

        //Lay danh sach nguoi duoc chon truoc do
        const nguoiThucHien = dataUpdate.nguoiThucHien ? dataUpdate.nguoiThucHien : [];
        //Lay danh sach nguoi thuc hien hien tai
        const dataItemImplementSelectedTemp = dataItemImplementSelected.map((item) => {
            return { ...item, role: 1 };
        });

        //Kiem tra thay doi nguoi thuc hien
        let emp_pk_arr_thuchien = "";
        let action_arr_thuchien = "";
        let name_thuc_hien = "";
        let count_thuchien = 0;
        for (let i = 0; i < nguoiThucHien.length; i++) {
            let check = false;
            for (let j = 0; j < dataItemImplementSelectedTemp.length; j++) {
                if (nguoiThucHien[i].thr_emp_pk == dataItemImplementSelectedTemp[j].pk) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                // Nếu người thực hiện không được tìm thấy trong danh sách hiện tại
                emp_pk_arr_thuchien += nguoiThucHien[i].thr_emp_pk + "|";
                action_arr_thuchien += "D|";
                name_thuc_hien += nguoiThucHien[i].fullname + "|";
                count_thuchien++;
            }
        }

        for (let j = 0; j < dataItemImplementSelectedTemp.length; j++) {
            let check = false;
            for (let i = 0; i < nguoiThucHien.length; i++) {
                if (nguoiThucHien[i].thr_emp_pk == dataItemImplementSelectedTemp[j].pk) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                // Nếu người thực hiện không được tìm thấy trong danh sách trước đó
                emp_pk_arr_thuchien += dataItemImplementSelectedTemp[j].pk + "|";
                action_arr_thuchien += "I|";
                name_thuc_hien += dataItemImplementSelectedTemp[j].fullname + "|";
                count_thuchien++;
            }
        }

        //Lay danh sach nguoi theo doi hien tai
        const nguoiTheoDoi = dataUpdate.nguoiTheoDoi ? dataUpdate.nguoiTheoDoi : [];
        //Lay danh sach nguoi theo doi hien tai
        const dataItemFollowSelectedTemp = dataItemFollowSelected.map((item) => {
            return { ...item, role: 2 };
        });

        //Kiem tra thay doi nguoi theo doi
        let emp_pk_arr_theodoi = "";
        let action_arr_theodoi = "";
        let name_theo_doi = "";
        let count_theodoi = 0;

        for (let i = 0; i < nguoiTheoDoi.length; i++) {
            let check = false;
            for (let j = 0; j < dataItemFollowSelectedTemp.length; j++) {
                if (nguoiTheoDoi[i].thr_emp_pk == dataItemFollowSelectedTemp[j].pk) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                // Nếu người thực hiện không được tìm thấy trong danh sách hiện tại
                emp_pk_arr_theodoi += nguoiTheoDoi[i].thr_emp_pk + "|";
                action_arr_theodoi += "D|";
                name_theo_doi += nguoiTheoDoi[i].fullname + "|";
                count_theodoi++;
            } 
        }

        for (let j = 0; j < dataItemFollowSelectedTemp.length; j++) {
            let check = false;
            for (let i = 0; i < nguoiTheoDoi.length; i++) {
                if (nguoiTheoDoi[i].thr_emp_pk == dataItemFollowSelectedTemp[j].pk) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                // Nếu người thực hiện không được tìm thấy trong danh sách trước đó
                emp_pk_arr_theodoi += dataItemFollowSelectedTemp[j].pk + "|";
                action_arr_theodoi += "I|";
                name_theo_doi += dataItemFollowSelectedTemp[j].fullname + "|";
                count_theodoi++;
            }
        }

        const pro = "UPDHRWO001002";
        //Lay ngay hien tai theo dinh dang yyyymmdd
        const dateNow = moment().format("YYYYMMDD");
        const in_par = {
            p1_varchar2: "UPDATE",
            p2_varchar2: issues_pk,
            p3_varchar2: txtJobNm,
            p4_varchar2: txtDescription,
            p5_varchar2: codeCustomer,
            p6_varchar2: codeJobType,
            p7_varchar2: thr_emp_pk,
            p8_varchar2: selDate + " " + selTime + ":00",
            p9_varchar2: codePriority,

            p10_varchar2: count_thuchien,
            p11_varchar2: emp_pk_arr_thuchien,
            p12_varchar2: action_arr_thuchien,

            p13_varchar2: count_theodoi,
            p14_varchar2: emp_pk_arr_theodoi,
            p15_varchar2: action_arr_theodoi,

            p16_varchar2: thr_emp_pk,
            p17_varchar2: dateNow,
            p18_varchar2: crt_by,
        };
        const out_par = {
            p1_varchar2: "status",
        }

        console.log("in_par: ", in_par);
        console.log('count thuc hien: ', count_thuchien);
        console.log('pk_thuchien: ', in_par.p11_varchar2);
        console.log('action_thuchien: ', in_par.p12_varchar2);
        console.log('name_thuc_hien: ', name_thuc_hien);
        console.log('count theo doi: ', count_theodoi);
        console.log('pk_theodoi: ', in_par.p14_varchar2);
        console.log('action_theodoi: ', in_par.p15_varchar2);
        console.log('name_theo_doi: ', name_theo_doi);
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
                console.log("rs save ", rs);
                if (rs.results == "F") {
                    let errors = "";
                    try {
                        errors = rs.errorData.split("ORA")[1].trim().split(":")[1];
                    } catch (error) {
                        errors = "Lỗi: đăng ký không thành công.";
                    }
                    dialogNoti(errors);
                } else {
                    dialogNoti("Đã lưu các thay đổi thành công");
                    dispatch(HRWO001ReloadList());
                    navigation.navigate('MBHRWO001');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const dialogNoti = (text) => {
        Alert.alert(
            "Thông báo",
            text,
            [
                {
                    text: "Đóng",
                    onPress: () => { },
                },
            ],
            { cancelable: false }
        );
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

    useEffect(() => {
        dispatch(ShowGlobalLoading);
        fetchData();
    }, []);

    //Fetch data
    const fetchData = () => {
        const issues_pk = dataUpdate.pk ? dataUpdate.pk : "";
        const pro = "SELHRWO001004";
        const in_par = {
            p1_varchar2: thr_emp_pk,
            p2_varchar2: issues_pk,
            p3_varchar2: APP_VERSION,
            p4_varchar2: crt_by,
        };
        const out_par = {
            p1_sys: "dataJobType",
            p2_sys: "dataCustomer",
            p3_sys: "dataPriority",
            p4_sys: "dataAssign",
            p5_sys: "dataImplement",
            p6_sys: "dataFollow",
            p7_sys: "dataImplementDf",
            p8_sys: "dataProject",
        }
        console.log("in_par: ", in_par);
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
                        setDataSelectJobType(rs.data.dataJobType);
                        setDataSelectCustomer(rs.data.dataCustomer);
                        setDataSelectPriority(rs.data.dataPriority);
                        setDataAssign(rs.data.dataAssign);
                        setDataImplement(rs.data.dataImplement);
                        setDataFollow(rs.data.dataFollow);
                        setDataSelectProject(rs.data.dataProject);

                        const dataJobType = rs.data.dataJobType;
                        const dataCustomer = rs.data.dataCustomer;
                        const dataPriority = rs.data.dataPriority;

                        if (dataUpdate) {
                            setJobName(dataUpdate.tencv);
                            setDescription(dataUpdate.motacv);
                            for (let i = 0; i < dataJobType.length; i++) {
                                if (dataJobType[i].code == dataUpdate.loaicv_code) {
                                    setDataJobTypeCurrent(dataJobType[i]);
                                }
                            }
                            for (let i = 0; i < dataCustomer.length; i++) {
                                if (dataCustomer[i].code == dataUpdate.thr_pro_project_pk) {
                                    setDataCustomerCurrent(dataCustomer[i]);
                                }
                            }
                            for (let i = 0; i < dataPriority.length; i++) {
                                if (dataPriority[i].code == dataUpdate.uutien_code) {
                                    setDataPriorityCurrent(dataPriority[i]);
                                }
                            }
                            //Set ngay gio tu chuoi 10:39 - 11/11/2023 vao date va time
                            const datetimeString = dataUpdate.deadline_date;
                            const dateFormat = "HH:mm - DD/MM/YYYY";
                            const dateTime = moment(datetimeString, dateFormat);

                            if (dateTime.isValid()) {
                                const dateTemp = dateTime.format("DD/MM/YYYY");
                                const timeTemp = dateTime.format("HH:mm");
                                setDate(dateTemp);
                                setTime(timeTemp);
                            } else {
                                console.log("Chuỗi không phù hợp với định dạng ngày và giờ");
                            }
                            let dataItemImplementSelectedTemp = [];
                            let dataItemFollowSelectedTemp = [];
                            const nguoiThucHien = dataUpdate.nguoiThucHien ? dataUpdate.nguoiThucHien : [];
                            const nguoiTheoDoi = dataUpdate.nguoiTheoDoi ? dataUpdate.nguoiTheoDoi : [];
                            const dataImplement = rs.data.dataImplement ? rs.data.dataImplement : [];
                            const dataFollow = rs.data.dataFollow ? rs.data.dataFollow : [];
                            for (let i = 0; i < nguoiThucHien.length; i++) {
                                for (let j = 0; j < dataImplement.length; j++) {
                                    if (nguoiThucHien[i].thr_emp_pk == dataImplement[j].pk) {
                                        dataImplement[j].sel = "Y";
                                        dataItemImplementSelectedTemp.push(dataImplement[j]);
                                    }
                                }
                            }
                            for (let i = 0; i < nguoiTheoDoi.length; i++) {
                                for (let j = 0; j < dataFollow.length; j++) {
                                    if (nguoiTheoDoi[i].thr_emp_pk == dataFollow[j].pk) {
                                        dataFollow[j].sel = "Y";
                                        dataItemFollowSelectedTemp.push(dataFollow[j]);
                                    }
                                }
                            }
                            setDataItemImplementSelected(dataItemImplementSelectedTemp);
                            setDataItemFollowSelected(dataItemFollowSelectedTemp);
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

    //===>Set lai gia tri cho ModalPickUser
    const [triggerModal1, setTriggerModal1] = useState(false);
    const [triggerModal2, setTriggerModal2] = useState(false);
    const [triggerModal3, setTriggerModal3] = useState(false);

    useEffect(() => {
        if (dataAssign.length > 0) {
            setTriggerModal1(true);
        } else {
            setTriggerModal1(false);
        }
    }, [dataAssign]);

    useEffect(() => {
        if (dataImplement.length > 0) {
            setTriggerModal2(true);
        } else {
            setTriggerModal2(false);
        }
    }, [dataImplement]);

    useEffect(() => {
        if (dataFollow.length > 0) {
            setTriggerModal3(true);
        } else {
            setTriggerModal3(false);
        }
    }, [dataFollow]);

    const [dataJobTypeCurrent, setDataJobTypeCurrent] = useState({ code: "", code_nm: "" });
    const [dataCustomerCurrent, setDataCustomerCurrent] = useState({ code: "", code_nm: "" });
    const [dataPriorityCurrent, setDataPriorityCurrent] = useState({ code: "", code_nm: "" });

    //--------------END DECLARE VARIABLE------------------//
    return (
        <>
            <View style={{ flex: 1 }}>
                <ScrollView
                    paddingTop={5}
                    paddingHorizontal={10}
                >
                    <View
                        backgroundColor={Color.white}
                        style={{
                            paddingBottom: 20,
                        }}
                    >
                        <TVSTextInput
                            required={true}
                            label={"Tên công việc"}
                            placeholder={"Nhập tên công việc"}
                            value={jobName}
                            changeValue={setJobName}
                            multiLine={true}
                        />
                        <TVSTextInput
                            required={true}
                            label={"Chi tiết công việc"}
                            placeholder={"Nhập chi tiết công việc"}
                            value={description}
                            changeValue={setDescription}
                            multiLine={true}
                        />
                        <TVSList3
                            required={true}
                            label={"Dự án/Khách hàng"}
                            dataItem={dataSelectCustomer}
                            dataItemCurrent={dataCustomerCurrent}
                            titleModal={"Chọn dự án/khách hàng"}
                            code={selectCodeCustomer}
                            code_nm={selectNameCustomer}
                            onChangeSelect={(val) => onChangeSelectCustomer(val)}
                        />
                        <TVSList3
                            label={"Loại công việc"}
                            dataItem={dataSelectJobType}
                            dataItemCurrent={dataJobTypeCurrent}
                            titleModal={"Chọn loại công việc"}
                            code={selectCodeJobType}
                            code_nm={selectNameJobType}
                            onChangeSelect={(val) => onChangeSelectJobType(val)}
                        />
                        <TVSList3
                            label={"Công việc liên quan"}
                            dataItem={dataSelectProject}
                            titleModal={"Chọn công việc"}
                            code={selectCodeProject}
                            code_nm={selectNameProject}
                            onChangeSelect={(val) => onChangeSelectProject(val)}
                        />
                        <TVSList3
                            label={"Mức độ ưu tiên"}
                            dataItem={dataSelectPriority}
                            dataItemCurrent={dataPriorityCurrent}
                            titleModal={"Chọn mức độ ưu tiên"}
                            code={selectCodePriority}
                            code_nm={selectNamePriority}
                            onChangeSelect={(val) => onChangeSelectPriority(val)}
                        />
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: 10,
                                    marginLeft: 10,
                                    marginRight: 5,
                                }}
                            >
                                <TVSDateTime
                                    mode={"time"}
                                    label={"Giờ đến hạn"}
                                    value={time}
                                    required={true}
                                    onChangeDateTime={(val) => onChangeTime(val)}
                                />
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    marginTop: 10,
                                    marginLeft: 5,
                                    marginRight: 10,
                                }}
                            >
                                <TVSDateTime
                                    mode={"date"}
                                    label={"Ngày đến hạn"}
                                    value={date}
                                    required={true}
                                    onChangeDateTime={(val) => onChangeDate(val)}
                                />
                            </View>
                        </View>
                        <TVSFieldSet label={"Người liên quan thực hiện công việc"}>
                            <View>
                                {/* Implement */}
                                {
                                    triggerModal2 && (
                                        <ModalPickUser
                                            label={"Người thực hiện"}
                                            lstData={dataImplement}
                                            onSelect={(item) => onSelectImplement(item)}
                                            type={2}
                                            required={true}
                                            dataItemImplementSelectedSend={dataItemImplementSelected}
                                        />
                                    )
                                }
                                {/* Follow */}
                                {
                                    triggerModal3 && (
                                        <ModalPickUser
                                            label={"Người theo dõi"}
                                            lstData={dataFollow}
                                            onSelect={(item) => onSelectFollow(item)}
                                            type={3}
                                            dataItemFollowSelectedSend={dataItemFollowSelected}
                                        />
                                    )
                                }
                            </View>
                        </TVSFieldSet>
                    </View>
                </ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        paddingVertical: 10,
                        marginHorizontal: 10,
                        backgroundColor: Color.white,
                        paddingBottom: 20,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <TVSButton
                            type={"secondary"}
                            icon={"sync"}
                            buttonStyle={"3"}
                            onPress={() => console.log('refresh')}
                        >
                            Làm mới
                        </TVSButton>
                    </View>

                    <View style={{ flex: 1 }}>
                        <TVSButton
                            type={"primary"}
                            icon={"content-save"}
                            buttonStyle={"3"}
                            onPress={() => {
                                OnValidate();
                            }}
                        >
                            Sao lưu
                        </TVSButton>
                    </View>
                </View>
            </View>
        </>
    );
};
export default Update;


