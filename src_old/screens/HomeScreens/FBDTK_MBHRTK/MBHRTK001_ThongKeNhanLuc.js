/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Modal, ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedBar from '../../../components/AnimateBar';
import Block from '../../../components/Block';
import Button from '../../../components/Button';
import Dropdown from '../../../components/DropdowPb';
import Text from '../../../components/Text';
import TVSHeader from '../../../components/Tvs/Header';
import {setHeaderChil2} from '../../../Language';
import axios from 'axios';
import {updateUserAction} from '../../../actions';
import RNRestart from 'react-native-restart';
import {useDispatch, useSelector} from 'react-redux';
import sysFetch from '../../../services/fetch';

const {width, height} = Dimensions.get('screen');
const deviceWidth = Dimensions.get('window').width;
const DELAY = 100;
const arrayColor = [
  '#F55443',
  '#FCBD24',
  '#59838B',
  '#4D98E4',
  '#418E50',
  '#7B7FEC',
  '#3ABAA4',
  '#f5b461',
  '#1ABC9C',
  '#34626c',
  '#9ad3bc',
  '#f9813a',
  '#839b97',
  '#cfd3ce',
  '#c6b497',
  '#9088d4',
  '#706897',
  '#aee6e6',
  '#28abb9',
  '#2d6187',
  '#effad3',
  '#a8dda8',
  '#5c6e91',
  '#F55443',
  '#FCBD24',
  '#9088d4',
  '#4D98E4',
  '#a8dda8',
  '#4D98E4',
  '#418E50',
  '#3ABAA4',
  '#f9813a',
  '#418E50',
  '#5c6e91',
  '#F55443',
  '#9088d4',
  '#f5b461',
  '#34626c',
  '#59838B',
  '#F55443',
  '#3ABAA4',
  '#9ad3bc',
  '#F55443',
  '#a8dda8',
  '#34626c',
  '#418E50',
  '#8f384d',
  '#7B7FEC',
  '#c6b497',
  '#dd9866',
];

const TKNL_MBHRTK002 = ({navigation: {goBack}}) => {
  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state);
  let dataMenuMBHRs;
  let language = '';
  let tokenLogin;
  let refreshToken;
  let userPk;
  try {
    dataMenuMBHRs = state.menuReducer.data.data.menu;
    language = state.loginReducers.data.data.user_language;
    tokenLogin = state.loginReducers.data.data.tokenLogin;
    refreshToken = state.loginReducers.data.data.refreshToken;
    userPk = state.loginReducers.data.data.tes_user_pk;
  } catch (error) {
    console.log('error MBHRTK001_ThongKeNhanLuc.js');
    console.log(error);
  }
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleType, setModalVisibleType] = useState(false);
  const [dataPb, setDataPb] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [valuePb, setValuePb] = useState('');
  const [labelPb, setLabelPb] = useState('');
  const [valueType, setValueType] = useState('');
  const [labelType, setLabelType] = useState('');
  const [totalWidth, setTotalWidth] = useState(0);
  const [data, setData] = useState([]);

  const getPb = () => {
    try {
      sysFetch(
        API,
        {
          pro: 'SELHRTK0010100',
          in_par: {
            p1_varchar2: userPk,
          },
          out_par: {
            p1_sys: 'pb',
            p2_sys: 'type',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('getPb', null, null);
          }
          if (rs != 'Token Expired') {
            if (rs.results == 'S') {
              if (rs.totalRow > 0) {
                let dataPb = rs.data.pb;
                setDataPb(dataPb);
                setLabelPb(rs.data.pb[0].code_nm);
                setValuePb(rs.data.pb[0].code);
                setDataType(rs.data.type);
                setValueType(rs.data.type[0].code);
                setLabelType(rs.data.type[0].code_nm);
              }
              getChart(rs.data.pb[0].code, rs.data.type[0].code);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      Alert.alert('Thông báo', 'Tải dữ liệu thất bại.', [{text: 'Xác nhận'}]);
    }
  };
  const getChart = (valuePbs, valueTypes) => {
    sysFetch(
      API,
      {
        pro: 'SELHRTK0011100',
        in_par: {
          p1_varchar2: valuePbs,
          p2_varchar2: valueTypes,
        },
        out_par: {
          p1_sys: 'chart',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getChart', valuePbs, valueTypes);
        }
        if (rs != 'Token Expired') {
          if (rs.results == 'S') {
            let dataChart = rs.data.chart;
            if (rs.totalRow > 0) {
              let datas = [];
              let widthItem;
              let widthDevi;
              let widthPer;
              let total = 0;
              dataChart.map(item => {
                total += item.amount;
              });
              setTotalWidth(total);
              dataChart.map((item, index) => {
                widthPer = ((item.amount / total) * 100).toFixed(2);
                widthItem = widthPer * Math.floor(deviceWidth / 45);
                widthDevi =
                  widthItem <= deviceWidth - 90
                    ? widthItem * 3
                    : deviceWidth - 90;
                datas.push({
                  key: index,
                  pb: item.code_nm,
                  value: widthDevi.toFixed(2),
                  count: item.amount,
                  width: widthPer,
                  color: arrayColor[index],
                });
              });
              setData(datas);
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPb();
  }, []);

  const refreshNewToken = (obj, p1, p2) => {
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
        if (obj == 'getPb') {
          getPb();
        }
        if (obj == 'getChart') {
          getChart(p1, p2);
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
            {cancelable: true},
          );
        }
        console.log(error);
      });
  };

  const getState = async result => {
    setTimeout(() => {
      setLabelPb(result.code_nm);
      setValuePb(result.code);
      getChart(result.code, valueType);
      setModalVisible(false);
    }, 100);
  };

  const getStateType = async result => {
    setTimeout(() => {
      setLabelType(result.code_nm);
      setValueType(result.code);
      getChart(valuePb, result.code);
      setModalVisibleType(false);
    }, 100);
  };

  const modalPB = (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <Button
        nextScreen={() => setModalVisible(false)}
        flex
        backgroundColor={'rgba(0,0,0,0.3)'}
        justifyCenter
        alignCenter>
        <Block
          backgroundColor={'#fff'}
          width={width * 0.8}
          justifyCenter
          radius={5}
          padding={10}>
          <Block paddingLeft={10} paddingRight={10} height={height / 2}>
            <Block
              marginBottom={10}
              paddingBottom={10}
              borderBottomColor={Color.mainColor}
              borderBottomWidth={1}>
              <Text size={20} color={Color.mainColor} fontWeight={'bold'}>
                CHỌN PHÒNG BAN
              </Text>
            </Block>
            <ScrollView>
              <Dropdown PROP={dataPb} getState={getState} codes={valuePb} />
            </ScrollView>
            <Block
              marginTop={10}
              paddingTop={10}
              borderTopColor={Color.mainColor}
              borderTopWidth={1}
              alignCenter>
              <Button
                alignCenter
                justifyCenter
                backgroundColor={Color.btnMain}
                paddingTop={10}
                paddingBottom={10}
                paddingRight={20}
                nextScreen={() => setModalVisible(false)}
                paddingLeft={20}
                radius={5}>
                <Text color={Color.white} alignCenter>
                  Đóng
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Button>
    </Modal>
  );

  const modalType = (
    <Modal animationType="fade" transparent={true} visible={modalVisibleType}>
      <Button
        nextScreen={() => setModalVisibleType(false)}
        flex
        backgroundColor={'rgba(0,0,0,0.3)'}
        justifyCenter
        alignCenter>
        <Block
          backgroundColor={'#fff'}
          width={width * 0.8}
          justifyCenter
          radius={5}
          padding={10}>
          <Block paddingLeft={10} paddingRight={10} height={height / 2}>
            <Block
              marginBottom={10}
              paddingBottom={10}
              borderBottomColor={Color.mainColor}
              borderBottomWidth={1}>
              <Text size={20} color={Color.mainColor} fontWeight={'bold'}>
                CHỌN LOẠI DỮ LIỆU
              </Text>
            </Block>
            <ScrollView>
              <Dropdown
                PROP={dataType}
                getState={getStateType}
                codes={valueType}
              />
            </ScrollView>
            <Block
              marginTop={10}
              paddingTop={10}
              borderTopColor={Color.mainColor}
              borderTopWidth={1}
              alignCenter>
              <Button
                alignCenter
                justifyCenter
                backgroundColor={Color.btnMain}
                paddingTop={10}
                paddingBottom={10}
                paddingRight={20}
                nextScreen={() => setModalVisibleType(false)}
                paddingLeft={20}
                radius={5}>
                <Text color={Color.white} alignCenter>
                  Đóng
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Button>
    </Modal>
  );

  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <TVSHeader goBack={goBack}>
        {setHeaderChil2(
          language,
          dataMenuMBHRs,
          'MBHRTK001',
          dataMenuMBHRs.filter(x => x.menu_cd === 'MBHRTK')[0].pk,
        )}
      </TVSHeader>
      <Block flex backgroundColor={Color.gray} paddingTop={5}>
        <Block margin={10} backgroundColor={Color.white} padding={5} radius={5}>
          <Block row paddingBottom={3}>
            <Text paddingLeft={5} color={Color.mainColor}>
              Phòng ban
            </Text>
          </Block>
          <Button
            nextScreen={() => setModalVisible(true)}
            row
            height={40}
            justifyContent={'space-between'}
            backgroundColor={'#F3F6F9'}
            radius={8}>
            <Block flex height={40} justifyCenter paddingLeft={10}>
              <Text numberOfLines={1} size={16} color={Color.mainColor}>
                {labelPb}
              </Text>
            </Block>
            <Block justifyCenter paddingRight={10}>
              <Icon
                name={'arrow-down-drop-circle-outline'}
                color={Color.mainColor}
                size={24}
              />
            </Block>
          </Button>
        </Block>
        <Block
          marginLeft={10}
          marginRight={10}
          marginBottom={10}
          backgroundColor={Color.white}
          padding={5}
          radius={5}>
          <Block row paddingBottom={3}>
            <Text paddingLeft={5} color={Color.mainColor}>
              Dữ liệu biểu đồ
            </Text>
          </Block>
          <Button
            nextScreen={() => setModalVisibleType(true)}
            row
            height={40}
            justifyContent={'space-between'}
            backgroundColor={'#F3F6F9'}
            radius={8}>
            <Block flex height={40} justifyCenter paddingLeft={10}>
              <Text numberOfLines={1} size={16} color={Color.mainColor}>
                {labelType}
              </Text>
            </Block>
            <Block justifyCenter paddingRight={10}>
              <Icon
                name={'arrow-down-drop-circle-outline'}
                color={Color.mainColor}
                size={24}
              />
            </Block>
          </Button>
        </Block>
        {modalPB}
        {modalType}
        <Block flex marginLeft={10} marginRight={10} marginTop={4} radius={8}>
          <Block flex height={60} paddingTop={5} paddingLeft={5}>
            <Text size={16} color={Color.mainColor} marginBottom={10}>
              Tổng số nhân viên: {totalWidth}
            </Text>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}>
              <ScrollView>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  {data.map((item, index) => (
                    <AnimatedBar
                      pbs={item.pb}
                      colors={item.color}
                      widths={item.width}
                      counts={item.count}
                      value={item.value}
                      delay={DELAY * index}
                      key={index}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default TKNL_MBHRTK002;
