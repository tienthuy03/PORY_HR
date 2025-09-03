import moment from "moment";
import axios from "axios";
import React, { useEffect, useState, useCallBack } from "react";
import { Dimensions, ScrollView, View, Text, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import RNRestart from "react-native-restart";
import sysFetch from "../../../../../services/fetch_v1";
import TVSTextInput from "../../../../../components/Tvs/TVSTextInput";
import TVSList2 from "../../../../../components/Tvs/TVSList2";
import TVSDateTime from "../../../../../components/Tvs/TVSDateTime";
import TVSFieldSet from "../../../../../components/Tvs/TVSFieldSet";
import TVSButton from "../../../../../components/Tvs/Button";
import { APP_VERSION } from "../../../../../config/Pro";
import ModalPickUser from "../ModalPickUser";
import {
  HideGlobalLoading,
  ShowGlobalLoading,
} from "../../../../../services/redux/GlobalLoading/action";

const ThemMoi = ({ refresh }) => {
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
  const [selectNameJobType, setSelectNameJobType] = useState(
    "Chọn loại công việc"
  );
  const onChangeSelectJobType = (result) => {
    setSelectCodeJobType(result.code);
    setSelectNameJobType(result.code_nm);
    console.log("JobType: ", result);
  };
  //===>Du an khach hang
  const [dataSelectCustomer, setDataSelectCustomer] = useState([]);
  const [selectNameCustomer, setSelectNameCustomer] = useState(
    "Chọn dự án/khách hàng"
  );
  const [selectCodeCustomer, setSelectCodeCustomer] = useState("");
  const onChangeSelectCustomer = (result) => {
    setSelectNameCustomer(result.code_nm);
    setSelectCodeCustomer(result.code);
    fetchProject(result.code);
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

  const [selectNamePriority, setSelectNamePriority] = useState(
    "Chọn mức độ ưu tiên"
  );
  const [selectCodePriority, setSelectCodePriority] = useState("");
  const onChangeSelectPriority = (result) => {
    setSelectNamePriority(result.code_nm);
    setSelectCodePriority(result.code);
    console.log("Priority: ", result);
  };
  //===>Ngay den han
  const [date, setDate] = useState("dd/mm/yyyy");
  const onChangeDate = (val) => {
    setDate(moment(val).format("DD/MM/YYYY"));
  };
  const [time, setTime] = useState("hh:mm");
  const onChangeTime = (val) => {
    setTime(moment(val).format("HH:mm"));
  };
  //===> Assign
  const [dataAssign, setDataAssign] = useState([]);
  const onSelectAssign = (obj) => {
    console.log("update state dataAssign");
    let arr = [];
    obj.forEach((item) => {
      if (item.sel == "Y") {
        arr.push(item);
      }
    });
    console.log("Arr assign: ", arr.length);
    setDataItemAssignSelected(arr);
  };
  useEffect(() => {
    onSelectAssign(dataAssign);
  }, [dataAssign]);

  //===> Implement
  const [dataImplement, setDataImplement] = useState([]);
  const onSelectImplement = (obj) => {
    console.log("update state dataImplement");
    let arr = [];
    obj.forEach((item) => {
      if (item.sel == "Y") {
        arr.push(item);
      }
    });
    setDataItemImplementSelected(arr);
  };

  //===> Follow
  const [dataFollow, setDataFollow] = useState([]);
  const onSelectFollow = (obj) => {
    console.log("update state dataFollow");
    let arr = [];
    obj.forEach((item) => {
      if (item.sel == "Y") {
        arr.push(item);
      }
    });
    setDataItemFollowSelected(arr);
  };
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
  const [dataItemImplementSelected, setDataItemImplementSelected] = useState(
    []
  );
  const [dataItemFollowSelected, setDataItemFollowSelected] = useState([]);
  const OnValidate = () => {
    if (jobName.trim() == "") {
      dialogError("Vui lòng nhập Tên công việc!");
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
    if (dataItemAssignSelected.length == 0) {
      dialogError("Vui lòng chọn người giao việc!");
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
    let txtJobNm = jobName.trim();
    let txtDescription = description.trim();
    let codeJobType = selectCodeJobType;
    let nmJobType = selectNameJobType;
    let codeCustomer = selectCodeCustomer;
    let nmCustomer = selectNameCustomer;
    let codePriority = selectCodePriority;
    let nmPriority = selectNamePriority;
    let selDate = date;
    let selTime = time;

    console.log({
      txtJobNm: txtJobNm,
      txtDescription: txtDescription,
      codeJobType: codeJobType,
      nmJobType: nmJobType,
      codeCustomer: codeCustomer,
      nmCustomer: nmCustomer,
      codePriority: codePriority,
      nmPriority: nmPriority,
      selDate: selDate,
      selTime: selTime,
    });

    let dataItemImplementSelectedTemp = dataItemImplementSelected.map(
      (item) => {
        return { ...item, role: 1 };
      }
    );
    let dataItemFollowSelectedTemp = dataItemFollowSelected.map((item) => {
      return { ...item, role: 2 };
    });

    const newArr = [
      ...dataItemImplementSelectedTemp,
      ...dataItemFollowSelectedTemp,
    ];
    //Lay chuoi emp_pk va role
    let emp_pk_total = "";
    let role_total = "";
    newArr.forEach((item) => {
      emp_pk_total += item.pk + "|";
      role_total += item.role + "|";
    });
    const countNewArr = newArr.length;
    //Lay chuoi emp_pk

    const pro = "UPDHRWO001000";
    //Lay ngay hien tai theo dinh dang yyyymmdd
    const dateNow = moment().format("YYYYMMDD");
    const in_par = {
      p1_varchar2: "INSERT",
      p2_varchar2: "",
      p3_varchar2: txtJobNm,
      p4_varchar2: txtDescription,
      p5_varchar2: codeCustomer,
      p6_varchar2: codeJobType,
      p7_varchar2: thr_emp_pk,
      p8_varchar2: selDate + " " + selTime + ":00",
      p9_varchar2: codePriority,
      p10_varchar2: countNewArr,
      p11_varchar2: emp_pk_total,
      p12_varchar2: role_total,
      p13_varchar2: thr_emp_pk,
      p14_varchar2: dateNow,
      p15_varchar2: crt_by,
    };
    const out_par = {
      p1_varchar2: "status",
    };

    console.log("in_par: ", in_par);
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
    const pro = "SELHRWO001000";
    const in_par = {
      p1_varchar2: thr_emp_pk,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
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
    };
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
            // setDataSelectProject(rs.data.dataProject);
            dispatch(HideGlobalLoading);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(HideGlobalLoading);
      });
  };

  //Fetch Cong viec lien quan
  const fetchProject = (codeDuAnKhachHang) => {
    console.log('codeDuAnKhachHang: ', codeDuAnKhachHang);
    const pro = "SELHRWO001005";
    const in_par = {
      p1_varchar2: codeDuAnKhachHang,
      p4_varchar2: APP_VERSION,
      p5_varchar2: crt_by,
    };
    const out_par = {
      p1_sys: "dataProject",
    };
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
        if (rs == "Token Expired") {
          refreshNewToken("getData", "", "");
        }
        if (rs != "Token Expired") {
          if (rs.results == "S") {
            setDataSelectProject(rs.data.dataProject);
          }
        }
      })
      .catch((error) => {
        console.log(error);
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
  //--------------END DECLARE VARIABLE------------------//
  return (
    <>
      <View style={{ flex: 1 }}>
        <ScrollView paddingTop={5} paddingHorizontal={10}>
          <View
            backgroundColor={Color.white}
            style={{
              paddingBottom: 20,
            }}
          >
            <TVSTextInput
              required={true}
              label={"Tên công việc"}
              colorLabel="black"
              placeholder={"Nhập tên công việc"}
              value={jobName}
              changeValue={setJobName}
              multiLine={true}
            />
            <TVSTextInput
              label={"Chi tiết công việc"}
              colorLabel="black"
              placeholder={"Nhập chi tiết công việc"}
              value={description}
              multiLine={true}
              changeValue={setDescription}
            />
            <TVSList2
              required={true}
              colorLabel="black"
              label={"Dự án/Khách hàng"}
              dataItem={dataSelectCustomer}
              titleModal={"Chọn dự án/khách hàng"}
              code={selectCodeCustomer}
              code_nm={selectNameCustomer}
              onChangeSelect={(val) => onChangeSelectCustomer(val)}
            />
            <TVSList2
              colorLabel="black"
              label={"Công việc liên quan"}
              dataItem={dataSelectProject}
              titleModal={"Chọn công việc"}
              code={selectCodeProject}
              code_nm={selectNameProject}
              onChangeSelect={(val) => onChangeSelectProject(val)}
            />
            <TVSList2
              label={"Loại công việc"}
              colorLabel="black"
              dataItem={dataSelectJobType}
              titleModal={"Chọn loại công việc"}
              code={selectCodeJobType}
              code_nm={selectNameJobType}
              onChangeSelect={(val) => onChangeSelectJobType(val)}
            />
            <TVSList2
              colorLabel="black"
              label={"Mức độ ưu tiên"}
              dataItem={dataSelectPriority}
              titleModal={"Chọn mức độ ưu tiên"}
              code={selectCodePriority}
              code_nm={selectNamePriority}
              onChangeSelect={(val) => onChangeSelectPriority(val)}
            />
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
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
                  colorLabel="black"
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
                  colorLabel="black"
                  label={"Ngày đến hạn"}
                  value={date}
                  required={true}
                  onChangeDateTime={(val) => onChangeDate(val)}
                />
              </View>
            </View>

            <TVSFieldSet
              label={"Người liên quan thực hiện công việc"}
              colorLabel="black"
              fontWeight="normal"
            >
              <View>
                {/* Assign */}
                {/* {
                  triggerModal1 && (
                    <ModalPickUser
                      label={"Người giao việc"}
                      lstData={dataAssign}
                      onSelect={(item) => onSelectAssign(item)}
                      type={1}
                      required={true}
                      disabled={true}
                      dataItemAssignSelectedSend={dataItemAssignSelected}
                    />
                  ) 
                } */}
                {/* Implement */}
                {triggerModal2 && (
                  <ModalPickUser
                    label={"Người thực hiện"}
                    colorLabel="black"
                    lstData={dataImplement}
                    onSelect={(item) => onSelectImplement(item)}
                    type={2}
                    required={true}
                    dataItemImplementSelectedSend={dataItemImplementSelected}
                  />
                )}
                {/* Follow */}
                {triggerModal3 && (
                  <ModalPickUser
                    label={"Người theo dõi"}
                    colorLabel="black"
                    lstData={dataFollow}
                    onSelect={(item) => onSelectFollow(item)}
                    type={3}
                    dataItemFollowSelectedSend={dataItemFollowSelected}
                  />
                )}
              </View>
            </TVSFieldSet>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            marginHorizontal: 10,
            paddingBottom: 20,
            backgroundColor: Color.white,
          }}
        >
          <View style={{ flex: 1 }}>
            <TVSButton
              type={"secondary"}
              icon={"sync"}
              buttonStyle={"3"}
              onPress={() => {
                refresh();
              }}
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
export default ThemMoi;
