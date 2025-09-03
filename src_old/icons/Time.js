import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgTime(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={20.81} height={20.81} {...props} viewBox={'0 0 20.81 20.81'}>
      <G
        data-name="Icon feather-clock"
        fill="none"
        stroke={Color.mainColor}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path
          data-name="Path 186"
          d="M20.31 10.4A9.9 9.9 0 1110.4.5a9.9 9.9 0 019.91 9.9z"
        />
        <Path data-name="Path 187" d="M10.18 4.222v6.483l4.322 2.161" />
      </G>
    </Svg>
  );
}

export default SvgTime;
