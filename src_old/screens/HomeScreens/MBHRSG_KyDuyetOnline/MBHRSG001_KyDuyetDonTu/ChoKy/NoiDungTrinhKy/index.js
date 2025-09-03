import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from 'react-native'
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block'
import TVSHeader from '../../../../../../components/Tvs/Header';
import Typography from '../../../../../../components/Text';
import TVSListExpand from '../../../../../../components/Tvs/TVSListExpand';
import Text from '../../../../../../components/Text';
import OneField from '../../../../../../components/OneFieldKeyValue';
import sysFetch from "../../../../../../services/fetch_v1";
import { APP_VERSION } from "../../../../../../config/Pro";
import PopupPDF from './Popup_PDF';
import { useNavigation } from '@react-navigation/native';
import TVSButton from '../../../../../../components/Tvs/Button';
import PopupTextInput from './Popup_TextInput';

const NoiDungTrinhKy = ({ navigation: { goBack }, route }) => {

    const { item, thr_master_pk, thr_file_pk, onRefresh } = route.params;
    // const isSigned = item.trangthai === 'Đã ký' ? true : false;
    const API = useSelector(state => state.SysConfigReducer.API_URL);
    // Theme Color
    const Color = useSelector(s => s.SystemReducer.theme);
    // Reducers info login
    const loginReducers = useSelector(state => state.loginReducers);
    // Reducers menu
    const menuReducer = useSelector(state => state.menuReducer);
    let refreshToken = useSelector(
        state => state.loginReducers.data.data.refreshToken,
    );
    let thr_approve_pk;
    let tokens;
    let fullname;
    let crt_by;
    try {
        tokens = loginReducers.data.data.tokenLogin;
        thr_approve_pk = loginReducers.data.data.thr_emp_pk;
        fullname = loginReducers.data.data.full_name;
        crt_by = loginReducers.data.data.crt_by;
    } catch (error) {
        //
    }

    const navigation = useNavigation();
    const [modalPDFVisible, setModalPDFVisible] = useState(false);
    const [modalTextInputVisible, setModalTextInputVisible] = useState(false);
    const [modalTextInputIndex, setModalTextInputIndex] = useState([]);
    const [dataPDF, setDataPDF] = useState([]);
    const [dataMaster, setDataMaster] = useState([]);
    const [dataFile, setDataFile] = useState([]);

    const styles = StyleSheet.create({
        modalContainer: {
            justifyContent: 'space-between',
        },
        modalOneCol1: {
            width: '60%',
        },
        modalOneCol2: {
            width: '15%',
        },
        modalOneCol3: {
            paddingRight: 10,
            width: '25%',
        },
        text: {
            paddingLeft: 10,
            textAlign: 'left',
        },
        modalOneRecordHeader: {
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10,
            padding: 2,
            borderRadius: 5,
            borderColor: '#ccc',
            marginBottom: 1,
            backgroundColor: Color.white,
            justifyContent: 'center',
            alignItems: 'center',
        },
        warning: {
            color: '#ffc107',
        },
        success: {
            color: '#28a745',
        },
        danger: {
            color: '#dc3545',
        },
    });

    useEffect(() => {
        getDataEmp();
    }, [thr_master_pk]);

    const getDataEmp = () => {
        sysFetch(
            API,
            {
                pro: 'SELHRSG001000',
                in_par: {
                    p1_varchar2: thr_approve_pk,
                    p2_varchar2: '',
                    p3_varchar2: '',
                    p4_varchar2: '',
                    p5_varchar2: APP_VERSION,
                    p6_varchar2: crt_by,
                    p7_varchar2: thr_master_pk,
                    p8_varchar2: thr_file_pk,
                },
                out_par: {
                    p1_sys: 'loaiVanBan',

                    p2_sys: 'choKy',
                    p3_sys: 'danhSach_ChoKy',
                    p4_sys: 'file_ChoKy',

                    p5_sys: 'daKy',
                    p6_sys: 'danhSach_daKy',
                    p7_sys: 'file_daKy',

                    p8_sys: 'huyKy',
                    p9_sys: 'danhSach_huyKy',
                    p10_sys: 'file_huyKy',
                },
            },
            tokens,
        )
            .then(res => {
                setDataMaster(res.data.danhSach_ChoKy.map(item => {
                    if (item.approve_status !== '3') {
                        item.approve_status = '3';
                    }
                    return item;
                }));
                setDataFile(res.data.file_ChoKy);

                console.log('Data M', res.data.danhSach_ChoKy.map(item => ({
                    APPROVE_STATUS: item.approve_status,
                    EMP_PK: item.emp_pk,
                    FULL_NAME: item.full_name,
                    ORG_NM: item.org_nm,
                    PK: item.pk,
                    base64: item.base64.substr(0, 10)
                })));
            })
            .catch(error => {
                console.log('error');
                console.log(error);
            });
    };

    const onUpdateData = (data) => {
        const { detail_pk, approve_status, description, flag, view_yn } = data;
        console.log({
            p1_varchar: 'UPDATE',
            p2_varchar2: detail_pk,
            p3_varchar2: thr_master_pk.toString(),
            p4_varchar2: approve_status,
            p5_varchar2: thr_approve_pk,
            p6_varchar2: description,
            p7_varchar2: flag,
            p8_varchar2: view_yn,
            p9_varchar2: APP_VERSION,
            p10_varchar2: crt_by,
        })

        sysFetch(
            API,
            {
                pro: 'UPDHRSG001000',
                in_par: {
                    p1_varchar: 'UPDATE',
                    p2_varchar2: detail_pk,
                    p3_varchar2: thr_master_pk.toString(),
                    p4_varchar2: approve_status,
                    p5_varchar2: thr_approve_pk,
                    p6_varchar2: description,
                    p7_varchar2: flag,
                    p8_varchar2: view_yn,
                    p9_varchar2: APP_VERSION,
                    p10_varchar2: crt_by,
                },
                out_par: {
                },
            },
            tokens,
        ).then(rs => {
            console.log(rs);
            if (rs == 'Token Expired') {
                refreshNewToken('onUpdateData');
            }
        }).catch(error => {
            console.log('error');
            console.log(error);
        });
    };

    const onRefuseData = (data) => {
        const { approve_status, description } = data;
        console.log({
            p1_varchar2: thr_master_pk.toString(),
            p2_varchar2: approve_status,
            p3_varchar2: description,
            p4_varchar2: APP_VERSION,
            p5_varchar2: crt_by,
        })

        sysFetch(
            API,
            {
                pro: 'PROHRSG001000',
                in_par: {
                    p1_varchar2: thr_master_pk.toString(),
                    p2_varchar2: approve_status,
                    p3_varchar2: description,
                    p4_varchar2: APP_VERSION,
                    p5_varchar2: crt_by,
                },
                out_par: {
                    p1_sys: 'result',
                },
            },
            tokens,
        ).then(rs => {
            console.log(rs);
            if (rs == 'Token Expired') {
                refreshNewToken('onControlData');
            }
        }).catch(error => {
            console.log('error');
            console.log(error);
        });
    };

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
                if (obj == 'onUpdateData') {
                    onUpdateData();
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

    const handleViewAll = () => {
        const pdfArray = dataMaster.filter((item) => item.base64);
        if (pdfArray.length > 0) {
            setModalPDFVisible(true);
            setDataPDF(pdfArray.map((item) => item.base64));
        } else {
            Alert.alert('Thông báo', 'Không có file PDF để hiển thị');
        }
    };

    const onRefuse = (modalTextInputIndex, lyDo) => {
        const updatedDataMaster = [...dataMaster];
        if (modalTextInputIndex === '-1') {
            const data = {
                approve_status: '5',
                description: lyDo,
            };

            onRefuseData(data);

            Alert.alert(
                'Thông báo',
                'Quyết định đã bị từ chối',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            navigation.goBack();
                            onRefresh();
                        }
                    },
                ],
                {
                    cancelable: true,
                },
            );
        } else {
            updatedDataMaster[modalTextInputIndex].approve_status = '4';
            updatedDataMaster[modalTextInputIndex].description = lyDo;
        };

        setDataMaster(updatedDataMaster);

    }

    const onApproveMain = async (type) => {
        if (type === 'D') {
            // Lấy dữ liệu
            let promises = [];
            dataMaster.forEach((item) => {
                let description = '';
                if (item.description) {
                    description = item.description;
                }
                const data = {
                    detail_pk: item.pk,
                    approve_status: item.approve_status,
                    description,
                    flag: 'D',
                    view_yn: item.approve_status === '3' ? 'Y' : item.approve_status === '4' ? 'N' : '',
                };
                promises.push(onUpdateData(data));
            });

            // Chờ tất cả các hàm onUpdateData được thực thi
            await Promise.all(promises);

            // Thông báo phê duyệt thành công
            Alert.alert(
                'Thông báo',
                'Xác nhận phê duyệt quyết định',
                [
                    {
                        text: 'Xác nhận',
                        onPress: () => {
                            onApproveMain('M');
                        }
                    },
                ],
                {
                    cancelable: true,
                },
            );
        } else if (type === 'M') {

            dataMaster.forEach((item) => {
                const data = {
                    detail_pk: item.pk,
                    approve_status: '3',
                    description: '',
                    flag: 'M',
                    view_yn: '',
                };
                onUpdateData(data);
            })


            // Thông báo thao tác thành công
            Alert.alert(
                'Thông báo',
                'Quyết định đã được phê duyệt',
                [
                    {
                        text: 'Ok',
                        onPress: () => {
                            navigation.goBack();
                            onRefresh();
                        }
                    },
                ],
                {
                    cancelable: true,
                },
            );
        }
    };

    const onConfirm = (type) => {
        Alert.alert(
            'Thông báo',
            'Xác nhận trạng thái phê duyệt',
            [
                { text: 'Xác nhận', onPress: () => onApproveMain(type) },
                {
                    text: 'Không',
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            },
        );
    };

    const modalPDF = (
        <PopupPDF
            title={'Quyết định'}
            isShow={modalPDFVisible}
            dataPDF={dataPDF}
            onHide={() => setModalPDFVisible(false)}></PopupPDF>
    );

    const modalTextInput = (
        <PopupTextInput
            title={'Lý do từ chối phê duyệt'}
            isShow={modalTextInputVisible}
            onHide={() => setModalTextInputVisible(false)}
            onSave={(lyDo) => { onRefuse(modalTextInputIndex, lyDo); setModalTextInputVisible(false) }}
        ></PopupTextInput >
    );

    return (
        <Block flex backgroundColor={Color.backgroundColor}>
            <TVSHeader goBack={goBack}>Nội dung trình ký</TVSHeader>
            <Block flex backgroundColor={Color.gray}>
                <ScrollView>
                    {modalPDF}
                    {modalTextInput}
                    <Block backgroundColor={'#FFFFFF'}
                        alignCenter
                        margin={10}
                        padding={10}
                        radius={10}>
                        <Typography size={20} center
                            color={Color.mainColor}
                            fontFamily={'Roboto-Bold'}>
                            {item.decis_content === '' ? item['_loại quyết định'] : item.decis_content}
                        </Typography>
                    </Block>
                    <Block>
                        <TVSListExpand label={'Thông tin trình ký'} defaultExpanded={true}>
                            <Block backgroundColor={Color.white}
                                radius={16}
                                marginLeft={10}
                                marginRight={10}
                                paddingLeft={5}
                                paddingRight={5}
                                borderColor={Color.oneContentBorder}
                                borderWidth={1}>
                                {Object.entries(item).map((oneField, index) => {
                                    return (
                                        oneField[0].substr(0, 1) === '_' && (
                                            <OneField
                                                value={oneField[1]}
                                                keyName={
                                                    oneField[0].replace('_', '').substr(0, 1).toUpperCase() +
                                                    oneField[0]
                                                        .replace('_', '')
                                                        .substr(1, oneField[0].replace('_', '').length)
                                                }
                                            />
                                        )
                                    );
                                })}
                            </Block>
                        </TVSListExpand>
                    </Block>
                    <Block>
                        <TVSListExpand
                            label={'Danh sách nhân viên'}>
                            {dataMaster.map((item, index) => (
                                <Block>
                                    <Block style={styles.container}>
                                        <Block style={styles.modalOneRecordHeader}>
                                            <Block style={styles.modalOneCol1}>
                                                <Text style={styles.text}>Họ và tên: {item.full_name}</Text>
                                                <Text style={styles.text}>Phòng ban: {item.org_nm}</Text>
                                                <Text style={styles.text}>
                                                    {'Trạng thái: '}
                                                    <Text style={[item.approve_status === '2' ? styles.warning : item.approve_status === '3' ? styles.success : item.approve_status === '4' ? styles.danger : '']}>
                                                        {item.approve_status === '2' ? 'Chờ xác nhận' : item.approve_status === '3' ? 'Đã xác nhận' : item.approve_status === '4' ? 'Không xác nhận' : ''}
                                                    </Text>
                                                </Text>
                                                {item.approve_status === '4' &&
                                                    <Text style={styles.text}>Lý do: {item.description}</Text>
                                                }
                                            </Block>
                                            <Block style={styles.modalOneCol2}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (item.base64) {
                                                            setModalPDFVisible(true);
                                                            setDataPDF(item.base64);
                                                        } else {
                                                            Alert.alert('Thông báo', 'Không có file PDF để hiển thị');
                                                        }
                                                    }}
                                                    style={{
                                                        marginLeft: 5,
                                                        marginRight: 10,
                                                    }}>
                                                    <View>
                                                        <Image
                                                            style={{ width: 30, height: 30 }}
                                                            source={require('../../../../../../assets/images/pdf.png')}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </Block>
                                            <Block style={styles.modalOneCol3}>
                                                {item.approve_status === '2' || item.approve_status === '4' ? (
                                                    <TVSButton
                                                        paddingHorizontal={0}
                                                        paddingVertical={0}
                                                        type={'success'}
                                                        minWidth={0}
                                                        buttonStyle={'3'}
                                                        onPress={() => {
                                                            const updatedDataMaster = [...dataMaster];
                                                            updatedDataMaster[index].approve_status = '3';
                                                            setDataMaster(updatedDataMaster);
                                                        }}>
                                                        Phê duyệt
                                                    </TVSButton>
                                                ) : null}
                                                {item.approve_status === '3' ? (
                                                    <TVSButton
                                                        paddingHorizontal={0}
                                                        paddingVertical={0}
                                                        type={'danger'}
                                                        minWidth={0}
                                                        buttonStyle={'3'}
                                                        onPress={() => {
                                                            setModalTextInputIndex(index);
                                                            setModalTextInputVisible(true);
                                                        }}>
                                                        Từ chối
                                                    </TVSButton>
                                                ) : null}
                                            </Block>
                                        </Block>
                                    </Block>
                                </Block>
                            ))}
                        </TVSListExpand>
                    </Block>
                    <Block
                        style={{
                            marginBottom: 10,
                        }}>
                        <TVSListExpand
                            label={'File đính kèm'}>
                            {dataFile.length === 0 ? (
                                <Block justifyCenter alignCenter flex marginBottom={10}>
                                    <Text>Không có file đính kèm !</Text>
                                </Block>
                            ) : (
                                <View style={{ flex: 1, marginBottom: 5 }}>
                                    {dataFile.map((item) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalPDFVisible(true);
                                                setDataPDF(item.base64);
                                            }}
                                            style={{
                                                flexDirection: 'row',
                                                backgroundColor: 'white',
                                                padding: 10,
                                                borderRadius: 10,
                                                marginBottom: 5,
                                                marginLeft: 10,
                                                marginRight: 10,
                                            }}>
                                            <View
                                                style={{
                                                    marginLeft: 10,
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                }}>
                                                <Text>{item.file_name}</Text>
                                            </View>
                                            <View>
                                                <Image
                                                    style={{ width: 80, height: 90 }}
                                                    source={require('../../../../../../assets/images/pdf.png')}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </TVSListExpand>
                    </Block>
                    <Block
                        style={{
                            flexDirection: 'row',
                            marginBottom: 10,
                        }}>
                        <View style={{
                            flex: 1,
                            marginRight: 5,
                            marginLeft: 10,
                        }}>
                            <TVSButton
                                icon={'eye'}
                                type={'secondary'}
                                buttonStyle={'3'}
                                onPress={handleViewAll}>
                                Văn bản
                            </TVSButton>
                        </View>
                        <View style={{
                            flex: 1,
                        }}>
                            <TVSButton
                                icon={'close'}
                                type={'danger'}
                                buttonStyle={'3'}
                                onPress={() => {
                                    setModalTextInputIndex('-1');
                                    setModalTextInputVisible(true);
                                }}>
                                Từ chối
                            </TVSButton>
                        </View>
                        <View style={{
                            flex: 1,
                            marginRight: 10,
                            marginLeft: 5,
                        }}>
                            <TVSButton
                                icon={'check'}
                                buttonStyle={'3'}
                                type={'primary'}
                                onPress={() => {
                                    onConfirm('D');
                                }}>
                                Phê duyệt
                            </TVSButton>
                        </View>
                    </Block>
                </ScrollView>
            </Block >
        </Block >

    )
}

export default NoiDungTrinhKy