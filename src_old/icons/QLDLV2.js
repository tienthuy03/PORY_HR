import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
import { useSelector } from "react-redux";
function SvgQldlv2(props) {
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
              d="M20.6 4H3.4C2.07452 4 1 5.07452 1 6.4V17.6C1 18.9255 2.07452 20 3.4 20H20.6C21.9255 20 23 18.9255 23 17.6V6.4C23 5.07452 21.9255 4 20.6 4Z"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
            <Path
              d="M5 15H10"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M5 12H10"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M5 9H10"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-miterlimit="10"
              stroke-linecap="round"
            />
            <Path
              d="M13 12L15 14L19 10"
              stroke={Color.mainColor}
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </Svg>
        </G>
      </G>
    </Svg>
  );
}

export default SvgQldlv2;
