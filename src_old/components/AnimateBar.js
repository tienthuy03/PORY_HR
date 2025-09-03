/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Animated, Dimensions, Text, View} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const AnimatedBar = ({delay, value, counts, widths, pbs, colors}) => {
  const [_width, setWidth] = useState(new Animated.Value(0));

  useEffect(() => {
    animateTo(delay, value);
  }, [delay, value]);

  const animateTo = (delay, value) => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(_width, {
        toValue: value,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const barStyles = {
    backgroundColor: colors,
    height: 30,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
    width: _width,
    // margin: 4,
  };
  //   const emptyStyle = {
  //     backgroundColor: 'white',
  //     width: 150,
  //     height: 10,
  //     margin: 4,
  //     position: 'absolute',
  //     //   top: 35,
  //     borderBottomRightRadius: 3,
  //     borderBottomLeftRadius: 3,
  //     borderTopRightRadius: 3,
  //     borderTopLeftRadius: 3,
  //   };

  const textStyle = {
    color: colors,
    fontSize: 11,
    textAlign: 'center',
    paddingLeft: 4,
  };
  const textStyles = {
    color: 'black',
    fontSize: 12,
    paddingLeft: 3,
    fontFamily: 'Roboto-Light',
  };

  return (
    <View
      style={{
        flexDirection: 'column',
        paddingLeft: 5,
        marginBottom: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 5,
      }}>
      <View>
        <Text style={textStyles}>
          {pbs}
          {': '}
          {counts}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Animated.View style={barStyles} />
        <View style={{justifyContent: 'center'}}>
          <Text style={textStyle}>
            {widths}
            {'%'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AnimatedBar;
