import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Color } from '../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as AMT from 'react-native-animatable';
import TVSButton from './Button';
const TVSPopup = ({
  isShow,
  onHide,
  children,
  title,
  maxHeight = 550,
  minHeight,
  onAccept = null,
  backgroundColor = 'white',
}) => {
  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(00,00,00,.1)',
        }}>
        <HideArea onHide={onHide} />
        <AMT.View
          duration={300}
          animation={'fadeInUp'}
          style={{
            marginHorizontal: 10,
            backgroundColor: backgroundColor,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 2,
          }}>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              backgroundColor: 'rgba(00,00,00,.03)',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              justifyContent: 'center',
            }}>
            <PopupTitle>{title}</PopupTitle>
          </View>
          <View
            style={{
              padding: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
              maxHeight,
              minHeight,
            }}>
            {children}
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
              // backgroundColor: 'rgba(00,00,00,.03)',
              justifyContent: 'center',
            }}>
            <TVSButton
              buttonStyle={'3'}
              type={'danger'}
              icon={'close'}
              onPress={onHide}>
              Đóng
            </TVSButton>
            {onAccept && (
              <TVSButton
                buttonStyle={'3'}
                icon={'check'}
                onPress={() => {
                  onHide();
                  onAccept();
                }}>
                Đồng ý
              </TVSButton>
            )}
          </View>
        </AMT.View>
        <HideArea onHide={onHide} />
      </View>
    </Modal>
  );
};
const PopupTitle = ({ children }) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: Color.mainColor,
          textAlign: 'center',
        }}>
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({ onHide }) => {
  return <TouchableOpacity style={{ flex: 1 }} onPress={onHide} />;
};

export default TVSPopup;
