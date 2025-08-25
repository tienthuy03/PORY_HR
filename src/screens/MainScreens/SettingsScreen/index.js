import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { saveTheme, saveLanguage } from '../../../redux/slices/settingsSlice';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { theme, language, loading } = useSelector((state) => state.settings);
  const { colors } = useTheme();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundNotifications, setSoundNotifications] = useState(true);

  const themeOptions = [
    { key: 'light', label: t('settings.lightMode'), icon: 'white-balance-sunny' },
    { key: 'dark', label: t('settings.darkMode'), icon: 'moon-waning-crescent' },
    { key: 'system', label: t('settings.systemMode'), icon: 'theme-light-dark' },
  ];

  const languageOptions = [
    { key: 'vi', label: t('settings.vietnamese'), flag: '🇻🇳' },
    { key: 'en', label: t('settings.english'), flag: '🇺🇸' },
  ];

  const handleThemeChange = async (selectedTheme) => {
    try {
      await dispatch(saveTheme(selectedTheme)).unwrap();
      Alert.alert(t('common.success'), 'Theme updated successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update theme');
    }
  };

  const handleLanguageChange = async (selectedLanguage) => {
    try {
      await dispatch(saveLanguage(selectedLanguage)).unwrap();
      Alert.alert(t('common.success'), 'Language updated successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to update language');
    }
  };

  const renderThemeSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>
        {t('settings.appearance')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary2 }]}>
          {t('settings.theme')}
        </Text>
        <View style={styles.optionsContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                theme === option.key && {
                  backgroundColor: colors.mainColor,
                  borderColor: colors.mainColor,
                },
              ]}
              onPress={() => handleThemeChange(option.key)}
              disabled={loading}
            >
              <Icon
                name={option.icon}
                size={20}
                color={theme === option.key ? 'white' : colors.mainColor}
              />
              <Text style={[
                styles.optionText,
                { color: colors.textPrimary2 },
                theme === option.key && styles.selectedOptionText,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderLanguageSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>
        {t('settings.language')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingLabel, { color: colors.textPrimary2 }]}>
          {t('settings.selectLanguage')}
        </Text>
        <View style={styles.optionsContainer}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
                language === option.key && {
                  backgroundColor: colors.mainColor,
                  borderColor: colors.mainColor,
                },
              ]}
              onPress={() => handleLanguageChange(option.key)}
              disabled={loading}
            >
              <Text style={styles.flagEmoji}>{option.flag}</Text>
              <Text style={[
                styles.optionText,
                { color: colors.textPrimary2 },
                language === option.key && styles.selectedOptionText,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderNotificationSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>
        {t('settings.notifications')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
          <View style={styles.settingInfo}>
            <Icon name="bell" size={20} color={colors.mainColor} />
            <Text style={[styles.settingLabel, { color: colors.textPrimary2 }]}>
              {t('settings.pushNotifications')}
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: colors.switchTrack, true: colors.mainColor }}
            thumbColor={pushNotifications ? colors.switchThumb : colors.switchThumb}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
          <View style={styles.settingInfo}>
            <Icon name="email" size={20} color={colors.mainColor} />
            <Text style={[styles.settingLabel, { color: colors.textPrimary2 }]}>
              {t('settings.emailNotifications')}
            </Text>
          </View>
          <Switch
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            trackColor={{ false: colors.switchTrack, true: colors.mainColor }}
            thumbColor={emailNotifications ? colors.switchThumb : colors.switchThumb}
          />
        </View>

        <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
          <View style={styles.settingInfo}>
            <Icon name="volume-high" size={20} color={colors.mainColor} />
            <Text style={[styles.settingLabel, { color: colors.textPrimary2 }]}>
              {t('settings.soundNotifications')}
            </Text>
          </View>
          <Switch
            value={soundNotifications}
            onValueChange={setSoundNotifications}
            trackColor={{ false: colors.switchTrack, true: colors.mainColor }}
            thumbColor={soundNotifications ? colors.switchThumb : colors.switchThumb}
          />
        </View>
      </View>
    </View>
  );

  const renderAboutSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>
        {t('settings.about')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.aboutRow, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.aboutLabel, { color: colors.textPrimary3 }]}>
            {t('settings.appVersion')}
          </Text>
          <Text style={[styles.aboutValue, { color: colors.textPrimary2 }]}>
            {t('settings.version')}
          </Text>
        </View>
        <View style={[styles.aboutRow, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.aboutLabel, { color: colors.textPrimary3 }]}>
            {t('settings.buildNumber')}
          </Text>
          <Text style={[styles.aboutValue, { color: colors.textPrimary2 }]}>
            Build 1
          </Text>
        </View>
        <View style={[styles.aboutRow, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.aboutLabel, { color: colors.textPrimary3 }]}>
            {t('settings.developer')}
          </Text>
          <Text style={[styles.aboutValue, { color: colors.textPrimary2 }]}>
            PORYHR Team
          </Text>
        </View>
        <View style={[styles.aboutRow, { borderBottomColor: colors.borderLight }]}>
          <Text style={[styles.aboutLabel, { color: colors.textPrimary3 }]}>
            {t('settings.company')}
          </Text>
          <Text style={[styles.aboutValue, { color: colors.textPrimary2 }]}>
            PORYHR Company
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* <View style={[styles.header, { backgroundColor: colors.mainColor }]}>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderThemeSection()}
        {renderLanguageSection()}
        {renderNotificationSection()}
        {renderAboutSection()}
      </ScrollView>
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
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  selectedOptionText: {
    color: 'white',
  },
  flagEmoji: {
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  aboutValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
});

export default SettingsScreen;
