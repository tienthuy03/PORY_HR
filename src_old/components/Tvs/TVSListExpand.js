import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import { Color } from '../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Block from '../Block';
import Button from '../Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import React, { useState } from 'react';
const TVSListExpand = ({
  children,
  disabled = false,
  colorLabel = 'black',
  label,
  icon = 'account-check-outline',
  hasIcon = false,
  backgroundColor = Color.lightgray,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

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
            backgroundColor: backgroundColor,
          }}>
          {hasIcon ? (
            <View
              style={{
                marginLeft: 5,
              }}>
              <Icon name={icon} size={30} color={'#5A94E7'} />
            </View>
          ) : null}
          <View
            style={{
              flex: 1,
              marginLeft: 5,
              justifyContent: 'center',
            }}>
            <View>
              <Text
                style={{
                  color: colorLabel,
                  paddingLeft: 5,
                  fontWeight: 'bold',
                }}>
                {label}
              </Text>
            </View>
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
      {expanded ? children : null}
    </View>
  );
};

export default TVSListExpand;
