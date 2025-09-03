import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgNextIc(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={5.307} height={9.354} {...props}>
      <G data-name="Group 4199">
        <Path
          data-name="Path 5178"
          d="M.475 9.333c-.594-.409-.635-.778-.1-1.29l3.069-3.071c.1-.1.184-.184.287-.307-.1-.1-.184-.2-.287-.307L.393 1.308A2.191 2.191 0 01.107.98.6.6 0 01.209.2.571.571 0 01.967.1a2.191 2.191 0 01.328.287L4.938 4.03c.491.491.491.8 0 1.29L1.294 8.965a4.32 4.32 0 01-.471.389 1.873 1.873 0 00-.348-.021z"
          fill={Color.mainColor}
        />
      </G>
    </Svg>
  );
}

export default SvgNextIc;
