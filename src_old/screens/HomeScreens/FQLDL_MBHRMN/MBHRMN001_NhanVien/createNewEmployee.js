import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TVSButton from "../../../../components/Tvs/Button";
import TVSHeader from "../../../../components/Tvs/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import sysFetch from "../../../../services/fetch";
import Block from "../../../../components/Block";
import Button from "../../../../components/Button";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import IconDate from "../../../../icons/Datev";
import NetInfo from "@react-native-community/netinfo";
import { launchCamera } from "react-native-image-picker";
import Person from "../../../../icons/Person";
import sysFetch2 from "../../../../services/fetch/fetch2";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup";
import axios from "axios";
import { updateUserAction } from "../../../../actions";
import RNRestart from "react-native-restart";

const CreateNewEmployee = ({ navigation: { goBack } }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  const dispatch = useDispatch();
  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  // const tokenLogin = useSelector(
  //   state => state.loginReducers.data.data.tokenLogin,
  // );
  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  const crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);
  let tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  let userPk = useSelector(
    (state) => state.loginReducers.data.data.tes_user_pk
  );
  let refreshToken = useSelector(
    (state) => state.loginReducers.data.data.refreshToken
  );
  let thrTablePk = "";
  const [image, setImage] = useState("");
  const [empPk, setEmpPk] = useState("");
  const [flagEnabled, setFlagEnabled] = useState("N");
  const [arrOrg, setArrOrg] = useState([]);
  const [currentSelectedOrg, setCurrentSelectedOrg] = useState({
    arr: [],
    code_nm: "Chọn phòng ban",
  });
  const onChangeSelectedOrg = (value) => {
    setCurrentSelectedOrg(value);
  };

  const [arrPos, setArrPos] = useState([]);
  const [currentSelectedPos, setCurrentSelectedPos] = useState({
    code: [],
    code_nm: "Chọn chức vụ",
  });
  const onChangeSelectedPos = (value) => {
    setCurrentSelectedPos(value);
  };

  const [arrJob, setArrJob] = useState([]);
  const [currentSelectedJob, setCurrentSelectedJob] = useState({
    arr: [],
    code_nm: "Chọn công việc",
  });
  const onChangeSelectedJob = (value) => {
    setCurrentSelectedJob(value);
  };

  const [arrWG, setArrWG] = useState([]);
  const [currentSelectedWG, setCurrentSelectedWG] = useState({
    arr: [],
    code_nm: "Chọn nhóm làm việc",
  });
  const onChangeSelectedWG = (value) => {
    setCurrentSelectedWG(value);
  };

  const [arrEmpType, setArrEmpType] = useState([]);
  const [currentSelectedEmpType, setCurrentSelectedEmpType] = useState({
    arr: [],
    code_nm: "Chọn loại nhân viên",
  });
  const onChangeSelectedEmpType = (value) => {
    setCurrentSelectedEmpType(value);
  };

  const [arrProbType, setArrProbType] = useState([]);
  const [currentSelectedProbType, setCurrentSelectedProbType] = useState({
    arr: [],
    code_nm: "Chọn loại thử việc",
  });
  const onChangeSelectedProbType = (value) => {
    if (value.flag_dt === "Y") {
      setFlagEnabled("Y");
      setStartProb(joinDate);
      setEndProb("dd/mm/yyyy");
    } else {
      setFlagEnabled("N");
      setStartProb("dd/mm/yyyy");
      setEndProb("dd/mm/yyyy");
    }
    setCurrentSelectedProbType(value);
  };

  const [arrBirthPlace, setArrBirthPlace] = useState([]);
  const [currentSelectedBirthPlace, setCurrentSelectedBirthPlace] = useState({
    arr: [],
    code_nm: "Chọn nơi sinh",
  });
  const onChangeSelectedBirthPlace = (value) => {
    setCurrentSelectedBirthPlace(value);
  };

  const [arrPlaceId, setArrPlaceId] = useState([]);
  const [currentSelectedPlaceId, setCurrentSelectedPlaceId] = useState({
    arr: [],
    code_nm: "Chọn nơi cấp",
  });
  const onChangeSelectedPlaceId = (value) => {
    setCurrentSelectedPlaceId(value);
  };
  //handle control date
  const [birthDatePickerVisible, setBirthDatePickerVisible] = useState(false);
  const [birthDate, setBirthDate] = useState("dd/mm/yyyy");
  const showBirthDatePicker = () => {
    setBirthDatePickerVisible(true);
  };
  const hideBirthDatePicker = () => {
    setBirthDatePickerVisible(false);
  };
  const handleConfirmBirthDate = (val) => {
    hideBirthDatePicker();
    setBirthDate(moment(val).format("DD/MM/YYYY"));
  };

  const [joinDatePickerVisible, setJoinDatePickerVisible] = useState(false);
  const [joinDate, setJoinDate] = useState("dd/mm/yyyy");
  const showJoinDatePicker = () => {
    setJoinDatePickerVisible(true);
  };
  const hideJoinDatePicker = () => {
    setJoinDatePickerVisible(false);
  };
  const handleConfirmJoinDate = (val) => {
    hideJoinDatePicker();
    setJoinDate(moment(val).format("DD/MM/YYYY"));
    if (currentSelectedProbType.code !== undefined || valueProb !== undefined) {
      if (flagEnabled === "Y") {
        setStartProb(moment(val).format("DD/MM/YYYY"));
      } else {
        setStartProb("dd/mm/yyyy");
        setEndProb("dd/mm/yyyy");
      }
    }
  };

  const [startProbPickerVisible, setStartProbPickerVisible] = useState(false);
  const [startProb, setStartProb] = useState("dd/mm/yyyy");
  const showStartProbPicker = () => {
    setStartProbPickerVisible(true);
  };
  const hideStartProbPicker = () => {
    setStartProbPickerVisible(false);
  };
  const handleConfirmStartProb = (val) => {
    hideStartProbPicker();
    setStartProb(moment(val).format("DD/MM/YYYY"));
  };

  const [endProbPickerVisible, setEndProbPickerVisible] = useState(false);
  const [endProb, setEndProb] = useState("dd/mm/yyyy");
  const showEndProbPicker = () => {
    setEndProbPickerVisible(true);
  };
  const hideEndProbPicker = () => {
    setEndProbPickerVisible(false);
  };
  const handleConfirmEndProb = (val) => {
    hideEndProbPicker();
    setEndProb(moment(val).format("DD/MM/YYYY"));
  };

  const [issuePickerVisible, setIssuePickerVisible] = useState(false);
  const [issue, setIssue] = useState("dd/mm/yyyy");
  const showIssuePicker = () => {
    setIssuePickerVisible(true);
  };
  const hideIssuePicker = () => {
    setIssuePickerVisible(false);
  };
  const handleConfirmIssue = (val) => {
    hideIssuePicker();
    setIssue(moment(val).format("DD/MM/YYYY"));
  };

  const [dataOrg, setDataOrg] = useState([]);
  const [valueOrg, setValueOrg] = useState("");
  const [labelOrg, setLabelOrg] = useState("");
  const [modalOrgVisible, setModalOrgVisible] = useState(false);
  const getStateOrg = async (result) => {
    setTimeout(() => {
      setLabelOrg(result.code_nm);
      setValueOrg(result.code);
      setModalOrgVisible(false);
    }, 100);
  };
  const modalOrg = (
    <TVSControlPopup
      title={"CHỌN PHÒNG BAN"}
      maxHeight={400}
      isShow={modalOrgVisible}
      onHide={() => setModalOrgVisible(false)}
    >
      <FlatList
        data={dataOrg}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateOrg(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  const [dataPos, setDataPos] = useState([]);
  const [valuePos, setValuePos] = useState("");
  const [labelPos, setLabelPos] = useState("Chọn chức vụ");
  const [modalPosVisible, setModalPosVisible] = useState(false);
  const getStatePos = async (result) => {
    setTimeout(() => {
      setLabelPos(result.code_nm);
      setValuePos(result.code);
      setModalPosVisible(false);
    }, 100);
  };
  const modalPos = (
    <TVSControlPopup
      title={"CHỌN Chức vụ"}
      maxHeight={400}
      isShow={modalPosVisible}
      onHide={() => setModalPosVisible(false)}
    >
      <FlatList
        data={dataPos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStatePos(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
  const [dataJob, setDataJob] = useState([]);
  const [valueJob, setValueJob] = useState("");
  const [labelJob, setLabelJob] = useState("Chọn công việc");
  const [modalJobVisible, setModalJobVisible] = useState(false);
  const getStateJob = async (result) => {
    setTimeout(() => {
      setLabelJob(result.code_nm);
      setValueJob(result.code);
      setModalJobVisible(false);
    }, 100);
  };
  const modalJob = (
    <TVSControlPopup
      title={"CHỌN Chức vụ"}
      maxHeight={400}
      isShow={modalJobVisible}
      onHide={() => setModalJobVisible(false)}
    >
      <FlatList
        data={dataJob}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateJob(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
  const [dataWG, setDataWG] = useState([]);
  const [valueWG, setValueWG] = useState("");
  const [labelWG, setLabelWG] = useState("Chọn nhóm làm việc");
  const [modalWGVisible, setModalWGVisible] = useState(false);
  const getStateWG = async (result) => {
    setTimeout(() => {
      setLabelWG(result.code_nm);
      setValueWG(result.code);
      setModalWGVisible(false);
    }, 100);
  };
  const modalWG = (
    <TVSControlPopup
      title={"CHỌN NHÓM LÀM VIỆC"}
      maxHeight={400}
      isShow={modalWGVisible}
      onHide={() => setModalWGVisible(false)}
    >
      <FlatList
        data={dataWG}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateWG(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
  const [dataEmpType, setDataEmpType] = useState([]);
  const [valueEmpType, setValueEmpType] = useState("");
  const [labelEmpType, setLabelEmpType] = useState("Chọn loại nhân viên");
  const [modalEmpTypeVisible, setModalEmpTypeVisible] = useState(false);
  const getStateEmpType = async (result) => {
    setTimeout(() => {
      setLabelEmpType(result.code_nm);
      setValueEmpType(result.code);
      setModalEmpTypeVisible(false);
    }, 100);
  };
  const modalEmpType = (
    <TVSControlPopup
      title={"CHỌN LOẠI NHÂN VIÊN"}
      maxHeight={400}
      isShow={modalEmpTypeVisible}
      onHide={() => setModalEmpTypeVisible(false)}
    >
      <FlatList
        data={dataEmpType}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateEmpType(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );
  const [dataProb, setDataProb] = useState([]);
  const [valueProb, setValueProb] = useState("");
  const [labelProb, setLabelProb] = useState("Chọn loại thử việc");
  const [modalProbVisible, setModalProbVisible] = useState(false);
  const getStateProb = async (result) => {
    setTimeout(() => {
      setLabelProb(result.code_nm);
      setValueProb(result.code);
      onChangeSelectedProbType(result);
      setModalProbVisible(false);
    }, 100);
  };
  const modalProb = (
    <TVSControlPopup
      title={"CHỌN LOẠI THỬ VIỆC"}
      maxHeight={400}
      isShow={modalProbVisible}
      onHide={() => setModalProbVisible(false)}
    >
      <FlatList
        data={dataProb}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                getStateProb(item);
              }}
              style={{
                backgroundColor: "#F3F6F9",
                padding: 10,
                borderRadius: 6,
                marginBottom: 3,
              }}
            >
              <Text>{item.code_nm}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </TVSControlPopup>
  );

  //current data
  const [fullName, setFullName] = useState("");
  const [empId, setEmpId] = useState("");
  const [idNum, setIdNum] = useState("");
  const [probSalary, setProbSalary] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [personId, setPersonId] = useState("");
  const [perAdd, setPerAdd] = useState("");
  const [presentAdd, setPresentAdd] = useState("");
  // select e.PRESENT_ADDR -- tam tru
  // , e.PERMANENT_ADDR -- thuong tru
  const styles = StyleSheet.create({
    input: {
      padding: Platform.OS === "ios" ? 10 : 4,
      paddingLeft: Platform.OS === "ios" ? 10 : 10,
      marginTop: 5,
      backgroundColor: Color.white,
      justifyContent: "center",
      borderRadius: 8,
    },
    listControl: {
      padding: 7,
      marginTop: 5,
      backgroundColor: Color.white,
      justifyContent: "center",
      borderRadius: 8,
    },
    dateControl: {
      padding: 8,
      marginTop: 5,
      backgroundColor: Color.white,
      borderRadius: 8,
    },
  });

  useEffect(() => {
    onLoadFirst();
  }, []);

  const onLoadFirst = () => {
    sysFetch(
      API,
      {
        pro: "SELHRMN0012100",
        in_par: {
          p1_varchar2: employee_pk,
        },
        out_par: {
          p1_sys: "org",
          p2_sys: "pos",
          p3_sys: "job",
          p4_sys: "work_group",
          p5_sys: "emp_type",
          p6_sys: "prob_type",
          p7_sys: "birth_place",
          p8_sys: "place_id",
        },
      },
      tokenLogin
    ).then((rs) => {
      if (rs == "Token Expired") {
        refreshNewToken("onLoadFirst", null);
      }
      if (rs != "Token Expired") {
        if (rs.results === "S") {
          onChangeSelectedOrg(rs.data.org[0]);
          onChangeSelectedWG(rs.data.work_group[0]);
          onChangeSelectedEmpType(rs.data.emp_type[0]);
          onChangeSelectedProbType(rs.data.prob_type[0]);
          onChangeSelectedPos(rs.data.pos[0]);
          onChangeSelectedJob(rs.data.job[0]);
          onChangeSelectedPlaceId(rs.data.place_id[0]);
          onChangeSelectedBirthPlace(rs.data.birth_place[0]);
          //Android
          setDataOrg(rs.data.org);
          setLabelOrg(rs.data.org[0].code_nm);
          setValueOrg(rs.data.org[0].code);
          setDataPos(rs.data.pos);
          setLabelPos(rs.data.pos[0].code_nm);
          setValuePos(rs.data.pos[0].code);
          setDataJob(rs.data.job);
          setLabelJob(rs.data.job[0].code_nm);
          setValueJob(rs.data.job[0].code);
          setDataWG(rs.data.work_group);
          setLabelWG(rs.data.work_group[0].code_nm);
          setValueWG(rs.data.work_group[0].code);
          setDataEmpType(rs.data.emp_type);
          setLabelEmpType(rs.data.emp_type[0].code_nm);
          setValueEmpType(rs.data.emp_type[0].code);
          setDataProb(rs.data.prob_type);
          setLabelProb(rs.data.prob_type[0].code_nm);
          setValueProb(rs.data.prob_type[0].code);

          setArrOrg(rs.data.org);
          setArrPos(rs.data.pos);
          setArrJob(rs.data.job);
          setArrWG(rs.data.work_group);
          setArrEmpType(rs.data.emp_type);
          setArrProbType(rs.data.prob_type);
          setArrBirthPlace(rs.data.birth_place);
          setArrPlaceId(rs.data.place_id);
        }
      }
    });
  };

  const convertDate = (characterSplit, datetime) => {
    const year = datetime.split(characterSplit)[2];
    const month = datetime.split(characterSplit)[1];
    const date = datetime.split(characterSplit)[0];
    const datetimeConvert = year + "" + month + "" + date;
    if (datetimeConvert == "yyyymmdd") {
      return "";
    } else return datetimeConvert;
  };

  const onValidate = () => {
    Alert.alert(
      "Tạo mới nhân viên",
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
            NetInfo.fetch().then((state) => {
              if (state.isConnected) {
                onSave();
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

  const onSave = () => {
    const characterSplit = "/";
    let p_action = empPk === "" ? "INSERT" : "UPDATE";

    Platform.OS === "ios"
      ? sysFetch2(
          API,
          {
            pro: "UPDHRMN0011100",

            in_par: {
              p1_varchar2: p_action,
              p2_varchar2: fullName,
              p3_varchar2: empId,
              p4_varchar2: idNum,
              p5_varchar2: convertDate(characterSplit, birthDate),
              p6_varchar2: convertDate(characterSplit, joinDate),
              p7_varchar2:
                currentSelectedOrg.code == undefined
                  ? ""
                  : currentSelectedOrg.code,
              p8_varchar2:
                currentSelectedPos.code == undefined
                  ? ""
                  : currentSelectedPos.code,
              p9_varchar2:
                currentSelectedJob.code == undefined
                  ? ""
                  : currentSelectedJob.code,
              p10_varchar2:
                currentSelectedWG.code == undefined
                  ? ""
                  : currentSelectedWG.code,
              p11_varchar2:
                currentSelectedEmpType.code == undefined
                  ? ""
                  : currentSelectedEmpType.code,
              p12_varchar2:
                currentSelectedProbType.code == undefined
                  ? ""
                  : currentSelectedProbType.code,
              p13_varchar2: convertDate(characterSplit, startProb),
              p14_varchar2: convertDate(characterSplit, endProb),
              p15_varchar2: probSalary,
              p16_varchar2: basicSalary,
              p17_varchar2: personId,
              p18_varchar2: convertDate(characterSplit, issue),
              p19_varchar2:
                currentSelectedPlaceId.code == undefined
                  ? ""
                  : currentSelectedPlaceId.code,
              p20_varchar2:
                currentSelectedBirthPlace.code == undefined
                  ? ""
                  : currentSelectedBirthPlace.code,
              p21_varchar2: perAdd,
              p22_varchar2: presentAdd,
              p23_varchar2: image,
              p24_varchar2: empPk,
              p25_varchar2: crt_by,
            },
            out_par: {
              p1_sys: "status",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("onSave", null);
            }
            if (rs != "Token Expired") {
              if (rs.result === "S") {
                Alert.alert(
                  "Thông báo",
                  p_action === "INSERT"
                    ? "Tạo mới nhân viên thành công!"
                    : "Sao lưu thành công!",
                  [
                    {
                      text: "Đóng",
                      onPress: () => {
                        thrTablePk = rs.data[0].tablepk;
                        onCallbackReload(rs.data[0].tablepk);
                      },
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }
              if (rs.result === "F") {
                let newText = rs.content.split("ORA");
                let errors = "";
                try {
                  errors = newText[1].trim().split(":")[1];
                } catch (error) {
                  errors =
                    p_action === "INSERT"
                      ? "Lỗi: đăng ký không thành công."
                      : "Lỗi: sao lưu không thành công.";
                }

                Alert.alert(
                  "Thông báo",
                  errors,
                  [
                    {
                      text: "Thoát",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }
            }
          })
          .catch((error) => {
            Alert.alert(
              "Thông báo",
              p_action === "INSERT"
                ? "Tạo mới nhân viên thất bại. " + error
                : "Sao lưu thất bại. " + error
            );
          })
      : sysFetch2(
          API,
          {
            pro: "UPDHRMN0011100",

            in_par: {
              p1_varchar2: p_action,
              p2_varchar2: fullName,
              p3_varchar2: empId,
              p4_varchar2: idNum,
              p5_varchar2: convertDate(characterSplit, birthDate),
              p6_varchar2: convertDate(characterSplit, joinDate),
              p7_varchar2: valueOrg,
              p8_varchar2: valuePos,
              p9_varchar2: valueJob,
              p10_varchar2: valueWG,
              p11_varchar2: valueEmpType,
              p12_varchar2: valueProb,
              p13_varchar2: convertDate(characterSplit, startProb),
              p14_varchar2: convertDate(characterSplit, endProb),
              p15_varchar2: probSalary,
              p16_varchar2: basicSalary,
              p17_varchar2: personId,
              p18_varchar2: convertDate(characterSplit, issue),
              p19_varchar2:
                currentSelectedPlaceId.code == undefined
                  ? ""
                  : currentSelectedPlaceId.code,
              p20_varchar2:
                currentSelectedBirthPlace.code == undefined
                  ? ""
                  : currentSelectedBirthPlace.code,
              p21_varchar2: perAdd,
              p22_varchar2: presentAdd,
              p23_varchar2: image,
              p24_varchar2: empPk,
              p25_varchar2: crt_by,
            },
            out_par: {
              p1_sys: "status",
            },
          },
          tokenLogin
        )
          .then((rs) => {
            if (rs == "Token Expired") {
              refreshNewToken("onSave", null);
            }
            if (rs != "Token Expired") {
              if (rs.result === "S") {
                Alert.alert(
                  "Thông báo",
                  p_action === "INSERT"
                    ? "Tạo mới nhân viên thành công!"
                    : "Sao lưu thành công!",
                  [
                    {
                      text: "Đóng",
                      onPress: () => {
                        onCallbackReload(rs.data[0].tablepk);
                      },
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                let newText = rs.content.split("ORA");
                let errors = "";
                try {
                  errors = newText[1].trim().split(":")[1];
                } catch (error) {
                  errors =
                    p_action === "INSERT"
                      ? "Lỗi: đăng ký không thành công."
                      : "Lỗi: sao lưu không thành công.";
                }
                Alert.alert(
                  "Thông báo",
                  errors,
                  [
                    {
                      text: "Thoát",
                      onPress: () => {},
                      style: "cancel",
                    },
                  ],
                  { cancelable: false }
                );
              }
            }
          })
          .catch((error) => {
            Alert.alert(
              "Thông báo",
              p_action === "INSERT"
                ? "Tạo mới nhân viên thất bại. " + error
                : "Sao lưu thất bại. " + error
            );
          });
  };

  const onResetForm = () => {
    setEmpPk("");
    setFullName("");
    setEmpId("");
    setIdNum("");
    setProbSalary("");
    setBasicSalary("");
    setPersonId("");
    setPerAdd("");
    setPresentAdd("");
    setBirthDate("dd/mm/yyyy");
    setJoinDate("dd/mm/yyyy");
    setStartProb("dd/mm/yyyy");
    setEndProb("dd/mm/yyyy");
    setIssue("dd/mm/yyyy");
    setCurrentSelectedOrg({ code: "", code_nm: "Chọn phòng ban" });
    setCurrentSelectedPos({ code: "", code_nm: "Chọn chức vụ" });
    setCurrentSelectedJob({ code: "", code_nm: "Chọn công việc" });
    setCurrentSelectedWG({ code: "", code_nm: "Chọn nhóm làm việc" });
    setCurrentSelectedEmpType({ code: "", code_nm: "Chọn loại nhân viên" });
    setCurrentSelectedProbType({ code: "", code_nm: "Chọn loại thử việc" });
    setCurrentSelectedPlaceId({ code: "", code_nm: "Chọn nơi cấp" });
    setCurrentSelectedBirthPlace({ code: "", code_nm: "Chọn nơi sinh" });
    setValueOrg("");
    setLabelOrg("Chọn phòng ban");
    setValuePos("");
    setLabelPos("Chọn chức vụ");
    setValueJob("");
    setLabelJob("Chọn công việc");
    setValueWG("");
    setLabelWG("Chọn nhóm làm việc");
    setValueEmpType("");
    setLabelEmpType("Chọn loại nhân viên");
    setValueProb("");
    setLabelProb("Chọn loại thử việc");
    setImage("");
  };

  const SelectOrg = ({ onChangeSelectedOrg, currentSelectedOrg }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedOrg.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedOrg.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrOrg.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedOrg(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectPos = ({ onChangeSelectedPos, currentSelectedPos }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);
    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedPos.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedPos.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrPos.map((item, index) => {
                  if (item.code_nm === currentSelectedPos.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedPos(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectJob = ({ onChangeSelectedJob, currentSelectedJob }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedJob.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedJob.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrJob.map((item, index) => {
                  if (item.code_nm === currentSelectedJob.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedJob(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectWG = ({ onChangeSelectedWG, currentSelectedWG }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedWG.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedWG.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrWG.map((item, index) => {
                  if (item.code_nm === currentSelectedWG.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedWG(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectEmpType = ({
    onChangeSelectedEmpType,
    currentSelectedEmpType,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedEmpType.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedEmpType.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrEmpType.map((item, index) => {
                  if (item.code_nm === currentSelectedEmpType.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedEmpType(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectProbType = ({
    onChangeSelectedProbType,
    currentSelectedProbType,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedProbType.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedProbType.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrProbType.map((item, index) => {
                  if (item.code_nm === currentSelectedProbType.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedProbType(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectBirthPlace = ({
    onChangeSelectedBirthPlace,
    currentSelectedBirthPlace,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color:
                    currentSelectedBirthPlace.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedBirthPlace.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>
          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrBirthPlace.map((item, index) => {
                  if (item.code_nm === currentSelectedBirthPlace.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedBirthPlace(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };
  const SelectPlaceId = ({
    onChangeSelectedPlaceId,
    currentSelectedPlaceId,
  }) => {
    const Color = useSelector((s) => s.SystemReducer.theme);
    const [isShow, setIsShow] = useState(false);

    return (
      <View
        style={{
          marginBottom: 5,
        }}
      >
        <View style={styles.listControl}>
          <Button
            style={{
              alignItems: "center",
              flexDirection: "row",
            }}
            nextScreen={() => setIsShow(!isShow)}
          >
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: currentSelectedPlaceId.code === "" ? "#B2B2B2" : null,
                }}
              >
                {currentSelectedPlaceId.code_nm}
              </Text>
            </View>
            <Icon
              name={"arrow-down-drop-circle-outline"}
              color={Color.mainColor}
              size={24}
            />
          </Button>

          {isShow && (
            <ScrollView maxHeight={200}>
              <View
                style={{
                  marginTop: 10,
                }}
              >
                {arrPlaceId.map((item, index) => {
                  if (item.code_nm === currentSelectedPlaceId.code_nm) {
                    return null;
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setIsShow(false);
                        onChangeSelectedPlaceId(item);
                      }}
                      key={index.toString()}
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                        marginBottom: 5,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        flex={1}
                        flexWrap={"wrap"}
                        paddingLeft={5}
                        paddingRight={5}
                      >
                        {item.code_nm}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  const takePhoto = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Thông báo",
          message: "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
          buttonNegative: "Hủy bỏ",
          buttonPositive: "Xác nhận",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return Alert.alert(
          "Thông báo",
          "Xin hãy cấp quyền truy cập camera cho ứng dụng.",
          [{ text: "Đóng" }]
        );
      }
    }
    launchCamera(
      {
        maxWidth: 390,
        maxHeight: 520,
        quality: 1,
        cameraType: "back",
        includeBase64: true,
        mediaType: "photo",
        presentationStyle: "fullScreen",
      },
      (res) => {
        try {
          if (res.didCancel) {
            return;
          }
          setImage(res.assets[0].base64);
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  const onCallbackReload = (tablePK) => {
    sysFetch(
      API,
      {
        pro: "SELHRMN0014100",
        in_par: {
          p1_varchar2: tablePK,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    ).then((rs) => {
      if (rs == "Token Expired") {
        refreshNewToken("onCallbackReload", thrTablePk);
      }
      if (rs != "Token Expired") {
        if (rs.results === "S") {
          const dataCallBack = rs.data.data[0];
          thrTablePk = tablePK;
          setEmpPk(tablePK);
          setEmpId(dataCallBack.emp_id);
          setIdNum(dataCallBack.id_num);
          setFullName(dataCallBack.full_name);
          setCurrentSelectedOrg({
            code: dataCallBack.tco_org_pk,
            code_nm: dataCallBack.code_nm_org,
          });
          setValueOrg(dataCallBack.tco_org_pk);
          setLabelOrg(dataCallBack.code_nm_org);
          setBirthDate(moment(dataCallBack.birth_dt).format("DD/MM/YYYY"));
          setJoinDate(moment(dataCallBack.join_dt).format("DD/MM/YYYY"));
          setCurrentSelectedPos({
            code: dataCallBack.pos_type,
            code_nm: dataCallBack.code_nm_pos,
          });
          setCurrentSelectedJob({
            code: dataCallBack.job_type,
            code_nm: dataCallBack.code_nm_job,
          });
          setValueJob(dataCallBack.job_type);
          setLabelJob(dataCallBack.code_nm_job);
          setCurrentSelectedWG({
            code: dataCallBack.wg_pk,
            code_nm: dataCallBack.code_nm_wg,
          });
          setValueWG(dataCallBack.wg_pk);
          setLabelWG(dataCallBack.code_nm_wg);
          setCurrentSelectedProbType({
            code: dataCallBack.prob_type,
            code_nm: dataCallBack.code_nm_prob_type,
          });
          setValueProb(dataCallBack.prob_type);
          setLabelProb(dataCallBack.code_nm_prob_type);
          setCurrentSelectedEmpType({
            code: dataCallBack.emp_type,
            code_nm: dataCallBack.code_nm_emp_type,
          });
          setValueEmpType(dataCallBack.emp_type);
          setLabelEmpType(dataCallBack.code_nm_emp_type);
          setStartProb(moment(dataCallBack.begin_prob).format("DD/MM/YYYY"));
          setEndProb(moment(dataCallBack.end_prob).format("DD/MM/YYYY"));
          setProbSalary(dataCallBack.prob_sal);
          setBasicSalary(dataCallBack.basic_sal);
          setPersonId(dataCallBack.person_id);
          setIssue(moment(dataCallBack.issue_dt).format("DD/MM/YYYY"));
          setCurrentSelectedPlaceId({
            code: dataCallBack.place_per_id,
            code_nm: dataCallBack.code_nm_place_per_id,
          });
          setCurrentSelectedBirthPlace({
            code: dataCallBack.place_birth,
            code_nm: dataCallBack.code_nm_place_birth,
          });
          setPerAdd(dataCallBack.per_add);
          setPresentAdd(dataCallBack.present_add);
          setImage(dataCallBack.image);
        }
      }
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
        if (obj == "onCallbackReload") {
          onCallbackReload(p1);
        }
        if (obj == "onLoadFirst") {
          onLoadFirst();
        }
        if (obj == "onSave") {
          onSave();
        }
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
    <Block flex>
      <TVSHeader goBack={goBack}>Tạo mới nhân viên</TVSHeader>
      <Block backgroundColor={Color.gray} flex>
        <ScrollView
          style={{
            flex: 1,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View flex={2} marginTop={20} alignItems={"center"}>
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  width: 79,
                  height: 104,
                  marginRight: 20,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#ccc",
                }}
              >
                {image ? (
                  <Image
                    style={{
                      width: 75,
                      height: 100,
                      borderRadius: 10,
                    }}
                    source={{
                      uri: "data:image/jpeg;base64," + image,
                    }}
                  />
                ) : (
                  <Person />
                )}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    padding: 2,
                    backgroundColor: Color.white,
                    borderRadius: 5,
                  }}
                >
                  <Icon name={"camera"} color={"#ccc"} size={20} />
                </View>
              </TouchableOpacity>
            </View>
            <View flex={4}>
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <Text>Mã nhân viên *</Text>
                <TextInput
                  style={styles.input}
                  value={empId}
                  onChangeText={(newText) => setEmpId(newText)}
                />
              </View>
              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <Text>Mã chấm công</Text>
                <TextInput
                  style={styles.input}
                  value={idNum}
                  onChangeText={(newText) => setIdNum(newText)}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Họ tên *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={(newText) => setFullName(newText)}
            />
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Phòng ban *</Text>
            {Platform.OS === "ios" ? (
              <Block>
                <SelectOrg
                  onChangeSelectedOrg={onChangeSelectedOrg}
                  currentSelectedOrg={currentSelectedOrg}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalOrgVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valueOrg === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelOrg}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalOrg}
          </View>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                flex: 1,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Button nextScreen={() => showBirthDatePicker()} column flex>
                <Block row>
                  <Text>Ngày sinh *</Text>
                </Block>
                <Block
                  row
                  justifyContent={"space-between"}
                  alignCenter
                  style={styles.dateControl}
                >
                  <Text
                    style={{
                      color:
                        birthDate != "dd/mm/yyyy" ? Color.black : "#B2B2B2",
                    }}
                  >
                    {birthDate}
                  </Text>
                  <IconDate />
                </Block>
              </Button>
              <DateTimePickerModal
                cancelTextIOS="Hủy bỏ"
                confirmTextIOS="Xác nhận"
                isVisible={birthDatePickerVisible}
                hideTitleContainerIOS={false}
                mode="date"
                date={
                  birthDate !== "dd/mm/yyyy"
                    ? new Date(moment(birthDate, "DD/MM/YYYY"))
                    : new Date()
                }
                locale="vi_VN"
                onConfirm={handleConfirmBirthDate}
                onCancel={hideBirthDatePicker}
              />
            </View>
            <View
              style={{
                flex: 1,
                marginBottom: 10,
              }}
            >
              <Button nextScreen={() => showJoinDatePicker()} column flex>
                <Block row>
                  <Text>Ngày vào *</Text>
                </Block>
                <Block
                  row
                  justifyContent={"space-between"}
                  alignCenter
                  style={styles.dateControl}
                >
                  <Text
                    style={{
                      color: joinDate != "dd/mm/yyyy" ? Color.black : "#B2B2B2",
                    }}
                  >
                    {joinDate}
                  </Text>
                  <IconDate />
                </Block>
              </Button>
              <DateTimePickerModal
                cancelTextIOS="Hủy bỏ"
                confirmTextIOS="Xác nhận"
                isVisible={joinDatePickerVisible}
                hideTitleContainerIOS={false}
                mode="date"
                date={
                  joinDate !== "dd/mm/yyyy"
                    ? new Date(moment(joinDate, "DD/MM/YYYY"))
                    : new Date()
                }
                locale="vi_VN"
                onConfirm={handleConfirmJoinDate}
                onCancel={hideJoinDatePicker}
              />
            </View>
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Chức vụ</Text>

            {Platform.OS === "ios" ? (
              <Block>
                <SelectPos
                  onChangeSelectedPos={onChangeSelectedPos}
                  currentSelectedPos={currentSelectedPos}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalPosVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valuePos === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelPos}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalPos}
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Công việc</Text>
            {Platform.OS === "ios" ? (
              <Block>
                <SelectJob
                  onChangeSelectedJob={onChangeSelectedJob}
                  currentSelectedJob={currentSelectedJob}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalJobVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valueJob === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelJob}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalJob}
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Nhóm làm việc</Text>
            {Platform.OS === "ios" ? (
              <Block>
                <SelectWG
                  onChangeSelectedWG={onChangeSelectedWG}
                  currentSelectedWG={currentSelectedWG}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalWGVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valueWG === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelWG}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalWG}
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Loại nhân viên</Text>
            {Platform.OS === "ios" ? (
              <Block>
                <SelectEmpType
                  onChangeSelectedEmpType={onChangeSelectedEmpType}
                  currentSelectedEmpType={currentSelectedEmpType}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalEmpTypeVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valueEmpType === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelEmpType}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalEmpType}
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Loại thử việc</Text>
            {Platform.OS === "ios" ? (
              <Block>
                <SelectProbType
                  onChangeSelectedProbType={onChangeSelectedProbType}
                  currentSelectedProbType={currentSelectedProbType}
                />
              </Block>
            ) : (
              <Button
                nextScreen={() => setModalProbVisible(true)}
                row
                style={{
                  padding: 8,
                  marginTop: 5,
                  backgroundColor: Color.white,
                  justifyContent: "center",
                  borderRadius: 8,
                }}
              >
                <Block flex justifyCenter>
                  <Text
                    numberOfLines={1}
                    size={16}
                    style={{
                      color: valueProb === "" ? "#B2B2B2" : null,
                    }}
                  >
                    {labelProb}
                  </Text>
                </Block>
                <Block justifyCenter>
                  <Icon
                    name={"arrow-down-drop-circle-outline"}
                    color={Color.mainColor}
                    size={24}
                  />
                </Block>
              </Button>
            )}
            {modalProb}
          </View>
          {flagEnabled === "Y" ? (
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  marginRight: 10,
                  marginBottom: 10,
                }}
              >
                <Button
                  nextScreen={() =>
                    flagEnabled === "Y" ? showStartProbPicker() : null
                  }
                  column
                  flex
                >
                  <Block row>
                    <Text>Ngày BĐ thử việc</Text>
                  </Block>
                  <Block
                    row
                    justifyContent={"space-between"}
                    alignCenter
                    style={styles.dateControl}
                  >
                    <Text
                      style={{
                        color:
                          startProb != "dd/mm/yyyy" ? Color.black : "#B2B2B2",
                      }}
                    >
                      {startProb}
                    </Text>
                    <IconDate />
                  </Block>
                </Button>
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={startProbPickerVisible}
                  hideTitleContainerIOS={false}
                  mode="date"
                  date={
                    startProb !== "dd/mm/yyyy"
                      ? new Date(moment(startProb, "DD/MM/YYYY"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmStartProb}
                  onCancel={hideStartProbPicker}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  marginBottom: 10,
                }}
              >
                <Button
                  nextScreen={() =>
                    flagEnabled === "Y" ? showEndProbPicker() : null
                  }
                  column
                  flex
                >
                  <Block row>
                    <Text>Ngày KT thử việc</Text>
                  </Block>
                  <Block
                    row
                    justifyContent={"space-between"}
                    alignCenter
                    style={styles.dateControl}
                  >
                    <Text
                      style={{
                        color:
                          endProb != "dd/mm/yyyy" ? Color.black : "#B2B2B2",
                      }}
                    >
                      {endProb}
                    </Text>
                    <IconDate />
                  </Block>
                </Button>
                <DateTimePickerModal
                  cancelTextIOS="Hủy bỏ"
                  confirmTextIOS="Xác nhận"
                  isVisible={endProbPickerVisible}
                  hideTitleContainerIOS={false}
                  mode="date"
                  date={
                    endProb !== "dd/mm/yyyy"
                      ? new Date(moment(endProb, "DD/MM/YYYY"))
                      : new Date()
                  }
                  locale="vi_VN"
                  onConfirm={handleConfirmEndProb}
                  onCancel={hideEndProbPicker}
                />
              </View>
            </View>
          ) : null}

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Số CMND,CCCD</Text>
            <TextInput
              style={styles.input}
              value={personId}
              onChangeText={(newText) => setPersonId(newText)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Button nextScreen={() => showIssuePicker()} column flex>
                <Block row>
                  <Text>Ngày cấp</Text>
                </Block>
                <Block
                  row
                  justifyContent={"space-between"}
                  alignCenter
                  style={styles.dateControl}
                >
                  <Text
                    style={{
                      color: issue != "dd/mm/yyyy" ? Color.black : "#B2B2B2",
                    }}
                  >
                    {issue}
                  </Text>
                  <IconDate />
                </Block>
              </Button>
              <DateTimePickerModal
                cancelTextIOS="Hủy bỏ"
                confirmTextIOS="Xác nhận"
                isVisible={issuePickerVisible}
                hideTitleContainerIOS={false}
                mode="date"
                date={
                  issue !== "dd/mm/yyyy"
                    ? new Date(moment(issue, "DD/MM/YYYY"))
                    : new Date()
                }
                locale="vi_VN"
                onConfirm={handleConfirmIssue}
                onCancel={hideIssuePicker}
              />
            </View>

            <View
              style={{
                flex: 1,
                marginBottom: 10,
              }}
            >
              <Text>Nơi cấp</Text>
              <Block>
                <SelectPlaceId
                  onChangeSelectedPlaceId={onChangeSelectedPlaceId}
                  currentSelectedPlaceId={currentSelectedPlaceId}
                />
              </Block>
            </View>
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Nơi sinh</Text>
            <Block>
              <SelectBirthPlace
                onChangeSelectedBirthPlace={onChangeSelectedBirthPlace}
                currentSelectedBirthPlace={currentSelectedBirthPlace}
              />
            </Block>
          </View>

          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Địa chỉ thường trú</Text>
            <TextInput
              style={styles.input}
              value={perAdd}
              onChangeText={(newText) => setPerAdd(newText)}
            />
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Địa chỉ tạm trú</Text>
            <TextInput
              style={styles.input}
              value={presentAdd}
              onChangeText={(newText) => setPresentAdd(newText)}
            />
          </View>
          <View
            style={{
              marginBottom: 10,
            }}
          >
            <Text>Lương thử việc</Text>
            <TextInput
              style={styles.input}
              value={probSalary}
              onChangeText={(newText) => setProbSalary(newText)}
            />
          </View>

          <View
            style={{
              marginBottom: 20,
            }}
          >
            <Text>Lương chính thức</Text>
            <TextInput
              style={styles.input}
              value={basicSalary}
              onChangeText={(newText) => setBasicSalary(newText)}
            />
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            paddingTop: 0,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <View>
            <TVSButton onPress={onResetForm} type={"secondary"} icon={"sync"}>
              Đăng ký mới
            </TVSButton>
          </View>
          <View>
            <TVSButton
              onPress={onValidate}
              type={"primary"}
              icon={"content-save"}
            >
              Sao lưu
            </TVSButton>
          </View>
        </View>
      </Block>
    </Block>
  );
};

export default CreateNewEmployee;
