import React from 'react';
import {Text, StyleSheet, Animated, Platform} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Hyperlink from 'react-native-hyperlink';
const handlePadding = (number) => {
  return {
    paddingLeft: number,
    paddingRight: number,
    paddingBottom: number,
    paddingTop: number,
  };
};
const handleMargin = (number) => {
  return {
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
    marginTop: number,
  };
};
const Typography = ({
  flex,
  flexWrap,
  children,
  animated,
  medium,
  light,
  size,
  color,
  center,
  right,
  justify,
  padding,
  margin,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  paddingVertical,
  paddingHorizontal,
  marginVertical,
  marginHorizontal,
  numberOfLines,
  fontWeight,
  link,
  linkColor,
  style,
  fontFamily,
  fontStyle,
  position,
  borderBottomWidth,
  borderWidth,
  borderColor,
  borderRadius,
  opacity,
  backgroundColor,
  textDecorationLine,
  ...props
}) => {
  const {colors} = useTheme();
  const defaultColor = {
    background: {color: colors.background},
    blue: {color: colors.blue},
    primary: {color: colors.primary},
    text: {color: colors.text},
    secondary: {color: colors.secondary},
    secondaryText: {color: colors.secondaryText},
    red: {color: colors.red},
    white: {color: colors.white},
  };

  const textStyle = [
    flex && {flex: 1},
    medium && styles.medium,
    light && styles.regular,
    !medium && !light && styles.regular,
    size && {fontSize: size},
    color && defaultColor[color],
    color && !defaultColor[color] && {color: color},
    !color && {color: colors.text},
    center && styles.center,
    right && styles.right,
    justify && styles.justify,
    fontWeight && {fontWeight: fontWeight},
    padding && {...handlePadding(padding)},
    margin && {...handleMargin(margin)},
    paddingTop && {paddingTop: paddingTop},
    paddingRight && {paddingRight: paddingRight},
    paddingBottom && {paddingBottom: paddingBottom},
    paddingLeft && {paddingLeft: paddingLeft},
    marginBottom && {marginBottom: marginBottom},
    marginTop && {marginTop: marginTop},
    marginRight && {marginRight: marginRight},
    marginLeft && {marginLeft: marginLeft},
    paddingHorizontal && {paddingHorizontal: paddingHorizontal},
    paddingVertical && {paddingVertical: paddingVertical},
    marginHorizontal && {marginHorizontal: marginHorizontal},
    marginVertical && {marginVertical: marginVertical},
    style,
    fontFamily && {fontFamily: fontFamily},
    fontStyle && {fontStyle: fontStyle},
    position && {position: position},
    borderColor && {borderColor: borderColor},
    borderWidth && {borderWidth: borderWidth},
    borderRadius && {borderRadius: borderRadius},
    flexWrap && {flexWrap: flexWrap},
    opacity && {opacity: opacity},
    backgroundColor && {backgroundColor: backgroundColor},
    textDecorationLine && {textDecorationLine: textDecorationLine},
    Platform.OS === "android" && { textAlignVertical: 'center' },
  ];
  const linkStyle = [
    linkColor && defaultColor[linkColor],
    linkColor && !defaultColor[linkColor] && {color: linkColor},
  ];
  if (link) {
    return (
      <Hyperlink linkDefault={true} linkStyle={linkStyle}>
        <Text style={textStyle} {...props}>
          {children}
        </Text>
      </Hyperlink>
    );
  }
  if (animated) {
    return (
      <Animated.Text numberOfLines={numberOfLines} style={textStyle} {...props}>
        {children}
      </Animated.Text>
    );
  }
  return (
    <Text numberOfLines={numberOfLines} style={textStyle} {...props}>
      {children}
    </Text>
  );
};

export default Typography;
const styles = StyleSheet.create({
  regular: {
    fontFamily: 'Roboto-Regular',
  },
  medium: {
    fontFamily: 'Roboto-Medium',
  
  },
  light: {
    fontFamily: 'Roboto-Light',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  justify: {
    textAlign: 'justify',
  },
});
