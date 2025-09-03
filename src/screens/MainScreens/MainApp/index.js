import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import HomeScreen from '../HomeScreen';
import EmployeeScreen from '../EmployeeScreen';
import AttendanceScreen from '../AttendanceScreen';
import SettingsScreen from '../SettingsScreen';
import ProfileScreen from '../ProfileScreen';
import MBHRIN_TruyVanThongTin from '../MBHRIN_TruyVanThongTin';
import BottomNavigation from '../../../components/BottomNavigation';

const MainApp = ({ onLogout }) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [menuData, setMenuData] = useState(null);

  // Navigate to different screens
  const navigateToScreen = (screenName, data = null) => {
    setCurrentScreen(screenName);
    if (data) {
      setMenuData(data);
    }
  };

  // Handle back navigation
  const handleGoBack = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    setMenuData(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateToScreen} />;
      case 'employee':
        return <EmployeeScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={onLogout} />;
      case 'MBHRIN':
        return <MBHRIN_TruyVanThongTin navigation={{ goBack: handleGoBack }} menuData={menuData} />;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    setCurrentScreen(tabName);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      {currentScreen !== 'MBHRIN' && (
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      )}
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
