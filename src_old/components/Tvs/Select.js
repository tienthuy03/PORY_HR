import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import * as ANT from 'react-native-animatable';
import {useSelector} from 'react-redux';
const TVSSelect = ({isShow, onSelected, data, paddingTop = 65}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  return isShow ? (
    <ANT.View
      animation={'fadeInDown'}
      duration={300}
      style={{
        zIndex: 999,
        left: 0,
        right: 0,
        // top: 65,
        top: paddingTop,
        position: 'absolute',
      }}>
      <View
        style={{
          maxHeight: 350,
          backgroundColor: 'white',
          borderRadius: 10,
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.16,
          shadowRadius: 6,
          elevation: 3,
        }}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => onSelected(item)}
                style={{
                  padding: 10,
                  backgroundColor: Color.gray,
                  marginBottom: 1,
                  marginHorizontal: 5,
                  borderRadius: 10,
                }}>
                <Text>{item.code_nm}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ANT.View>
  ) : null;
};

export default TVSSelect;
