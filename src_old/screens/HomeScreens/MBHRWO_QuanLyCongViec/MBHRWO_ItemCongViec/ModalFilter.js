import React, { useEffect, useState } from "react";
import { View, Alert, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../../../../components/Text";
import TVSTextInput from "../../../../components/Tvs/TVSTextInput";
import TVSButton from "../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../components/Tvs/ControlPopup2";

const ModalFilter = ({
    isShowModal,
    resultNangCaoModal,
    dataTinhTrangValue,
    dataMucDoUuTienValue,
    dataDuAnValue,
    dataLoaiCongViecValue,

}) => {
    //--------------START DECLARE VARIABLE------------------//
    const Color = useSelector((s) => s.SystemReducer.theme);
    //--------------END DECLARE VARIABLE------------------//
    //Ten cong viec
    const [jobName, setJobName] = useState("");

    //Loai cong viec
    const [dataLoaiCongViec, setDataLoaiCongViec] = useState(dataLoaiCongViecValue ? dataLoaiCongViecValue : []);
    const [currentLoaiCongViec, setCurrentLoaiCongViec] = useState({});
    const [modalVisibleLoaiCongViec, setModalVisibleLoaiCongViec] = useState(false);
    const modalLoaiCongViec = (
        <TVSControlPopup
            title={"Chọn loại công việc"}
            isShow={modalVisibleLoaiCongViec}
            onHide={() => setModalVisibleLoaiCongViec(false)}
        >
            <FlatList
                data={dataLoaiCongViec}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                getStateLoaiCongViec(item);
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
    const getStateLoaiCongViec = (result) => {
        setCurrentLoaiCongViec(result);
        setModalVisibleLoaiCongViec(false);
    }

    //Tinh trang
    const [dataTinhTrang, setDataTinhTrang] = useState(dataTinhTrangValue ? dataTinhTrangValue : []);
    const [currentTinhTrang, setCurrentTinhTrang] = useState({});
    const [modalVisibleTinhTrang, setModalVisibleTinhTrang] = useState(false);
    const modalTinhTrang = () => {
        return (
            <TVSControlPopup
                title={"Chọn tình trạng"}
                isShow={modalVisibleTinhTrang}
                onHide={() => setModalVisibleTinhTrang(false)}
            >
                <FlatList
                    data={dataTinhTrang}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    getStateTinhTrang(item);
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
    };
    const getStateTinhTrang = (result) => {
        setCurrentTinhTrang(result);
        setModalVisibleTinhTrang(false);
    }

    //Du an
    const [dataDuAn, setDataDuAn] = useState(dataDuAnValue ? dataDuAnValue : []);
    const [currentDuAn, setCurrentDuAn] = useState({});
    const [modalVisibleDuAn, setModalVisibleDuAn] = useState(false);
    const modalDuAn = () => {
        return (
            <TVSControlPopup
                title={"Chọn dự án"}
                isShow={modalVisibleDuAn}
                onHide={() => setModalVisibleDuAn(false)}
            >
                <FlatList
                    data={dataDuAn}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    getStateDuAn(item);
                                }}
                                style={{
                                    backgroundColor: "#F3F6F9",
                                    padding: 10,
                                    borderRadius: 6,
                                    marginBottom: 3,
                                }}
                            >
                                <Text>{item.project_nm}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </TVSControlPopup>
        );
    };
    const getStateDuAn = (result) => {
        setCurrentDuAn(result);
        setModalVisibleDuAn(false);
    };
    //Muc do uu tien
    const [dataMucDoUuTien, setDataMucDoUuTien] = useState(dataMucDoUuTienValue ? dataMucDoUuTienValue : []);
    const [currentMucDoUuTien, setCurrentMucDoUuTien] = useState({});
    const [modalVisibleMucDoUuTien, setModalVisibleMucDoUuTien] = useState(false);
    const modalMucDoUuTien = () => {
        return (
            <TVSControlPopup
                title={"Chọn mức độ ưu tiên"}
                isShow={modalVisibleMucDoUuTien}
                onHide={() => setModalVisibleMucDoUuTien(false)}
            >
                <FlatList
                    data={dataMucDoUuTien}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    getStateMucDoUuTien(item);
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
    };
    const getStateMucDoUuTien = (result) => {
        setCurrentMucDoUuTien(result);
        setModalVisibleMucDoUuTien(false);
    };

    // --------------START NANG CAO --------------//
    //Button Nang cao
    const [modalVisibalNangCao, setModalVisibleNangCao] = useState(isShowModal);
    useEffect(() => {
        setCurrentDuAn({ project_nm: "Dự án - khách hàng", pk: "" });
        setCurrentLoaiCongViec({ code_nm: "Loại công việc", code: "" });
        setCurrentMucDoUuTien({ code_nm: "Ưu tiên", code: "" });
        setCurrentTinhTrang({ code_nm: "Tình trạng", code: "" });
    }, []);


    const result = () => {
        resultNangCaoModal({
            jobName: jobName,
            currentTinhTrang: currentTinhTrang,
            currentMucDoUuTien: currentMucDoUuTien,
            currentDuAn: currentDuAn,
            currentLoaiCongViec: currentLoaiCongViec,
        });
    }
    return (
        <TVSControlPopup
            title={"Tìm kiếm nâng cao"}
            isShow={modalVisibalNangCao}
            onHide={() => setModalVisibleNangCao(false)}
            bottom={
                <View
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    paddingHorizontal={10}
                    paddingVertical={10}
                >
                    <TVSButton
                        type="danger"
                        onPress={() => setModalVisibleNangCao(false)}
                        icon={'close'}
                        buttonStyle="3"
                    >
                        Đóng lại
                    </TVSButton>

                    <TVSButton
                        type="primary"
                        onPress={() => {
                            setModalVisibleNangCao(false);
                            result();
                        }}
                        icon={'magnify'}
                        buttonStyle="3"
                    >
                        Tìm kiếm
                    </TVSButton>
                </View>

            }
        >

            <TVSTextInput
                hasLabel={false}
                height={45}
                placeholder={"Nhập tên công việc"}
                value={jobName}
                changeValue={setJobName}
            />

            <View
                height={45}
                paddingHorizontal={10}
                marginBottom={8}
                style={{ justifyContent: "center" }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleDuAn(!modalVisibleDuAn)
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        radius={6}
                        backgroundColor={Color.gray}
                        justifyContent={"space-between"}
                        alignCenter
                        style={{
                            flexDirection: "row",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentDuAn.pk == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentDuAn.project_nm}
                            </Text>
                        </View>
                        <View>
                            <Icon
                                name={"chevron-down"}
                                color={Color.mainColor}
                                size={22}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View
                height={45}
                paddingHorizontal={10}
                marginBottom={8}
                style={{ justifyContent: "center" }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleLoaiCongViec(!modalVisibleLoaiCongViec)
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        radius={6}
                        backgroundColor={Color.gray}
                        justifyContent={"space-between"}
                        alignCenter
                        style={{
                            flexDirection: "row",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentLoaiCongViec.code == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentLoaiCongViec.code_nm}
                            </Text>
                        </View>
                        <View>
                            <Icon
                                name={"chevron-down"}
                                color={Color.mainColor}
                                size={22}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View
                height={45}
                paddingHorizontal={10}
                marginBottom={8}
                style={{ justifyContent: "center" }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleTinhTrang(!modalVisibleTinhTrang)
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        radius={6}
                        backgroundColor={Color.gray}
                        justifyContent={"space-between"}
                        alignCenter
                        style={{
                            flexDirection: "row",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentTinhTrang.code == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentTinhTrang.code_nm}
                            </Text>
                        </View>
                        <View>
                            <Icon
                                name={"chevron-down"}
                                color={Color.mainColor}
                                size={22}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View
                height={45}
                paddingHorizontal={10}
                marginBottom={8}
                style={{ justifyContent: "center" }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleMucDoUuTien(!modalVisibleMucDoUuTien)
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        radius={6}
                        backgroundColor={Color.gray}
                        justifyContent={"space-between"}
                        alignCenter
                        style={{
                            flexDirection: "row",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentMucDoUuTien.code == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentMucDoUuTien.code_nm}
                            </Text>
                        </View>
                        <View>
                            <Icon
                                name={"chevron-down"}
                                color={Color.mainColor}
                                size={22}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Show modal */}
            {modalDuAn()}
            {modalLoaiCongViec}
            {modalTinhTrang()}
            {modalMucDoUuTien()}

        </TVSControlPopup>
    );
}

export default ModalFilter