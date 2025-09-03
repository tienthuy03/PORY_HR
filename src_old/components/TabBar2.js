/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {Badge} from 'react-native-elements';
import {Color} from '../colors/color';

const TabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const lens =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.tabBarLabel !== undefined;

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Thay thế Animated bằng cách dùng điều kiện thông thường
        const borderBottomColor = isFocused ? '#FFA500' : '#FFFFFF';

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              flexDirection: 'column',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: borderBottomColor,
                borderBottomWidth: 3,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                position: 'relative',
              }}>
              <View style={{alignItems: 'center'}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: 'bold',
                    color: Color.mainColor,
                  }}>
                  {label}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                }}>
                {lens.length > 0 ? (
                  <Badge
                    value={lens}
                    status="error"
                    textStyle={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: 'white',
                    }}
                    containerStyle={{
                      alignSelf: 'flex-end',
                      marginRight: 0,
                      marginTop: 2,
                    }}
                  />
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});

export default TabBar;
