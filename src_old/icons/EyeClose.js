import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgEyeclose(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={18.5}
      height={11.406}
      {...props}
      viewBox={'0 0 18.5 11.406'}>
      <G data-name="Group 4205">
        <Path
          data-name="Path 5397"
          d="M9.25.707a11.354 11.354 0 016.475 2.353 16.39 16.39 0 012.647 2.339.523.523 0 010 .685 16.392 16.392 0 01-2.647 2.339 11.355 11.355 0 01-6.475 2.353 11.354 11.354 0 01-6.475-2.353A16.393 16.393 0 01.128 6.084a.523.523 0 010-.685A16.393 16.393 0 012.775 3.06 11.354 11.354 0 019.25.707zm8.01 5.03a16.511 16.511 0 00-2.16-1.844A10.515 10.515 0 009.254 1.75a10.515 10.515 0 00-5.846 2.143 16.511 16.511 0 00-2.163 1.844 16.508 16.508 0 002.163 1.844 10.515 10.515 0 005.846 2.143A10.515 10.515 0 0015.1 7.581a16.506 16.506 0 002.16-1.844z"
          fill={Color.mainColor}
        />
      </G>
      <G data-name="Group 4206">
        <Path
          data-name="Path 5398"
          d="M9.251 2.493a3.243 3.243 0 11-2.136 5.684.523.523 0 11.689-.787 2.2 2.2 0 10-.75-1.653.523.523 0 11-1.046 0 3.247 3.247 0 013.243-3.244z"
          fill={Color.mainColor}
        />
      </G>
      <Path
        data-name="Line 7"
        fill="none"
        stroke={Color.mainColor}
        strokeLinecap="round"
        d="M4.597 10.703l8-10"
      />
    </Svg>
  );
}

export default SvgEyeclose;
