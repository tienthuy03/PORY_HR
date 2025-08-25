import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import HomeScreen from '../HomeScreen';
import EmployeeScreen from '../EmployeeScreen';
import AttendanceScreen from '../AttendanceScreen';
import SettingsScreen from '../SettingsScreen';
import ProfileScreen from '../ProfileScreen';
import BottomNavigation from '../../../components/BottomNavigation';

const MainApp = ({ onLogout }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'employee':
        return <EmployeeScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={onLogout} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});

export default MainApp;
