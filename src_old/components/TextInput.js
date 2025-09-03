import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {useTheme} from '@react-navigation/native';
const handlePadding = number => {
  return {
    paddingLeft: number,
    paddingRight: number,
    paddingBottom: number,
    paddingTop: number,
  };
};
const handleMargin = number => {
  return {
    marginLeft: number,
    marginRight: number,
    marginBottom: number,
    marginTop: number,
  };
};
const InputText = ({
  flex,
  onFocus,
  ref,
  value,
  onChangeText,
  color,
  medium,
  light,
  size,
  placeholder,
  placeholderTextColor,
  center,
  right,
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
  secureTextEntry,
  email,
  number,
  phone,
  autoFocus,
  height,
  width,
  style,
  autoCompleteType,
  left,
  editable,
  numberOfLines,
  multiline = false,
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
  const inputStyle = [
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
    left && styles.left,
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
    height && {height: height},
    width && {width: width},
    numberOfLines && {numberOfLines: numberOfLines},
    multiline && {multiline: multiline},
    style,
  ];
  const keyboardType = email
    ? 'email-address'
    : number
    ? 'numeric'
    : phone
    ? 'phone-pad'
    : 'default';
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor || colors.secondaryText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoFocus={autoFocus}
      autoComplete="off"
      autoCapitalize="none"
      autoCorrect={false}
      value={value}
      style={inputStyle}
      onFocus={onFocus}
      autoCompleteType={autoCompleteType}
      onChangeText={onChangeText}
      ref={ref}
      editable={editable}
      numberOfLines={numberOfLines}
      multiline={multiline}
      {...props}
    />
  );
};

export default InputText;

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
  left: {
    textAlign: 'left',
  },
});
