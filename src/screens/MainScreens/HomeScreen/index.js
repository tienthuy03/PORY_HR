import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
  FlatList,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../../hooks/useAuth';
import { APP_VERSION } from '../../../config/clientConfig';
import { sysFetch } from '../../../services/apiService';
import { STORAGE_KEYS } from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
      backgroundColor: colors.card,
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dateText: {
      fontSize: 16,
      fontFamily: 'Roboto-Bold',
      marginBottom: 4,
    },
    weatherContainer: {
      // flexDirection: 'row',
      // alignItems: 'center',
    },
    weatherText: {
      fontSize: 18,
      fontFamily: 'Roboto-Medium',
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
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
    generalInfoSection: {
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Roboto-Medium',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    infoItem: {
      alignItems: 'center',
      flex: 1,
    },
    tempText: {
      fontSize: 14,
      fontFamily: 'Roboto-Medium',
      marginTop: 4,
    },
    tempLabel: {
      fontSize: 12,
      fontFamily: 'Roboto-Regular',
      marginTop: 2,
    },
    roomTabsContainer: {
      marginBottom: 25,
    },
    roomTabsContent: {
      paddingHorizontal: 20,
    },
    roomTab: {
      marginRight: 25,
      alignItems: 'center',
    },
    roomTabText: {
      fontSize: 14,
      fontFamily: 'Roboto-Regular',
      marginBottom: 8,
    },
    roomTabIndicator: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    deviceGrid: {
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      gap: 8,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
    deviceCard: {
      width: '31%',
      aspectRatio: 1,
      borderRadius: 12,
      padding: 12,
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
    menuItemContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 122, 255, 0.1)', // Light blue background
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    menuItemText: {
      fontSize: 12,
      fontFamily: 'Roboto-Medium',
      textAlign: 'center',
      lineHeight: 16,
    },
    deviceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 15,
    },
    deviceInfo: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    deviceName: {
      fontSize: 14,
      fontFamily: 'Roboto-Medium',
      marginBottom: 4,
    },
    deviceSubtitle: {
      fontSize: 12,
      fontFamily: 'Roboto-Regular',
    },
    imgAvatar: {
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: colors.mainColor,
    },
    headerContainer: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    txtMenu: {
      paddingLeft: 20,
      paddingVertical: 12,
      fontSize: 18,
      fontFamily: 'Roboto-Medium',
      color: colors.textPrimary,
    },
    menuSection: {
      backgroundColor: colors.background,
      flex: 1,
    },
  });
  const { getUserInfo, hasPermission } = useAuth();
  const userInfo = getUserInfo();
  const [loadMenu, setLoadMenu] = useState(true);
  const [dataMenuMBHR, setDataMenuMBHR] = useState([]);
  const [API_URL, setAPI_URL] = useState('');
  const [tokenLogin, setTokenLogin] = useState('');
  const [menuFetched, setMenuFetched] = useState(false);

  // Lấy API_URL và token từ AsyncStorage
  useEffect(() => {
    const getAPIConfig = async () => {
      try {
        const apiUrl = await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
        const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        console.log('AsyncStorage - API_URL:', apiUrl);
        console.log('AsyncStorage - token:', token);

        setAPI_URL(apiUrl);
        setTokenLogin(token);
      } catch (error) {
        console.log('Error getting API config:', error);
      }
    };

    getAPIConfig();
  }, []); // Chỉ chạy một lần khi component mount

  // Gọi getMenu khi có đủ data
  useEffect(() => {
    if (API_URL && tokenLogin && userInfo && loadMenu && !menuFetched) {
      console.log('All data ready, calling getMenu...');
      setMenuFetched(true); // Đánh dấu đã gọi API
      getMenu();
    }
  }, [API_URL, tokenLogin, userInfo]); // Chỉ chạy khi các dependencies thay đổi

  const refreshNewToken = (callback) => {
    // Implement token refresh logic here
    console.log('Token expired, need to refresh');
    // You can call login again or implement refresh token logic
  };

  // Debug logs
  console.log('=== Debug Info ===');
  console.log('dataMenuMBHR length:', dataMenuMBHR.length);
  console.log('loadMenu:', loadMenu);
  console.log('menuFetched:', menuFetched);
  console.log('API_URL exists:', !!API_URL);
  console.log('tokenLogin exists:', !!tokenLogin);
  console.log('userInfo exists:', !!userInfo);

  let dataMenuMBHRs;
  const getMenu = () => {
    if (!API_URL || !tokenLogin || !userInfo) {
      console.log('Missing required parameters for getMenu');
      return;
    }

    console.log({
      p1_varchar2: userInfo.userPk,
      p2_varchar2: userInfo.empPk,
      p3_varchar2: APP_VERSION,
      p4_varchar2: userInfo.crt_by,
    });

    sysFetch(
      API_URL,
      {
        pro: "STV_HR_SEL_MBI_HRMENU_0",
        in_par: {
          p1_varchar2: userInfo.userPk,
          p2_varchar2: userInfo.empPk,
          p3_varchar2: APP_VERSION,
          p4_varchar2: userInfo.crt_by,
        },
        out_par: {
          p1_sys: "menu",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        console.log('API Response:', rs);

        if (rs == "Token Expired") {
          console.log('Token expired, refreshing...');
          refreshNewToken("getMenu");
        }
        if (rs != "Token Expired") {
          console.log('Processing menu data...');
          setLoadMenu(false);
          dataMenuMBHRs = rs.data?.menu || [];
          console.log('Raw menu data:', dataMenuMBHRs);

          let dataMenuMBHRc = [];
          try {
            dataMenuMBHRs.map((item) => {
              if (item.menu_cd && item.menu_cd.length === 6) {
                dataMenuMBHRc.push(item);
              }
            });
            // Chia cột cho menu home
            if (userInfo.menuType == 2) {
              console.log("userInfo.menuType ", 0 % 3);
              if (
                dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length > 3
              ) {
                if (
                  (dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length -
                    1) %
                  3 ===
                  1
                ) {
                  dataMenuMBHRc.push({ pk: "pk", parent: true });
                }
                if (
                  (dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length -
                    1) %
                  3 ===
                  2
                ) {
                  dataMenuMBHRc.push(
                    { pk: "pk", parent: true },
                    { pk: "pk", parent: true }
                  );
                }
              } else {
                if (
                  dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length ==
                  1
                ) {
                  dataMenuMBHRc.push(
                    { pk: "pk", parent: true },
                    { pk: "pk", parent: true }
                  );
                }

                if (
                  dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length ==
                  2
                ) {
                  dataMenuMBHRc.push({ pk: "pk", parent: true });
                }
              }
            } else {
              if (
                dataMenuMBHRc.filter((x) => x.menu_cd !== "MBHRAN").length %
                2 ===
                1
              ) {
                dataMenuMBHRc.push({ pk: "pk", parent: true });
              }
            }

            const finalMenuData = dataMenuMBHRc.filter(
              (x) => x.menu_cd !== "MBHRAN" && x.menu_cd !== "MBSYSY"
            );
            console.log('Final menu data:', finalMenuData);
            setDataMenuMBHR(finalMenuData);
          } catch (error) {
            setLoadMenu(false);
            console.log(error);
          }
        }
      })
      .catch((error) => {
        setLoadMenu(false);
        console.log(error);
      });
  };

  // Handle menu item press
  const handleMenuItemPress = (item) => {
    console.log('Navigate to:', item.menu_cd);
    // Add your navigation logic here
  };
  // Icon mapping function
  const getMenuIcon = (menuCode) => {
    const iconMap = {
      'MBHRAN': 'account-group', // HR Management
      'MBHRAT': 'clock-check', // Attendance
      'MBHRPA': 'account-cash', // Payroll
      'MBHRLE': 'calendar-clock', // Leave
      'MBHRTR': 'school', // Training
      'MBHRPE': 'account-multiple', // Performance
      'MBHRRE': 'file-chart', // Reports
      'MBHRSY': 'cog', // Settings
      'MBHRCL': 'clipboard-check', // Claims
      'MBHRAS': 'desktop-classic', // Assets
      'MBHRDI': 'folder-multiple', // Directory
      'MBHRBR': 'coffee', // Break Time
      'MBHRCI': 'login-variant', // Check In/Out
      'MBHRTA': 'clipboard-text', // Tasks
      // Thêm các icon mới cho menu items trong ảnh
      'MBHRQU': 'help-circle', // Truy vấn thông tin
      'MBHRRG': 'file-document-edit', // Đăng ký - Xác nhận
      'MBHRAP': 'calendar-check', // Quản lý phê duyệt
      'MBHRFC': 'face-recognition', // Chấm công khuôn mặt
      'MBHRCH': 'chart-bar', // Biểu đồ - Thống kê
      'MBHRAM': 'file-document-multiple', // Quản lý đơn từ
      'MBHRDM': 'database', // Quản lý dữ liệu
      'MBHRPM': 'factory', // Quản lý sản lượng
      'MBHRWH': 'warehouse', // Vựa
    };
    return iconMap[menuCode] || 'help-circle';
  };

  // MenuItem Component
  const MenuItem = ({ item, colors, onPress }) => {
    return (
      <TouchableOpacity
        style={[
          styles.deviceCard,
          {
            backgroundColor: colors.card,
          },
        ]}
        onPress={() => onPress(item)}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.iconContainer}>
            <Icon
              name={item.icon}
              size={24}
              color={colors.mainColor}
            />
          </View>
          <Text
            style={[
              styles.menuItemText,
              { color: colors.textPrimary },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  // Render item for FlatList
  const renderMenuItem = ({ item, index }) => (
    <MenuItem
      item={item}
      colors={colors}
      onPress={handleMenuItemPress}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image style={styles.imgAvatar} />
              <View style={styles.weatherContainer}>
                <Text style={[styles.dateText, { color: colors.mainColor }]}>{t('hello')}</Text>
                <Text style={[styles.weatherText, { color: colors.textPrimary }]}>{userInfo.fullName}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.mainColor }]}>
              <Icon name="bell" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* General Information Section */}
          <View style={styles.generalInfoSection}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t('generalInfo')}
            </Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Icon name="card-account-details" size={20} color={colors.textSecondary} />
                <Text style={[styles.tempText, { color: colors.textPrimary }]}>{userInfo.clientNm}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="card-account-details" size={20} color={colors.textSecondary} />
                <Text style={[styles.tempText, { color: colors.textPrimary }]}>{userInfo.empId}</Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="home" size={20} color={colors.textSecondary} />
                <Text style={[styles.tempText, { color: colors.textPrimary }]}>{userInfo.orgNm}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items Grid */}
        <View style={styles.menuSection}>
          <Text style={[styles.txtMenu, { color: colors.textPrimary }]}>{t('menu')}</Text>
          {loadMenu ? (
            <Text style={{ textAlign: 'center', padding: 20, color: colors.textSecondary }}>
              {t('loading')}...
            </Text>
          ) : dataMenuMBHR.length > 0 ? (
            <FlatList
              data={dataMenuMBHR}
              keyExtractor={(item, index) => item.pk || index.toString()}
              numColumns={3}
              columnWrapperStyle={styles.deviceGrid}
              renderItem={renderMenuItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, marginBottom: 10 }}>
                Không có dữ liệu menu
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                dataMenuMBHR length: {dataMenuMBHR.length}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
