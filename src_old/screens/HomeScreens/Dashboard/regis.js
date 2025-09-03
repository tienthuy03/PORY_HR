import moment from 'moment';
import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {Color} from '../../../colors/colorhp';
import TVSButton from '../../../components/Tvs/Button';

const data = [
  {
    id: 0,
    name: 'Đăng ký vắng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
  {
    id: 1,
    name: 'Đăng ký ra cổng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
  {
    id: 2,
    name: 'Xác nhận tăng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
];

const Regis = () => {
  return (
    <View style={{padding: 10}}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <OneItem item={item} />}
      />
    </View>
  );
};

export default Regis;
const OneItem = ({item}) => {
  return (
    <View
      style={{
        padding: 20,
        borderRadius: 20,
        marginBottom: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
        shadowColor: Color.mainColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <View
        style={{
          flex: 1,
        }}>
        <Text
          style={{
            color: Color.mainColor,
            fontWeight: 'bold',
          }}>
          {item.name}
        </Text>
        <Text>{item.date}</Text>
      </View>
      <View
        style={{
          flex: 0,
        }}>
        <TVSButton icon={'eye'}>Chi tiết</TVSButton>
      </View>
    </View>
  );
};
