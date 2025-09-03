import React from 'react';
import { useSelector } from 'react-redux';
import Block from '../../../../../../components/Block';
import Text from '../../../../../../components/Text';
import CustomButtonContract from '../ButtonContract';

const ContractInfo = ({ title, data = {}, status, onPress, status_val }) => {
  const Color = useSelector((state) => state.SystemReducer.theme);

  const getStatusStyles = (status_val) => {
    switch (status_val) {
      case '1':
        return { textColor: '#B22222', bgColor: '#FFABAB' };
      case '2':
        return { textColor: '#007FFF', bgColor: '#80D8FF' };
      case '3':
        return { textColor: '#000000', bgColor: '#d9d9d9' };
      default:
        return { textColor: 'gray', bgColor: '#9E9E9E' };
    }
  };

  const { textColor, bgColor } = getStatusStyles(status_val);

  const renderField = (label, value) => {
    if (!value) return null; // Bỏ qua nếu giá trị không tồn tại
    return (
      <Block row justifyContent="space-between" paddingBottom={8} key={label}>
        <Text size={16} color={Color.textPrimary3}>
          {label}:
        </Text>
        <Text size={16} fontWeight={600} color={Color.textPrimary2}>
          {value}
        </Text>
      </Block>
    );
  };

  return (
    <Block backgroundColor={Color.white} padding={12} radius={12}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}>
      {/* Header với tên hợp đồng và trạng thái */}
      <Block row justifyContent="space-between" paddingBottom={8}>
        <Text size={16} fontFamily={"Roboto-Bold"} fontWeight={700}>
          {title}
        </Text>
        <Block
          backgroundColor={bgColor}  // Set background color based on status_val
          paddingVertical={4}
          paddingHorizontal={10}
          radius={100}
        >
          <Text
            color={textColor}  // Set text color based on status_val
            fontWeight={700}
            size={14}
            fontFamily={"Roboto-Medium"}
            paddingHorizontal={4}
          >
            {status}
          </Text>
        </Block>
      </Block>

      {/* Dynamically render all fields from data */}
      {Object.entries(data).map(([key, value]) => renderField(key, value))}

      <Block borderTopWidth={1} borderColor={"#E4E4E4"} />
      <Block row justifyContent="space-around" marginTop={12}>
        <CustomButtonContract
          title="Xem và ký hợp đồng"
          icon="eye"
          color={Color.backgroundColor3}
          onPress={onPress}
          status_val={status_val}
        />
      </Block>
    </Block>
  );
};

export default ContractInfo;
