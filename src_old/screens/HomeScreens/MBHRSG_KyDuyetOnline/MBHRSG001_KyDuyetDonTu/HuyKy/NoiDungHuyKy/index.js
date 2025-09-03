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
// import PopupTextInput from './Popup_TextInput';

const NoiDungHuyKy = ({ navigation: { goBack }, route }) => {

    const { item, thr_master_pk, thr_file_pk, onRefresh } = route.params;
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
    const [dataPDF, setDataPDF] = useState([]);
    const [dataMaster, setDataMaster] = useState([]);
    const [dataFile, setDataFile] = useState([]);

    const styles = StyleSheet.create({
        modalContainer: {
            justifyContent: 'space-between',
        },
        modalOneCol1: {
            width: '80%',
        },
        modalOneCol2: {
            width: '20%',
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
        cancel: {
            color: '#008B8B'
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
                setDataMaster(res.data.danhSach_huyKy);
                setDataFile(res.data.file_huyKy);

                console.log('Data M', res.data.danhSach_huyKy.map(item => ({
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

    const handleViewAll = () => {
        const pdfArray = dataMaster.filter((item) => item.base64);
        if (pdfArray.length > 0) {
            setModalPDFVisible(true);
            setDataPDF(pdfArray.map((item) => item.base64));
        } else {
            Alert.alert('Thông báo', 'Không có file PDF để hiển thị');
        }
    };

    const modalPDF = (
        <PopupPDF
            title={'Quyết định'}
            isShow={modalPDFVisible}
            dataPDF={dataPDF}
            onHide={() => setModalPDFVisible(false)}></PopupPDF>
    );

    return (
        <Block flex backgroundColor={Color.backgroundColor}>
            <TVSHeader goBack={goBack}>Nội dung trình ký</TVSHeader>
            <Block flex backgroundColor={Color.gray}>
                <ScrollView>
                    {modalPDF}
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
                                {Object.entries(item).map((oneField) => {
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
                        <TVSListExpand label={'Danh sách đăng kí'}>
                            {dataMaster.map((item) => (
                                <Block>
                                    <Block style={styles.container}>
                                        <Block style={styles.modalOneRecordHeader}>
                                            <Block style={styles.modalOneCol1}>
                                                <Text style={styles.text}>Họ và tên: {item.full_name}</Text>
                                                <Text style={styles.text}>Phòng ban: {item.org_nm}</Text>
                                                <Text style={styles.text}>
                                                    {'Trạng thái: '}
                                                    <Text style={[item.approve_status === '5' ? styles.cancel : '']}>
                                                        {item.approve_status === '5' ? 'Hủy phiếu' : ''}
                                                    </Text>
                                                </Text>

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
                        <TVSListExpand label={'File đính kèm'}>
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
                        }}>
                        </View>
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
                            marginRight: 10,
                            marginLeft: 5,
                        }}>
                        </View>
                    </Block>
                </ScrollView>
            </Block >
        </Block >

    )
}

export default NoiDungHuyKy;