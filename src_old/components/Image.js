import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import defaultImage from '../assets/images/logo_hp.png';
const handleSquare = (number) => {
  return {
    width: number,
    height: number,
  };
};
const handleRound = (number) => {
  return {
    width: number,
    height: number,
    borderRadius: number / 2,
  };
};
const ImageView = ({
  imageUri,
  width,
  height,
  radius,
  contain,
  square,
  round,
  style,
  ...props
}) => {
  const [error, setError] = useState(false);
  const imageStyle = [
    width && {width: width},
    height && {height: height},
    square && {...handleSquare(square)},
    round && {...handleRound(round)},
    radius && {borderRadius: radius},
    style,
  ];

  return (
    <FastImage
      source={
        error
          ? defaultImage
          : {uri: imageUri, priority: FastImage.priority.normal}
      }
      // onError={() => setError(true)}
      resizeMode={
        contain ? FastImage.resizeMode.contain : FastImage.resizeMode.cover
      }
      style={imageStyle}
      {...props}
    />
  );
};

export default ImageView;
