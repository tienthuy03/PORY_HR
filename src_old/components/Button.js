import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
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
const Button = ({
  flex,
  alignSelf,
  title,
  color,
  size,
  medium,
  light,
  backgroundColor,
  width,
  height,
  children,
  center,
  shadow,
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
  justifyCenter,
  justifyEnd,
  justifyStart,
  alignStart,
  alignCenter,
  alignEnd,
  padding,
  margin,
  space,
  radius,
  row,
  column,
  style,
  thl,
  underlayColor,
  twfb,
  nextScreen,
  onLongPress,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  activeOpacity = 0.7,
  borderBottomWidth,
  ...props
}) => {
  const {colors} = useTheme();
  const defaultColor = {
    background: {backgroundColor: colors.background},
    blue: {backgroundColor: colors.blue},
    primary: {backgroundColor: colors.primary},
    text: {backgroundColor: colors.text},
    secondary: {backgroundColor: colors.secondary},
    secondaryText: {backgroundColor: colors.secondaryText},
    red: {backgroundColor: colors.red},
    white: {backgroundColor: colors.white},
  };
  const buttonStyles = [
    flex && {flex: 1},
    row && styles.row,
    column && styles.column,
    alignSelf && {alignSelf: alignSelf},
    backgroundColor && defaultColor[backgroundColor],
    backgroundColor &&
      !defaultColor[backgroundColor] && {backgroundColor: backgroundColor},
    width && {width: width},
    height && {height: height},
    center && styles.center,
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
    alignStart && styles.alignStart,
    alignCenter && styles.alignCenter,
    alignEnd && styles.alignEnd,
    justifyCenter && styles.justifyCenter,
    justifyStart && styles.justifyStart,
    justifyEnd && styles.justifyEnd,
    padding && {...handlePadding(padding)},
    margin && {...handleMargin(margin)},
    space && {justifyContent: `space-${space}`},
    shadow && {...styles.shadow, shadowColor: colors.shadow},
    radius && {borderRadius: radius},
    borderTopLeftRadius && {borderTopLeftRadius: borderTopLeftRadius},
    borderTopRightRadius && {borderTopRightRadius: borderTopRightRadius},
    borderBottomLeftRadius && {borderBottomLeftRadius: borderBottomLeftRadius},
    borderBottomRightRadius && {
      borderBottomRightRadius: borderBottomRightRadius,
    },
    borderBottomWidth && {borderBottomWidth: borderBottomWidth},
    activeOpacity && {activeOpacity: activeOpacity},
    style,
  ];
  if (thl) {
    return (
      <TouchableHighlight
        style={buttonStyles}
        underlayColor={underlayColor}
        {...props}>
        {children}
      </TouchableHighlight>
    );
  }
  if (twfb) {
    return (
      <TouchableWithoutFeedback style={buttonStyles} {...props}>
        {children}
      </TouchableWithoutFeedback>
    );
  }
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={buttonStyles}
      {...props}
      onPress={nextScreen}
      onLongPress={onLongPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  alignCenter: {
    alignItems: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 13,
    elevation: 2,
  },
});
