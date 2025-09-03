import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function SvgCheckbool(props) {
  return (
    <Svg width={13.414} height={9.414} {...props} viewBox={'0 0 13.414 9.414'}>
      <G data-name="Group 4201" fill="none" stroke="#fff" strokeLinecap="round">
        <Path data-name="Line 5" d="M.707 4.707l4 4" />
        <Path data-name="Line 6" d="M12.707.707l-8 8" />
      </G>
    </Svg>
  );
}

export default SvgCheckbool;
