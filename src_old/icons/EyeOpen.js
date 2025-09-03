import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgEyeopen(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18.5}
      height={10.068}
      viewBox={'0 0 18.5 10.068'}
      {...props}>
      <G data-name="Group 4205">
        <Path
          data-name="Path 5397"
          d="M9.25.004a11.354 11.354 0 016.475 2.353 16.39 16.39 0 012.647 2.339.523.523 0 010 .685 16.392 16.392 0 01-2.647 2.339 11.355 11.355 0 01-6.475 2.353A11.354 11.354 0 012.775 7.72 16.393 16.393 0 01.128 5.381a.523.523 0 010-.685 16.393 16.393 0 012.647-2.339A11.354 11.354 0 019.25.004zm8.01 5.03A16.511 16.511 0 0015.1 3.19a10.515 10.515 0 00-5.846-2.143A10.515 10.515 0 003.408 3.19a16.511 16.511 0 00-2.163 1.844 16.508 16.508 0 002.163 1.844 10.515 10.515 0 005.846 2.143A10.515 10.515 0 0015.1 6.878a16.506 16.506 0 002.16-1.844z"
          fill={Color.mainColor}
        />
      </G>
      <G data-name="Group 4206">
        <Path
          data-name="Path 5398"
          d="M9.251 1.79a3.243 3.243 0 11-2.136 5.684.523.523 0 11.689-.787 2.2 2.2 0 10-.75-1.653.523.523 0 11-1.046 0A3.247 3.247 0 019.251 1.79z"
          fill={Color.mainColor}
        />
      </G>
    </Svg>
  );
}

export default SvgEyeopen;
