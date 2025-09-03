/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationAlert = ({visible, content}) => {
  return (
    <>
      {true ? (
        <Animatable.View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            margin: 5,
            flex: 1,
            left: 0,
            right: 0,
            borderRadius: 15,
            padding: 10,
            top: 50,
            zIndex: 99999,
          }}
          animation="fadeInDown">
          <Text>
            <MaterialCommunityIcons name="email" /> {content}
          </Text>
        </Animatable.View>
      ) : null}
    </>
  );
};

export default NotificationAlert;
