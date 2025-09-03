import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import Block from '../../../../../components/Block';
import OneField from '../../../../../components/OneFieldKeyValue';
import TextInput from '../../../../../components/TextInput';
import TVSButton from '../../../../../components/Tvs/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectLevelApprove = ({
  onChangeSelectedPerson,
  currentSelectedLevel,
  onChangeSelectedLevel,
  approveInfo,
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
        Vai trò phê duyệt <Text style={{color: 'red'}}>*</Text>
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
                  currentSelectedLevel.name === 'Chọn vai trò phê duyệt'
                    ? '#B2B2B2'
                    : null,
              }}>
              {currentSelectedLevel.name}
            </Text>
          </View>
          <Icon
            name={'arrow-down-drop-circle-outline'}
            color={Color.mainColor}
            size={24}
          />
        </TouchableOpacity>
        {isShow && (
          <View
            style={{
              marginTop: 10,
            }}>
            {approveInfo.map((item, index) => {
              if (item.name === currentSelectedLevel.name) {
                return null;
              }

              if (item.arr.length > 0) {
                let checkTemp = false;
                item.arr.map(x => {
                  if (x.tco_org_pk === orgPk) {
                    checkTemp = true;
                  }
                });
                if (!checkTemp) {
                  return;
                }
              }
              return (
                <TouchableOpacity
                  onPress={() => {
                    setIsShow(false);
                    onChangeSelectedLevel(item);
                    onChangeSelectedPerson({
                      approve_name: 'Chọn người phê duyệt',
                    });
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
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

export default SelectLevelApprove;
