import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, Modal, ScrollView, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../components/Block';
import Button from '../../components/Button';
import DropdownLogin from '../../components/DropdowLogin';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import {deviceId} from '../../constants/index';
import IconDown from '../../icons/Back';
import ShowError from '../../services/errors';
import axios from 'axios';
import {updateUserAction} from '../../../../actions';
import RNRestart from 'react-native-restart';
import sysFetch from '../../../../services/fetch';

const {width, height} = Dimensions.get('screen');

const Question = ({route}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const state = useSelector(state => state.loginReducers);
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const dispatch = useDispatch();
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);

  const [value1, setValue1] = useState('- Chọn câu 1 -');
  const [pkValue1, setPkValue1] = useState('');
  const [code1, setCode1] = useState('');
  const [value2, setValue2] = useState('- Chọn câu 2 -');
  const [pkValue2, setPkValue2] = useState('');
  const [code2, setCode2] = useState('');

  const [] = useState(0);

  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const {email} = route.params;

  const [question_1, setQuestion_1] = useState([]);
  const [question_2, setQuestion_2] = useState([]);

  const [, setLoad] = useState(false);

  let emp_pk = '';
  let tokenLogin = '';
  let userPk;
  let refreshToken;
  try {
    emp_pk = state.data.data.thr_emp_pk;
    tokenLogin = state.data.data.tokenLogin;
    userPk = state.data.data.tes_user_pk;
    refreshToken = state.data.data.refreshToken;
  } catch (error) {}
  const getState1 = async result => {
    setTimeout(() => {
      setPkValue1(result.pk);
      setValue1(result.ques_name);
      setCode1(result.ques_code);
      setCheck1(false);
    }, 100);
  };

  const getState2 = async result => {
    setTimeout(() => {
      setPkValue2(result.pk);
      setValue2(result.ques_name);
      setCode2(result.ques_code);
      setCheck2(false);
    }, 100);
  };

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    sysFetch(
      API,
      {
        pro: 'SELCFQP0010100',
        in_par: {
          p1_varchar2: emp_pk,
        },
        out_par: {
          p1_varchar2: 'email',
          p2_sys: 'question',
        },
      },
      tokenLogin,
    )
      .then(rs => {
        if (rs == 'Token Expired') {
          refreshNewToken('getData', null);
        }
        if (rs != 'Token Expired') {
          if (rs.results === 'S') {
            if (rs.totalRow > 0) {
              setQuestion_1(rs.data.question);
              setQuestion_2(rs.data.question);
            }
          } else {
            setEmail('');
            setQuestion_1([]);
            setQuestion_2([]);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const refreshNewToken = (obj, p1) => {
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
        if (obj == 'getData') {
          getData();
        }
        if (obj == 'updatePass') {
          updatePass(p1);
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
  function dialogNoti(text) {
    Alert.alert('Thông báo', text, [{text: 'Thoát'}], {
      cancelable: false,
    });
  }

  const setValidate = () => {
    if (pkValue1 == '') {
      dialogNoti('Vui lòng chọn câu hỏi thứ nhất!');
      return;
    }
    if (question1 == '') {
      dialogNoti('Vui lòng nhập câu trả lời thứ nhất!');
      return;
    }
    if (pkValue2 == '') {
      dialogNoti('Vui lòng chọn câu hỏi thứ hai!');
      return;
    }
    if (question2 == '') {
      dialogNoti('Vui lòng nhập câu trả lời thứ hai!');
      return;
    }
    Alert.alert(
      'Xác thực bảo mật',
      'Xác nhận phương thức bảo mật?',
      [
        {
          text: 'Hủy bỏ',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Xác nhận',
          onPress: () => {
            NetInfo.fetch().then(state => {
              if (state.isConnected) {
                updatePass(true);
              } else {
                ShowError('No internet');
              }
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  const deleteDataChange = async () => {
    setLoad(true);
    await setTimeout(() => {
      All();
      // dispatch({type: RESET_STORE});
      navigation.push('LoginScreen');
      setQuestion1('');
      setQuestion2('');
      setValue1('- Chọn câu 1 -');
      setValue2('- Chọn câu 2 -');
      setPkValue1('');
      setPkValue2('');
      setCode1('');
      setCode2('');
      setLoad(false);
    }, 1000);
  };

  const updatePass = async props => {
    setLoad(true);
    if (props == true) {
      sysFetch(
        API,
        {
          pro: 'INSCFQP0010100',
          in_par: {
            p1_varchar2: emp_pk,
            p2_varchar2: email,
            p3_varchar2: code1,
            p4_varchar2: question1,
            p5_varchar2: code2,
            p6_varchar2: question2,
          },
          out_par: {
            p1_varchar2: 'out_question',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('updatePass', props);
          }
          if (rs != 'Token Expired') {
            if (rs.results === 'S') {
              Alert.alert('Thông báo', 'Xác nhận thành công!', [
                {
                  text: 'Thoát',
                  onPress: async () => {
                    await deleteDataChange();
                  },
                },
              ]);
            } else {
              setLoad(false);
              Alert.alert('Thông báo', 'Hệ thống lỗi!', [
                {
                  text: 'Thoát',
                  onPress: async () => {
                    setLoad(false);
                  },
                },
              ]);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      sysFetch(
        API,
        {
          pro: 'INSCFQP0010100',
          in_par: {
            p1_varchar2: emp_pk,
            p2_varchar2: email,
            p3_varchar2: null,
            p4_varchar2: null,
            p5_varchar2: null,
            p6_varchar2: null,
          },
          out_par: {
            p1_varchar2: 'out_question',
          },
        },
        tokenLogin,
      )
        .then(rs => {
          if (rs == 'Token Expired') {
            refreshNewToken('updatePass', props);
          }
          if (rs != 'Token Expired') {
            if (rs.results === 'S') {
              Alert.alert('Thông báo', 'Xác nhận thành công!', [
                {
                  text: 'Thoát',
                  onPress: async () => {
                    await deleteDataChange();
                  },
                },
              ]);
            } else {
              setLoad(false);
              Alert.alert('Thông báo', 'Hệ thống lỗi!', [
                {
                  text: 'Thoát',
                  onPress: async () => {
                    setLoad(false);
                  },
                },
              ]);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const modalPK1 = (
    <Modal animationType="fade" transparent={true} visible={check1}>
      <Block flex backgroundColor={'rgba(0,0,0,0.3)'} justifyCenter alignCenter>
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}>
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownLogin
                PROP={question_1.filter(value => value.pk !== pkValue2)}
                getState={getState1}
                pk={pkValue1}
              />
            </ScrollView>
          </Block>
        </Block>
      </Block>
    </Modal>
  );

  const modalPK2 = (
    <Modal animationType="fade" transparent={true} visible={check2}>
      <Block flex backgroundColor={'rgba(0,0,0,0.3)'} justifyCenter alignCenter>
        <Block
          backgroundColor={Color.white}
          width={width * 0.9}
          justifyCenter
          radius={10}
          paddingTop={15}>
          <Block paddingLeft={10} paddingRight={10}>
            <ScrollView>
              <DropdownLogin
                PROP={question_2.filter(value => value.pk !== pkValue1)}
                getState={getState2}
                pk={pkValue2}
              />
            </ScrollView>
          </Block>
        </Block>
      </Block>
    </Modal>
  );

  const navigation = useNavigation();
  return (
    <Block flex backgroundColor={Color.gray}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      <Block
        absolute
        width={width}
        height={height / 8}
        backgroundColor={Color.btnMain}
        borderBottomRightRadius={8}
        borderBottomLeftRadius={8}
      />
      <Block
        row
        justifyContent={'space-between'}
        paddingLeft={15}
        marginBottom={30}
        alignCenter
        marginTop={45}>
        <Block width={7} height={29} />
        <Text
          size={20}
          color={Color.white}
          fontFamily={'Roboto-Bold'}
          textAlign={'center'}>
          Nhập câu hỏi bảo mật!
        </Text>
        <Block width={7} height={29} />
      </Block>
      <Block justifyCenter flex>
        <Block
          padding={10}
          backgroundColor={Color.white}
          marginLeft={10}
          marginRight={10}
          radius={10}>
          <Text color={Color.mainColor} size={18} fontFamily={'Roboto-Medium'}>
            Chọn câu hỏi bảo mật?
          </Text>
          <Block
            radius={10}
            marginLeft={10}
            marginRight={10}
            alignCenter
            paddingBottom={10}
            backgroundColor={Color.white}>
            <Button
              nextScreen={() => setCheck1(true)}
              height={60}
              row
              alignCenter
              borderBottomWidth={1}
              borderBottomColor={'rgba(0,0,0,0.2)'}
              justifyContent={'space-between'}>
              <Text
                paddingRight={20}
                color={Color.mainColor}
                flex
                fontFamily={'Roboto-Medium'}
                size={16}
                paddingLeft={10}
                height={60}>
                {value1}
              </Text>
              <Block
                paddingBottom={30}
                style={{transform: [{rotate: '-90deg'}]}}>
                <IconDown color={Color.mainColor} />
              </Block>
            </Button>
            {modalPK1}
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}>
              <TextInput
                flex
                height={55}
                fontFamily={'Roboto-Medium'}
                placeholder={'Nhập câu trả lời'}
                placeholderTextColor={Color.grayPlahoder}
                value={question1}
                onChangeText={text => setQuestion1(text)}
              />
            </Block>
            <Button
              nextScreen={() => setCheck2(true)}
              height={60}
              row
              alignCenter
              borderBottomWidth={1}
              borderBottomColor={'rgba(0,0,0,0.2)'}
              justifyContent={'space-between'}>
              <Text
                paddingRight={20}
                color={Color.mainColor}
                flex
                fontFamily={'Roboto-Medium'}
                size={16}
                paddingLeft={10}
                height={60}>
                {value2}
              </Text>
              <Block
                paddingBottom={30}
                style={{transform: [{rotate: '-90deg'}]}}>
                <IconDown color={Color.mainColor} />
              </Block>
            </Button>
            {modalPK2}
            <Block
              marginTop={10}
              paddingLeft={20}
              radius={8}
              height={55}
              alignCenter
              row
              backgroundColor={Color.inputBackgroundColor}>
              <TextInput
                flex
                height={55}
                fontFamily={'Roboto-Medium'}
                placeholder={'Nhập câu trả lời'}
                placeholderTextColor={Color.grayPlahoder}
                value={question2}
                onChangeText={text => setQuestion2(text)}
              />
            </Block>
          </Block>
          <Block
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
            justifyEnd
            alignCenter>
            <Button
              radius={10}
              nextScreen={() => setValidate()}
              backgroundColor={Color.btnMain}
              height={60}
              row
              width={'90%'}
              alignCenter
              justifyCenter>
              <Text fontFamily={'Roboto-Bold'} color={Color.white} size={20}>
                Xác nhận
              </Text>
            </Button>
          </Block>
          <Block alignCenter paddingBottom={20} marginTop={5}>
            <Button
              nextScreen={() => {
                if (email == null) {
                  Alert.alert(
                    'Xác thực bảo mật',
                    'Chưa nhập bất kỳ thông tin gì, thông tin bảo mật sẽ bị hủy cập nhật. Bạn có thể cập nhật lại sau khi đăng nhập.',
                    [
                      {
                        text: 'Hủy bỏ',
                        style: 'cancel',
                      },
                      {
                        text: 'Xác nhận',
                        onPress: () => {
                          deleteDataChange();
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  Alert.alert(
                    'Xác thực bảo mật',
                    'Bạn có chắc muốn bỏ câu hỏi bí mật?',
                    [
                      {
                        text: 'Hủy bỏ',

                        style: 'cancel',
                      },
                      {
                        text: 'Xác nhận',
                        onPress: () => {
                          updatePass(false);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                }
              }}>
              <Text
                fontFamily={'Roboto-Medium'}
                size={16}
                textDecorationLine={'underline'}>
                Bỏ qua
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Question;
