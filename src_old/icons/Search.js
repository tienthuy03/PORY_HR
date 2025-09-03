import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

function SvgSearch(props) {
  return (
    <Svg
      width={19.745}
      height={19.745}
      {...props}
      viewBox={'0 0 19.745 19.745'}>
      <G
        data-name="Icon feather-search"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}>
        <Path
          data-name="Path 189"
          d="M18.684 18.684L14.35 14.35"
          stroke="#173f81"
        />
        <Path
          data-name="Path 190"
          d="M16.692 8.721A7.971 7.971 0 118.721.75a7.971 7.971 0 017.971 7.971z"
          stroke="#1e4182"
        />
      </G>
    </Svg>
  );
}

export default SvgSearch;
