import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectApprovePerson = ({
  currentSelectedPerson,
  onChangeSelectedPerson,
  currentSelectedLevel,
  orgPk,
}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  const [isShow, setIsShow] = useState(false);

  return (
    <View
      style={{
        marginTop: 10,
      }}>
      <Text
        color={Color.mainColor}
        flexWrap={'wrap'}
        paddingLeft={5}
        paddingRight={5}>
        Người phê duyệt <Text style={{color: 'red'}}>*</Text>
      </Text>
      <View
        style={{
          backgroundColor: Color.gray,
          padding: 10,
          marginTop: 5,
          borderBottomColor: Color.inputBackgroundColor,
          borderBottomWidth: 1,
          borderRadius: 6,
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => setIsShow(!isShow)}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                color:
                  currentSelectedPerson.approve_name === 'Chọn người phê duyệt'
                    ? '#B2B2B2'
                    : null,
              }}>
              {currentSelectedPerson.approve_name}
            </Text>
          </View>
          <Icon
            name={'arrow-down-drop-circle-outline'}
            color={Color.mainColor}
            size={24}
          />
        </TouchableOpacity>
        {isShow ? (
          <View
            style={{
              marginTop: 10,
            }}>
            {currentSelectedLevel.arr
              .filter(x => orgPk === x.tco_org_pk)
              .map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setIsShow(false);
                      onChangeSelectedPerson(item);
                    }}
                    key={index.toString()}
                    style={{
                      flexDirection: 'row',
                      padding: 10,
                      backgroundColor: 'white',
                      marginBottom: 5,
                      borderRadius: 6,
                    }}>
                    <Text
                      flex={1}
                      flexWrap={'wrap'}
                      paddingLeft={5}
                      paddingRight={5}>
                      {item.approve_name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default SelectApprovePerson;
