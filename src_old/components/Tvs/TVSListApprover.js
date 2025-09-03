import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {Color} from '../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../Block';
import Button from '../Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import React, {useState} from 'react';
const TVSListApprover = ({
  disabled = false,
  colorLabel = Color.mainColor,
  mode,
  required = false,
  multiDateTime = false,
  label,
  onChangeDateTime,
  value,
  label2,
  onChangeDateTime2,
  value2,
  hasLabel = true,
  data,
  icon = 'account-check-outline',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dataInsertApprove, setDataInsertApprove] = useState(data);

  return (
    <View>
      <TouchableOpacity
        style={{
          margin: 10,
        }}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(!expanded);
        }}>
        <View
          style={{
            paddingVertical: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
            flexDirection: 'row',
            backgroundColor: Color.gray,
          }}>
          <View
            style={{
              marginLeft: 5,
            }}>
            <Icon name={icon} size={30} color={'#5A94E7'} />
          </View>
          <View
            style={{
              flex: 1,
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <View>
              <Text
                style={{
                  color: Color.mainColor,
                  paddingLeft: 5,
                }}>
                {label}
              </Text>
            </View>
          </View>
          <View
            style={{
              minWidth: 5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              marginRight: 5,
            }}>
            <Text
              style={{
                color: 'red',
                fontWeight: 'bold',
              }}>
              {dataInsertApprove.length}
            </Text>
          </View>
          <View
            style={{
              marginRight: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              size={30}
              color={Color.mainColor}
              name={expanded ? 'chevron-up' : 'chevron-down'}
            />
          </View>
        </View>
      </TouchableOpacity>
      {expanded && (
        <ScrollView maxHeight={100} style={{marginBottom: 10}}>
          {dataInsertApprove.length > 0
            ? dataInsertApprove.map(item => (
                <View
                  style={{
                    marginHorizontal: 20,
                    marginBottom: 5,
                    borderRadius: 6,
                    borderColor: Color.gray,
                    borderWidth: 2,
                    paddingVertical: 10,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    backgroundColor: Color.tabColor,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 5,
                      justifyContent: 'center',
                    }}>
                    <View>
                      <Text style={{color: Color.mainColor}}>
                        {item.approve_name}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            : null}
        </ScrollView>
      )}
    </View>
  );
};

export default TVSListApprover;
