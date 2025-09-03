import moment from 'moment';
import React from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {Color} from '../../../colors/colorhp';
import TVSButton from '../../../components/Tvs/Button';

const data = [
  {
    id: 0,
    name: 'HP00000 - Đăng ký vắng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
  {
    id: 1,
    name: 'HP00000 - Đăng ký ra cổng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
  {
    id: 2,
    name: 'HP00000 - Xác nhận tăng',
    date: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
  },
];

const Approve = () => {
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

export default Approve;
const OneItem = ({item}) => {
  return (
    <View
      style={{
        padding: 20,
        borderRadius: 20,
        marginBottom: 5,
        backgroundColor: 'white',
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
          marginBottom: 10,
          flexDirection: 'row',
        }}>
        <View>
          <Image />
        </View>
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
      </View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          flex: 1,
          paddingTop: 10,
          marginTop: 1,
          borderTopColor: Color.line,
          borderTopWidth: 1,
        }}>
        <TVSButton type={'danger'} icon={'close'}>
          Không duyệt
        </TVSButton>
        <TVSButton type={'secondary'} icon={'check'}>
          Phê duyệt
        </TVSButton>
      </View>
    </View>
  );
};
