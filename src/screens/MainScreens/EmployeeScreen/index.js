import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployeeScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const employees = [
    { id: '1', name: 'Nguyễn Văn A', position: 'Nhân viên', status: 'Đang làm việc' },
    { id: '2', name: 'Trần Thị B', position: 'Trưởng nhóm', status: 'Đang làm việc' },
    { id: '3', name: 'Lê Văn C', position: 'Nhân viên', status: 'Nghỉ phép' },
    { id: '4', name: 'Phạm Thị D', position: 'Quản lý', status: 'Đang làm việc' },
  ];

  const renderEmployee = ({ item }) => (
    <TouchableOpacity style={[styles.employeeCard, { backgroundColor: colors.card }]}>
      <View style={[styles.avatarContainer, { backgroundColor: colors.borderLight }]}>
        <Icon name="account" size={30} color={colors.mainColor} />
      </View>
      <View style={styles.employeeInfo}>
        <Text style={[styles.employeeName, { color: colors.textPrimary2 }]}>{item.name}</Text>
        <Text style={[styles.employeePosition, { color: colors.textPrimary3 }]}>{item.position}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: item.status === 'Đang làm việc' ? colors.success : colors.warning }]} />
          <Text style={[styles.statusText, { color: colors.textPrimary3 }]}>{item.status}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textPrimary3} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  addButton: {
    borderRadius: 20,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  employeeCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
});

export default EmployeeScreen;
