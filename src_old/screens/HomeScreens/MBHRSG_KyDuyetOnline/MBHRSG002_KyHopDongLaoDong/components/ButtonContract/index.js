import React from 'react';
import { TouchableOpacity } from 'react-native';
import { default as Icon } from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from 'react-redux';
import Text from '../../../../../../components/Text';
const CustomButtonContract = ({ title, icon, color, onPress, status_val }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);
  // Conditionally change the title based on status_val
  const buttonText = status_val === '2' ? 'Xem hợp đồng' : title;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      {icon && (
        <Icon
          name={icon}
          size={18}
          color="white"
          style={{ marginRight: 4 }}
        />
      )}

      <Text
        size={16}
        fontWeight={700}
        fontFamily={"Roboto-Medium"}
        color={Color.white}
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButtonContract