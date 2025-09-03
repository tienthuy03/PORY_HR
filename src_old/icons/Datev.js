import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgDatev(props) {
  const Color = useSelector(s => s.SystemReducer.theme);
  return (
    <Svg width={20} height={20} {...props} viewBox={'0 0 19.5 21.5'}>
      <G
        fill="none"
        stroke={Color.mainColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}>
        <Path
          //   fill={Color.mainColor}
          d="M.843 8.154h17.824M14.193 12.06h.009M9.755 12.06h.009M5.308 12.06h.009M14.193 15.946h.009M9.755 15.946h.009M5.308 15.946h.009M13.794.75v3.291M5.715.75v3.291M13.988 2.329H5.521C2.584 2.329.75 3.965.75 6.972v9.05c0 3.054 1.834 4.728 4.771 4.728h8.458c2.946 0 4.771-1.645 4.771-4.652V6.972c.009-3.007-1.816-4.643-4.762-4.643z"
        />
      </G>
    </Svg>
  );
}

export default SvgDatev;
