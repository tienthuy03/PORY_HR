import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgMail(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={20} height={18} {...props}>
      <Path
        d="M5.8 18A5.832 5.832 0 010 12.155v-6.31A5.824 5.824 0 015.8 0h8.4A5.842 5.842 0 0120 5.845v1.462a.71.71 0 01-.707.713l-.01-.02a.705.705 0 01-.5-.209.716.716 0 01-.207-.5V5.845a4.439 4.439 0 00-4.376-4.41H5.8a4.44 4.44 0 00-4.376 4.41v6.309A4.44 4.44 0 005.8 16.565h8.4a4.439 4.439 0 004.378-4.411.716.716 0 011.424 0A5.842 5.842 0 0114.2 18zm2.25-8.02L3.928 6.656a.725.725 0 01-.106-1.007.7.7 0 01.991-.107l4.156 3.316a1.425 1.425 0 001.769 0l4.113-3.316h.009a.711.711 0 11.885 1.114L11.632 9.98a2.84 2.84 0 01-3.582 0z"
        fill={Color.mainColor}
      />
    </Svg>
  );
}

export default SvgMail;
