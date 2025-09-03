import React, { useEffect, useState } from "react";
import { View, Alert, FlatList, TouchableOpacity, Modal, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "../../../../../components/Text";
import TVSTextInput from "../../../../../components/Tvs/TVSTextInput2";
import TVSButton from "../../../../../components/Tvs/Button";
import TVSControlPopup from "../../../../../components/Tvs/ControlPopup2";

const ModalFilter = ({
    isShowModal,
    dataTrangThai = [],
    dataLoaiMay = [],
    resultNangCaoModal,
}) => {
    //--------------START DECLARE VARIABLE------------------//
    const Color = useSelector((s) => s.SystemReducer.theme);
    //--------------END DECLARE VARIABLE------------------//
    //Ma may cham cong
    const [maMayChamCong, setMaMayChamCong] = useState("");
    //Ten may cham cong
    const [tenMayChamCong, setTenMayChamCong] = useState("");
    //Dia chi IP
    const [diaChiIP, setDiaChiIP] = useState("");

    //Trang thai
    const [currentTrangThai, setCurrentTrangThai] = useState({});
    const [modalVisibleTrangThai, setModalVisibleTrangThai] = useState(false);
    const modalTrangThai = () => {
        return (
            <TVSControlPopup
                title={"Chọn trạng thái"}
                isShow={modalVisibleTrangThai}
                onHide={() => setModalVisibleTrangThai(false)}
            >
                <FlatList
                    data={dataTrangThai}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    getStateTrangThai(item);
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
    const getStateTrangThai = (result) => {
        setCurrentTrangThai(result);
        setModalVisibleTrangThai(false);
    };

    //Loai may
    const [currentLoaiMay, setCurrentLoaiMay] = useState({});
    const [modalVisibleLoaiMay, setModalVisibleLoaiMay] = useState(false);
    const modalLoaiMay = () => {
        return (
            <TVSControlPopup
                title={"Chọn loại máy"}
                isShow={modalVisibleLoaiMay}
                onHide={() => setModalVisibleLoaiMay(false)}
            >
                <FlatList
                    data={dataLoaiMay}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    getStateLoaiMay(item);
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
    const getStateLoaiMay = (result) => {
        setCurrentLoaiMay(result);
        setModalVisibleLoaiMay(false);
    };

    useEffect(() => {
        setCurrentTrangThai({ code_nm: "Chọn trạng thái", code: "" });
        setCurrentLoaiMay({ code_nm: "Chọn loại máy", code: "" });
    }, []);

    //-------------FETCH DATA-----------------//


    const result = (flag) => {
        resultNangCaoModal({
            maMayChamCongResult: maMayChamCong,
            tenMayChamCongResult: tenMayChamCong,
            diaChiIPResult: diaChiIP,
            trangThaiResult: currentTrangThai.code,
            loaiMayResult: currentLoaiMay.code,
            flagSearch: flag,
        });
    }

    return (
        <TVSControlPopup
            title={"Tìm kiếm nâng cao"}
            isShow={isShowModal}
            onHide={() => result(false)}
            bottom={
                <View
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    paddingHorizontal={10}
                    paddingVertical={10}
                >
                    <TVSButton
                        type="danger"
                        onPress={() => {
                            result(false);
                        }}
                        icon={'close'}
                        buttonStyle="3"
                    >
                        Đóng lại
                    </TVSButton>

                    <TVSButton
                        type="primary"
                        onPress={() => {
                            result(true);
                        }}
                        icon={'magnify'}
                        buttonStyle="3"
                    >
                        Tìm kiếm
                    </TVSButton>
                </View>
            }
        >
            <View
                height={45}
                paddingHorizontal={10}
                style={{ justifyContent: "center" }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleLoaiMay(!modalVisibleLoaiMay)
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
                            borderRadius: 6,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                            height: 45,
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentLoaiMay.code == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentLoaiMay.code_nm}
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
                style={{ 
                    justifyContent: "center" ,
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setModalVisibleTrangThai(!modalVisibleTrangThai)
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
                            borderRadius: 6,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            flexDirection: "row",
                            height: 45,
                        }}
                    >
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            <Text
                                style={{
                                    color:
                                        currentTrangThai.code == 0
                                            ? "#B2B2B2"
                                            : Color.mainColor,
                                }}
                            >
                                {currentTrangThai.code_nm}
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

            <TVSTextInput
                hasLabel={false}
                height={45}
                marginBottom={0}
                placeholder={"Nhập mã máy chấm công"}
                value={maMayChamCong}
                changeValue={setMaMayChamCong}
            />

            <TVSTextInput
                hasLabel={false}
                height={45}
                marginBottom={0}
                placeholder={"Nhập tên máy chấm công"}
                value={tenMayChamCong}
                changeValue={setTenMayChamCong}
            />

            <TVSTextInput
                hasLabel={false}
                height={45}
                marginBottom={0}
                placeholder={"Nhập địa chỉ IP"}
                value={diaChiIP}
                changeValue={setDiaChiIP}
            />



            {/* Show modal */}
            {modalTrangThai()}
            {modalLoaiMay()}

        </TVSControlPopup>
    );
}

export default ModalFilter