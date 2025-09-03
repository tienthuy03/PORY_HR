import React, {useState} from 'react';
import {Alert} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Block from '../../../components/Block';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import TextInput from '../../../components/TextInput';
import {sendMail} from '../../../config/Fetch_data';
const QuestionMethod = ({username}) => {
  const Color = useSelector((s) => s.SystemReducer.theme);
  const [Email, setEmail] = useState('');
  const userEmail = useSelector((s) => s.ForgotPasswordReducer.info.email);
  const {ques_name_1, ques_value_2, ques_value_1, ques_name_2} = useSelector(
    (s) => s.ForgotPasswordReducer.info,
  );

  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  //onChecking
  const onChecking = () => {
    if (Email === userEmail) {
      sendMail(API, username, userEmail, username)
        .then((ress) => {
          if (ress.status === 'S') {
            Alert.alert(
              'Thông báo',
              'Đã gửi mật khẩu mới đến email. Vui lòng kiểm tra lại!',
              [
                {
                  text: 'Thoát',
                },
              ],
            );
          } else if (ress.status === 'F') {
            Alert.alert('Thông báo', ress.result, [
              {
                text: 'Thoát',
                onPress: async () => {},
              },
            ]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      Alert.alert(
        'Thông báo',
        'Email không đúng. Vui lòng kiểm tra lại !',
        [{text: 'Đóng', onPress: () => {}}],
        {cancelable: false},
      );
    }
  };
  //render view
  return (
    <Block flex backgroundColor={'#fff'} padding={10}>
      <Block>
        <Text style={{color: Color.mainColor, marginBottom: 10}}>
          Câu 1: {ques_name_1}
        </Text>
        {/* <Text style={{color: Color.mainColor, marginBottom: 10}}>
          Trả lời câu hỏi 1
        </Text> */}
        <TextInput
          size={15}
          padding={15}
          borderRadius={5}
          //   editable={info.isExist === '1' ? false : true}
          backgroundColor={Color.inputBackgroundColor}
          placeholderTextColor={Color.grayPlahoder}
          value={Email}
          onChangeText={(value) => {
            setEmail(value);
          }}
        />
      </Block>
      <Block marginTop={20} marginBottom={20}>
        <Text style={{color: Color.mainColor, marginBottom: 10}}>
          Câu 2: {ques_name_2}
        </Text>
        {/* <Text style={{color: Color.mainColor, marginBottom: 10}}>
          Trả lời câu hỏi 2
        </Text> */}
        <TextInput
          size={15}
          padding={15}
          borderRadius={5}
          //   editable={info.isExist === '1' ? false : true}
          backgroundColor={Color.inputBackgroundColor}
          placeholderTextColor={Color.grayPlahoder}
          value={Email}
          onChangeText={(value) => {
            setEmail(value);
          }}
        />
      </Block>
      <Block marginTop={10} justifyCenter alignCenter>
        <Button
          style={{borderRadius: 5}}
          backgroundColor={Color.mainColor}
          nextScreen={Email.length === 0 ? null : onChecking}>
          <Text padding={15} color={Color.white}>
            <MaterialCommunityIcons name="send" size={17} /> Xác nhận
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

export default QuestionMethod;
