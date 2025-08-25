import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.welcomeCard, { backgroundColor: colors.card }]}>
          <Icon name="home" size={50} color={colors.mainColor} />
          <Text style={[styles.welcomeText, { color: colors.textPrimary2 }]}>
            {t('home.welcome')}, {user?.fullName || t('profile.noName')}!
          </Text>
          <Text style={[styles.subText, { color: colors.textPrimary3 }]}>
            {t('home.subtitle')}
          </Text>
          <View style={styles.userInfo}>
            <Text style={[styles.userPosition, { color: colors.mainColor }]}>
              {user?.position || t('profile.noPosition')}
            </Text>
            <Text style={[styles.userDepartment, { color: colors.textPrimary3 }]}>
              {user?.department || t('profile.noDepartment')}
            </Text>
          </View>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <Icon name="account-group" size={30} color={colors.mainColor} />
            <Text style={[styles.menuText, { color: colors.textPrimary2 }]}>
              {t('home.employees')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <Icon name="calendar-clock" size={30} color={colors.mainColor} />
            <Text style={[styles.menuText, { color: colors.textPrimary2 }]}>
              {t('home.attendance')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <Icon name="file-document" size={30} color={colors.mainColor} />
            <Text style={[styles.menuText, { color: colors.textPrimary2 }]}>
              {t('home.reports')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.card }]}>
            <Icon name="cog" size={30} color={colors.mainColor} />
            <Text style={[styles.menuText, { color: colors.textPrimary2 }]}>
              {t('home.settings')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  welcomeCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginTop: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginTop: 5,
    textAlign: 'center',
  },
  userInfo: {
    marginTop: 15,
    alignItems: 'center',
  },
  userPosition: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginTop: 8,
  },
});

export default HomeScreen;
