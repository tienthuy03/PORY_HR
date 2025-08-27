import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const tabs = [
    {
      key: 'home',
      title: t('home'),
      icon: 'home',
    },
    {
      key: 'employee',
      title: t('employee'),
      icon: 'account-group',
    },
    {
      key: 'attendance',
      title: t('attendance'),
      icon: 'clock',
    },
    {
      key: 'settings',
      title: t('settings'),
      icon: 'cog',
    },
    {
      key: 'profile',
      title: t('profile'),
      icon: 'account',
    },
  ];

  return (
    <View style={[styles.container, {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tab}
          onPress={() => onTabPress(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? colors.mainColor : colors.textPrimary3}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === tab.key ? colors.mainColor : colors.textPrimary3,
              },
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    marginTop: 4,
  },
});

export default BottomNavigation;
