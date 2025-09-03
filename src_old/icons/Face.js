import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgFaceid(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg
      width={53.453}
      height={53.453}
      {...props}
      viewBox={'0 0 53.453 53.453'}>
      <G data-name="Group 347">
        <G data-name="Group 341">
          <G data-name="Group 337">
            <Path
              data-name="Path 245"
              d="M1.4 15.548a1.4 1.4 0 01-1.4-1.4V7.773A7.782 7.782 0 017.773.001h6.373a1.4 1.4 0 110 2.8H7.773a4.978 4.978 0 00-4.972 4.972v6.374A1.4 1.4 0 011.4 15.548z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 338">
            <Path
              data-name="Path 246"
              d="M52.052 15.548a1.4 1.4 0 01-1.4-1.4V7.773a4.979 4.979 0 00-4.972-4.972h-6.373a1.4 1.4 0 110-2.8h6.373a7.782 7.782 0 017.773 7.773v6.374a1.4 1.4 0 01-1.401 1.4z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 339">
            <Path
              data-name="Path 247"
              d="M45.679 53.453h-6.373a1.4 1.4 0 010-2.8h6.373a4.978 4.978 0 004.972-4.972v-6.374a1.4 1.4 0 112.8 0v6.374a7.782 7.782 0 01-7.772 7.772z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 340">
            <Path
              data-name="Path 248"
              d="M14.146 53.453H7.773A7.781 7.781 0 010 45.68v-6.374a1.4 1.4 0 112.8 0v6.374a4.977 4.977 0 004.972 4.972h6.373a1.4 1.4 0 010 2.8z"
              fill={Color.mainColor}
            />
          </G>
        </G>
        <G data-name="Group 346">
          <G data-name="Group 342">
            <Path
              data-name="Path 249"
              d="M15.224 24.552a1.4 1.4 0 01-1.4-1.4v-4.363a1.4 1.4 0 012.8 0v4.362a1.4 1.4 0 01-1.4 1.401z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 343">
            <Path
              data-name="Path 250"
              d="M38.929 24.552a1.4 1.4 0 01-1.4-1.4v-4.363a1.4 1.4 0 012.8 0v4.362a1.4 1.4 0 01-1.4 1.401z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 344">
            <Path
              data-name="Path 251"
              d="M24.241 32.257a1.4 1.4 0 010-2.8c.812 0 1.541-.139 1.541-1.812v-8.856a1.4 1.4 0 112.8 0v8.853c.003 2.889-1.62 4.615-4.341 4.615z"
              fill={Color.mainColor}
            />
          </G>
          <G data-name="Group 345">
            <Path
              data-name="Path 252"
              d="M26.727 41.314a13.845 13.845 0 01-8.783-3.148 1.4 1.4 0 111.783-2.161 11.022 11.022 0 0014 0 1.4 1.4 0 011.783 2.161 13.845 13.845 0 01-8.783 3.148z"
              fill={Color.mainColor}
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default SvgFaceid;
