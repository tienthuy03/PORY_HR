import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {useTheme} from '@react-navigation/native';
import ReAnimated from 'react-native-reanimated';
import {useSafeArea} from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';

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
const handleSquare = (number) => {
  return {
    width: number,
    height: number,
  };
};
const handleRound = (number) => {
  return {
    width: number,
    height: number,
    borderRadius: number / 2,
  };
};

const Block = ({
  flex,
  flexDirection,
  row,
  column,
  shadow,
  backgroundColor,
  space,
  padding,
  margin,
  alignStart,
  alignCenter,
  alignEnd,
  wrap,
  justifyCenter,
  justifyEnd,
  justifyStart,
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
  radius,
  height,
  width,
  style,
  children,
  square,
  round,
  safe,
  border,
  relative,
  absolute,
  top,
  left,
  right,
  bottom,
  borderColor,
  animated,
  reAnimated,
  flowhidden,
  safeBackground,
  insetTop,
  insetBottom,
  insetLeft,
  insetRight,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  justifyContent,
  alignSelf,
  borderBottomWidth,
  borderBottomColor,
  borderTopWidth,
  borderTopColor,
  overlay,
  transition,
  auto,
  ...props
}) => {
  const {colors} = useTheme();
  const insets = useSafeArea();
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
  const blockStyles = [
    flex && {flex: 1},
    flex === false && {flex: 0},
    width && {width: width},
    height && {height: height},
    row && styles.row,
    column && styles.column,
    flowhidden && styles.flowhidden,
    shadow && {...styles.shadow, shadowColor: colors.shadow},
    wrap && {flexWrap: 'wrap'},
    backgroundColor && defaultColor[backgroundColor],
    backgroundColor &&
      !defaultColor[backgroundColor] && {backgroundColor: backgroundColor},
    padding && {...handlePadding(padding)},
    margin && {...handleMargin(margin)},
    alignStart && styles.alignStart,
    alignCenter && styles.alignCenter,
    alignEnd && styles.alignEnd,
    justifyCenter && styles.justifyCenter,
    justifyStart && styles.justifyStart,
    justifyEnd && styles.justifyEnd,
    justifyContent && {justifyContent: justifyContent},
    space && {justifyContent: `space-${space}`},
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
    radius && {
      borderRadius: radius,
    },
    border && {borderWidth: 1},
    borderTopLeftRadius && {borderTopLeftRadius: borderTopLeftRadius},
    borderTopRightRadius && {borderTopRightRadius: borderTopRightRadius},
    borderBottomLeftRadius && {borderBottomLeftRadius: borderBottomLeftRadius},
    borderBottomRightRadius && {
      borderBottomRightRadius: borderBottomRightRadius,
    },
    square && {...handleSquare(square)},
    round && {...handleRound(round)},
    borderColor && {borderColor: borderColor},
    relative && {position: 'relative'},
    absolute && {position: 'absolute'},
    top !== -1 && {top: top},
    left !== -1 && {left: left},
    right !== -1 && {right: right},
    bottom !== -1 && {bottom: bottom},
    flexDirection && {flexDirection: flexDirection},
    style,
    borderBottomWidth && {borderBottomWidth: borderBottomWidth},
    borderBottomColor && {borderBottomColor: borderBottomColor},
    borderTopWidth && {borderTopWidth: borderTopWidth},
    borderTopColor && {borderTopColor: borderTopColor},
  ];
  const insetStyle = [
    styles.block,
    safeBackground && {backgroundColor: safeBackground},
    insetTop && {paddingTop: insets.top},
    insetBottom && {paddingBottom: insets.bottom},
    insetLeft && {paddingLeft: insets.left},
    insetRight && {paddingRight: insets.right},
  ];
  if (animated) {
    return (
      <Animatable.View
        animation="slideInLeft"
        duration={500}
        delay={1 ? (2 * 500) / 10 : 0}
        useNativeDriver={true}
        style={blockStyles}
        {...props}>
        {children}
      </Animatable.View>
    );
  }
  if (transition) {
    return (
      <Animatable.View
        animation="fadeInUp"
        duration={500}
        delay={2 ? (2 * 500) / 5 : 0}
        useNativeDriver
        style={blockStyles}
        {...props}>
        {children}
      </Animatable.View>
    );
  }
  if (reAnimated) {
    return (
      <ReAnimated.View style={blockStyles} {...props}>
        {children}
      </ReAnimated.View>
    );
  }
  if (safe) {
    return (
      <View style={insetStyle}>
        <View style={blockStyles} {...props}>
          {children}
        </View>
      </View>
    );
  }
  return (
    <View style={blockStyles} {...props}>
      {children}
    </View>
  );
};

export default Block;
const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignSelf: {
    alignSelf: 'flex-end',
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
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 3,
  },
  flowhidden: {
    overflow: 'hidden',
  },
});
