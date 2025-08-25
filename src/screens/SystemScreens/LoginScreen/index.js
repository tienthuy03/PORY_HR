import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { loginUser } from '../../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    try {
      await dispatch(loginUser({ username, password })).unwrap();
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        {
          text: 'OK',
          onPress: () => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary2 }]}>{t('auth.login')}</Text>

        <View style={styles.formContainer}>
          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary3 }]}>{t('auth.username')}</Text>
            <View style={[styles.inputContainer, {
              borderColor: colors.border,
              backgroundColor: colors.card
            }]}>
              <Icon name="account" size={20} color={colors.textPrimary3} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary2 }]}
                placeholder={t('auth.enterUsername')}
                placeholderTextColor={colors.textTertiary}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary3 }]}>{t('auth.password')}</Text>
            <View style={[styles.inputContainer, {
              borderColor: colors.border,
              backgroundColor: colors.card
            }]}>
              <Icon name="lock" size={20} color={colors.textPrimary3} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textPrimary2 }]}
                placeholder={t('auth.enterPassword')}
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.mainColor },
              loading && { backgroundColor: colors.textTertiary }
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Đang đăng nhập...' : t('auth.login')}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontFamily: 'Roboto-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputIcon: {
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 42,
    fontFamily: 'Roboto-Regular',
  },
  errorContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default LoginScreen;