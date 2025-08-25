import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AttendanceScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.timeCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.timeText, { color: colors.textPrimary2 }]}>14:30</Text>
          <Text style={[styles.dateText, { color: colors.textPrimary3 }]}>Thứ 2, 25/12/2024</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.checkInButton, { backgroundColor: colors.success }]}>
            <Icon name="login" size={30} color="white" />
            <Text style={styles.actionButtonText}>{t('attendance.checkIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.checkOutButton, { backgroundColor: colors.warning }]}>
            <Icon name="logout" size={30} color="white" />
            <Text style={styles.actionButtonText}>{t('attendance.checkOut')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Icon name="clock-in" size={24} color={colors.mainColor} />
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>08:00</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>{t('attendance.timeIn')}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Icon name="clock-out" size={24} color={colors.mainColor} />
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>--:--</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>{t('attendance.timeOut')}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Icon name="timer" size={24} color={colors.mainColor} />
            <Text style={[styles.statNumber, { color: colors.textPrimary2 }]}>6h 30m</Text>
            <Text style={[styles.statLabel, { color: colors.textPrimary3 }]}>{t('attendance.totalHours')}</Text>
          </View>
        </View>

        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary2 }]}>{t('attendance.history')}</Text>
          <View style={[styles.historyItem, { backgroundColor: colors.card }]}>
            <View style={styles.historyTime}>
              <Text style={[styles.historyDate, { color: colors.textPrimary2 }]}>24/12/2024</Text>
              <Text style={[styles.historyDay, { color: colors.textPrimary3 }]}>Chủ nhật</Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={[styles.historyText, { color: colors.textPrimary3 }]}>Check In: 08:00</Text>
              <Text style={[styles.historyText, { color: colors.textPrimary3 }]}>Check Out: 17:30</Text>
            </View>
            <View style={styles.historyStatus}>
              <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
                <Text style={styles.statusBadgeText}>{t('attendance.completed')}</Text>
              </View>
            </View>
          </View>
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
  timeCard: {
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
  timeText: {
    fontSize: 36,
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkInButton: {
    marginRight: 5,
  },
  checkOutButton: {
    marginLeft: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginTop: 5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
    marginBottom: 15,
  },
  historyItem: {
    borderRadius: 12,
    padding: 15,
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
  historyTime: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    marginBottom: 2,
  },
  historyDay: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  historyDetails: {
    flex: 2,
  },
  historyText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginBottom: 2,
  },
  historyStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Roboto-Bold',
  },
});

export default AttendanceScreen;
