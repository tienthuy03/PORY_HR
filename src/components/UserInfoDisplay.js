import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const UserInfoDisplay = () => {
  const { user, getUserInfo, hasPermission } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chưa có thông tin user</Text>
      </View>
    );
  }

  const userInfo = getUserInfo();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông tin User từ Redux</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản:</Text>
        <Text style={styles.info}>Họ tên: {userInfo.fullName}</Text>
        <Text style={styles.info}>Username: {userInfo.username}</Text>
        <Text style={styles.info}>Giới tính: {userInfo.gender}</Text>
        <Text style={styles.info}>Mã nhân viên: {userInfo.empId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin tổ chức:</Text>
        <Text style={styles.info}>Phòng ban: {userInfo.orgNm}</Text>
        <Text style={styles.info}>Mã phòng ban: {userInfo.orgId}</Text>
        <Text style={styles.info}>Công ty: {userInfo.clientNm}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quyền hạn:</Text>
        <Text style={styles.info}>Admin: {userInfo.sysadminYn ? 'Có' : 'Không'}</Text>
        <Text style={styles.info}>AC Level: {userInfo.acLevel}</Text>
        <Text style={styles.info}>HR Level: {userInfo.hrLevel}</Text>
        <Text style={styles.info}>PR Level: {userInfo.prLevel}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt:</Text>
        <Text style={styles.info}>Ngôn ngữ: {userInfo.userLanguage}</Text>
        <Text style={styles.info}>Layout: {userInfo.layoutStyle}</Text>
        <Text style={styles.info}>Thông báo: {userInfo.notiMobileYn ? 'Bật' : 'Tắt'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiểm tra quyền:</Text>
        <Text style={styles.info}>Quyền HR: {hasPermission('hr') ? 'Có' : 'Không'}</Text>
        <Text style={styles.info}>Quyền PR: {hasPermission('pr') ? 'Có' : 'Không'}</Text>
        <Text style={styles.info}>Quyền AC: {hasPermission('ac') ? 'Có' : 'Không'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Data:</Text>
        <Text style={styles.rawData}>{JSON.stringify(user, null, 2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  info: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  rawData: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#999',
  },
});

export default UserInfoDisplay;
