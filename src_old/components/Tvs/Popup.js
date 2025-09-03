import React, {useState} from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import {Color} from '../../colors/colortv';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TVSPopup = () => {
  const [isShow, setIsShow] = useState(true);
  const onHide = () => {
    setIsShow(false);
  };
  return (
    <Modal transparent={true} visible={isShow}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(00,00,00,.1)',
        }}>
        <HideArea onHide={onHide} />
        <View
          style={{
            marginHorizontal: 10,
            backgroundColor: 'white',
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
              padding: 20,
              flexDirection: 'row',
              backgroundColor: 'rgba(00,00,00,.03)',
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
            }}>
            <PopupTitle>This is my Title</PopupTitle>
            <TouchableOpacity style={{}}>
              <Icon size={20} color={Color.mainColor} name={'close'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 20,
              borderTopColor: Color.borderColor,
              borderTopWidth: 1,
              borderBottomColor: Color.borderColor,
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                padding: 20,
                borderRadius: 10,
                backgroundColor: '#ffffe6',
                marginVertical: 5,
              }}>
              <Text style={{color: '#404040'}}>
                This is my content for the testing modal and this is very long
                for the example content
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                padding: 10,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: Color.mainColor,
                }}>
                <Icon name={'close'} /> Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
                backgroundColor: Color.btnMain,
              }}>
              <Text
                style={{
                  color: 'white',
                }}>
                <Icon name={'check'} /> Accept
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <HideArea onHide={onHide} />
      </View>
    </Modal>
  );
};
const PopupTitle = ({children}) => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: Color.mainColor,
        }}>
        {children}
      </Text>
    </View>
  );
};
const HideArea = ({onHide}) => {
  return <TouchableOpacity style={{flex: 1}} onPress={onHide} />;
};

export default TVSPopup;
