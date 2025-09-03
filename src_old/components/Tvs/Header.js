import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import Icon_back from '../../icons/Back';
const TVSHeader = ({children, goBack = null}) => {
  const Color = useSelector(s => s.SystemReducer.theme);
  return (
    <LinearGradient
      start={{x: 0, y: 0.3}}
      end={{x: 0, y: 1.5}}
      // colors={['#0176C7', Color.mainColor, Color.mainColor]}
      colors={['#498DE3', '#25399F']}
      style={{
        flexDirection: 'row',
        flex: 0,
        paddingTop: 40,
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContentL: 'center',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            flex: 0,
          }}
          onPress={async () => await goBack()}>
          <Icon_back color={Color.white} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              flex: 1,
              fontSize: 20,
              color: 'white',
              textAlign: 'center',
            }}>
            {children}
          </Text>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flex: 0,
            }}>
            {/* <Icon_back color={null} /> */}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default TVSHeader;
