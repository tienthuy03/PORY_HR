// import React, { useState } from 'react';
// import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

// const StatusButtons = ({ buttonStatus }) => {
//   const [selectedStatus, setSelectedStatus] = useState(null);

//   const handlePress = (id) => {
//     setSelectedStatus(id);
//   };

//   // Định nghĩa màu nền và màu chữ dựa trên `status_val`
//   const getButtonStyle = (statusVal, isSelected) => {
//     switch (statusVal) {
//       case "0":
//         return isSelected
//           ? { backgroundColor: "#A8E6CF", color: "#006400" } // Tất cả
//           : { backgroundColor: "#FFFFFF", color: "#000000" };
//       case "1":
//         return isSelected
//           ? { backgroundColor: "#FFABAB", color: "#B22222" } // Chưa ký
//           : { backgroundColor: "#FFFFFF", color: "#000000" };
//       case "2":
//         return isSelected
//           ? { backgroundColor: "#80D8FF", color: "#007FFF" } // Đã ký
//           : { backgroundColor: "#FFFFFF", color: "#000000" };
//       case "3":
//         return isSelected
//           ? { backgroundColor: "#d9d9d9", color: "#000000" } // Từ chối
//           : { backgroundColor: "#FFFFFF", color: "#000000" };
//       default:
//         return { backgroundColor: "#FFFFFF", color: "#000000" };
//     }
//   };

//   return (
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={styles.scrollContainer}
//     >
//       {buttonStatus?.map((status, index) => {
//         const isSelected = selectedStatus === index;
//         const { backgroundColor, color } = getButtonStyle(status.status_val, isSelected);

//         return (
//           <TouchableOpacity
//             key={index}
//             style={[styles.button, { backgroundColor }]}
//             onPress={() => handlePress(index)}
//           >
//             <Text style={[styles.text, { color }]}>{status.status_nm}</Text>
//           </TouchableOpacity>
//         );
//       })}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexDirection: 'row',
//     paddingVertical: 16,
//     paddingHorizontal: 4,
//   },
//   button: {
//     paddingVertical: 8,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     borderColor: "#D3D3D3",
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//     marginRight: 12,
//   },
//   text: {
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default StatusButtons;

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const StatusButtons = ({ buttonStatus, onPress }) => {
  const [selectedStatus, setSelectedStatus] = useState(0);

  const handlePress = (id) => {
    setSelectedStatus(id);
    if (onPress) {
      onPress(buttonStatus[id].status_val);
    }
  };

  const getButtonStyle = (statusVal, isSelected) => {
    switch (statusVal) {
      case "0":
        return isSelected
          ? { backgroundColor: "#A8E6CF", color: "#006400" } // Tất cả
          : { backgroundColor: "#FFFFFF", color: "#000000" };
      case "1":
        return isSelected
          ? { backgroundColor: "#FFABAB", color: "#B22222" } // Chưa ký
          : { backgroundColor: "#FFFFFF", color: "#000000" };
      case "2":
        return isSelected
          ? { backgroundColor: "#80D8FF", color: "#007FFF" } // Đã ký
          : { backgroundColor: "#FFFFFF", color: "#000000" };
      case "3":
        return isSelected
          ? { backgroundColor: "#d9d9d9", color: "#000000" } // Từ chối
          : { backgroundColor: "#FFFFFF", color: "#000000" };
      default:
        return { backgroundColor: "#FFFFFF", color: "#000000" };
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {buttonStatus?.map((status, index) => {
        const isSelected = selectedStatus === index;
        const { backgroundColor, color } = getButtonStyle(status.status_val, isSelected);

        return (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor }]}
            onPress={() => handlePress(index)}
          >
            <Text style={[styles.text, { color }]}>{status.status_nm}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderColor: "#D3D3D3",
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginRight: 12,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default StatusButtons;
