import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ onLogout }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: 'account-edit', title: 'Chỉnh sửa thông tin', subtitle: 'Cập nhật thông tin cá nhân' },
    { icon: 'bell', title: 'Thông báo', subtitle: 'Cài đặt thông báo' },
    { icon: 'shield-check', title: 'Bảo mật', subtitle: 'Đổi mật khẩu, bảo mật tài khoản' },
    { icon: 'help-circle', title: 'Trợ giúp', subtitle: 'Hướng dẫn sử dụng' },
    { icon: 'information', title: 'Về ứng dụng', subtitle: 'Phiên bản 1.0.0' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.borderLight }]}>
            <Icon name="account" size={60} color={colors.mainColor} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.textPrimary2 }]}>{user?.fullName || 'Chưa có tên'}</Text>
            <Text style={[styles.profilePosition, { color: colors.textPrimary3 }]}>{user?.position || 'Chưa có chức vụ'}</Text>
            <Text style={[styles.profileEmail, { color: colors.textPrimary3 }]}>{user?.email || 'Chưa có email'}</Text>
            <Text style={[styles.profileCode, { color: colors.textPrimary3 }]}>Mã NV: {user?.employeeCode || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>22</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>Ngày làm việc</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>176</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>Giờ làm việc</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>Ngày nghỉ</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>Thông tin chi tiết</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={colors.mainColor} />
              <Text style={[styles.infoLabel, { color: colors.textPrimary3 }]}>Số điện thoại:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary2 }]}>{user?.phone || 'Chưa có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="office-building" size={20} color={colors.mainColor} />
              <Text style={[styles.infoLabel, { color: colors.textPrimary3 }]}>Phòng ban:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary2 }]}>{user?.department || 'Chưa có'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color={colors.mainColor} />
              <Text style={[styles.infoLabel, { color: colors.textPrimary3 }]}>Ngày vào làm:</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary2 }]}>{user?.joinDate || 'Chưa có'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>Tùy chọn</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuItem, { backgroundColor: colors.card }]}>
              <Icon name={item.icon} size={24} color={colors.mainColor} />
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, { color: colors.textPrimary2 }]}>{item.title}</Text>
                <Text style={[styles.menuItemSubtitle, { color: colors.textPrimary3 }]}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textPrimary3} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.error }]} onPress={onLogout}>
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  profileCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
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
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  profileCode: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  statsContainer: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 10,
  },
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    flex: 2,
  },
  menuSection: {
    marginBottom: 20,
  },
  menuItem: {
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  logoutButton: {
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;
