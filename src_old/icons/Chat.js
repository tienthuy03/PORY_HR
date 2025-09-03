import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';
import {useSelector} from 'react-redux';
function SvgChat(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={24.037} height={21.032} {...props}>
      <G data-name="Group 349">
        <G data-name="Group 348">
          <Path
            fill={Color.mainColor}
            data-name="Path 253"
            d="M22.535 4.006h-2.5v1h2.5a.5.5 0 01.5.5v12.018a.5.5 0 01-.5.5h-7.011a.5.5 0 00-.354.147l-1.148 1.148v-.794a.5.5 0 00-.5-.5H6.511a.5.5 0 01-.5-.5v-1.5h-1v1.5a1.5 1.5 0 001.5 1.5h6.51v1.5a.5.5 0 00.855.354l1.856-1.856h6.8a1.5 1.5 0 001.5-1.5V5.508a1.5 1.5 0 00-1.497-1.502z"
          />
        </G>
      </G>
      <G data-name="Group 351">
        <G data-name="Group 350">
          <Path
            fill={Color.mainColor}
            data-name="Path 254"
            d="M17.527 0H1.5A1.5 1.5 0 000 1.5v12.021a1.5 1.5 0 001.5 1.5h7.013v1.5a.5.5 0 00.855.354l1.856-1.856h6.3a1.5 1.5 0 001.5-1.5V1.5A1.5 1.5 0 0017.527 0zm.5 13.521a.5.5 0 01-.5.5h-6.51a.5.5 0 00-.354.147l-1.148 1.148v-.794a.5.5 0 00-.5-.5H1.5a.5.5 0 01-.5-.5V1.5a.5.5 0 01.5-.5h16.027a.5.5 0 01.5.5z"
          />
        </G>
      </G>
      <G data-name="Group 353">
        <G data-name="Group 352">
          <Path
            data-name="Rectangle 202"
            d="M2.504 4.006h5.508v1.002H2.504z"
            fill={Color.mainColor}
          />
        </G>
      </G>
      <G data-name="Group 355">
        <G data-name="Group 354">
          <Path
            fill={Color.mainColor}
            data-name="Rectangle 203"
            d="M2.504 7.011h14.021v1.002H2.504z"
          />
        </G>
      </G>
      <G data-name="Group 357">
        <G data-name="Group 356">
          <Path
            fill={Color.mainColor}
            data-name="Rectangle 204"
            d="M2.504 10.015h14.021v1.002H2.504z"
          />
        </G>
      </G>
      <G data-name="Group 359">
        <G data-name="Group 358">
          <Path
            fill={Color.mainColor}
            data-name="Rectangle 205"
            d="M15.524 4.006h1.002v1.002h-1.002z"
          />
        </G>
      </G>
      <G data-name="Group 361">
        <G data-name="Group 360">
          <Path
            fill={Color.mainColor}
            data-name="Rectangle 206"
            d="M13.521 4.006h1.002v1.002h-1.002z"
          />
        </G>
      </G>
    </Svg>
  );
}

export default SvgChat;
