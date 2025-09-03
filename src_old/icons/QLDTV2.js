import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { useSelector } from "react-redux";
function SvgQldtv2(props) {
  const Color = useSelector((s) => s.SystemReducer.theme);
  return (
    <Svg width={83.208} height={61.311} {...props}>
      <G data-name="Group 4127">
        <Path
          data-name="Path 5283"
          d="M76.367 54.6c7.659-7.31 9.488-22.236 2.395-32.614-5.912-8.65-16.8-17.547-30.524-20.14s-25.745-2.591-30.944.836c-4.256 2.8-2.278 6.709-.943 10.027 1.782 4.43 2.044 7.947-5.283 14.383C2.703 34.438.439 37.192.02 44.3c-.341 5.777 4.482 13.548 10.811 14.662 8.812 1.55 12.082-2.545 20.7-5.305 6.916-2.214 11.712-1.179 17.981 3.065s15.616 8.61 26.855-2.122z"
          fill="#eef7fe"
        />
        <G data-name="Group 4200" fill={Color.mainColor}>
          <Svg width="75" height="45" viewBox="0 -3 20 26" fill="none">
            <Path
              d="M12 5C13.1046 5 14 4.10457 14 3C14 1.89543 13.1046 1 12 1C10.8954 1 10 1.89543 10 3C10 4.10457 10.8954 5 12 5Z"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
            <Path
              d="M14 3H18.6C19.9255 3 21 4.07452 21 5.4V20.6C21 21.9255 19.9255 23 18.6 23H5.4C4.07452 23 3 21.9255 3 20.6V5.4C3 4.07452 4.07452 3 5.4 3H10"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M7 13H17"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M7 10H17"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M7 16H13"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
          </Svg>
        </G>
      </G>
    </Svg>
  );
}

export default SvgQldtv2;
