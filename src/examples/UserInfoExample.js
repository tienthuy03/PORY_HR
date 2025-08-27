import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const UserInfoExample = () => {
  const { user, getUserInfo, hasPermission, logout } = useAuth();

  const handleShowUserInfo = () => {
    if (!user) {
      Alert.alert('Thông báo', 'Chưa có thông tin user');
      return;
    }

    const userInfo = getUserInfo();
    Alert.alert(
      'Thông tin User',
      `Họ tên: ${userInfo.fullName}\nUsername: ${userInfo.username}\nPhòng ban: ${userInfo.orgNm}\nAdmin: ${userInfo.sysadminYn ? 'Có' : 'Không'}`
    );
  };

  const handleCheckPermission = () => {
    const permissions = ['hr', 'pr', 'ac', 'sa'];
    let message = 'Kiểm tra quyền:\n';

    permissions.forEach(permission => {
      message += `${permission.toUpperCase()}: ${hasPermission(permission) ? 'Có' : 'Không'}\n`;
    });

    Alert.alert('Quyền hạn', message);
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', onPress: logout, style: 'destructive' }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chưa đăng nhập</Text>
        <Text style={styles.subtitle}>Vui lòng đăng nhập để xem thông tin</Text>
      </View>
    );
  }

  const userInfo = getUserInfo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demo User Info</Text>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
        <Text style={styles.infoText}>Họ tên: {userInfo.fullName}</Text>
        <Text style={styles.infoText}>Username: {userInfo.username}</Text>
        <Text style={styles.infoText}>Phòng ban: {userInfo.orgNm}</Text>
        <Text style={styles.infoText}>Admin: {userInfo.sysadminYn ? 'Có' : 'Không'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleShowUserInfo}>
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCheckPermission}>
          <Text style={styles.buttonText}>Kiểm tra quyền</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rawDataCard}>
        <Text style={styles.cardTitle}>Raw Data (một phần)</Text>
        <Text style={styles.rawText}>
          {JSON.stringify({
            full_name: user.full_name,
            crt_by: user.crt_by,
            org_nm: user.org_nm,
            sysadmin_yn: user.sysadmin_yn,
            tes_user_pk: user.tes_user_pk,
            thr_emp_pk: user.thr_emp_pk,
          }, null, 2)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  rawDataCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rawText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#999',
  },
});

export default UserInfoExample;
