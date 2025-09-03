import moment from 'moment';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import Block from '../../../../components/Block';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import Icon_back from '../../../../icons/Back';

const MBHRMN006_DiemDanh = ({navigation: {goBack}}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const styles = StyleSheet.create({});

  const dispatch = useDispatch();
  const API = useSelector(state => state.SysConfigReducer.API_URL);
  const currentLangue = useSelector(
    state => state.loginReducers.data.data.user_language,
  );
  const employee_pk = useSelector(
    state => state.loginReducers.data.data.thr_emp_pk,
  );

  const tokenLogin = useSelector(
    state => state.loginReducers.data.data.tokenLogin,
  );
  const menu = useSelector(state => state.menuReducer.data.data.menu);
  return (
    <Block flex backgroundColor={Color.backgroundColor}>
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle="light-content"
      />
      <Block
        row
        alignCenter
        justifyContent={'space-between'}
        paddingLeft={15}
        paddingBottom={Platform.OS === 'ios' ? 10 : 15}
        paddingTop={Platform.OS === 'ios' ? 15 : 5}
        marginTop={30}>
        <Button
          paddingTop={10}
          width={40}
          height={40}
          nextScreen={() => goBack()}>
          <Icon_back color={Color.white} />
        </Button>
        <Text
          size={20}
          color={Color.white}
          fontFamily={'Roboto-Bold'}
          paddingRight={40}
          textAlign={'center'}>
          {menu.filter(x => x.menu_cd === 'MBHRMN006').length > 0 &&
            menu.filter(x => x.menu_cd === 'MBHRMN006')[0][
              currentLangue.toLowerCase()
            ]}
        </Text>
        <Block backgroundColor={Color.white} width={7} height={29} />
      </Block>
      <Block flex backgroundColor={Color.gray}></Block>
    </Block>
  );
};

export default MBHRMN006_DiemDanh;
