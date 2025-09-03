import { ScrollView, View } from "react-native";
import { Text } from "react-native-svg";
import { PieChart } from "react-native-svg-charts";
import Block from "../../../../../components/Block";
import Texts from "../../../../../components/Text";
import React, { useEffect, useState } from "react";

const Tab = ({ dataSend, onReload }) => {
  const [data, setData] = useState(null);
  const pie1 = { fill: "rgb(132, 211,227)" };
  const pie2 = { fill: "rgb(252, 181,79)" };
  const pie3 = { fill: "rgb(17, 128,85)" };
  const pie4 = { fill: "rgb(250, 100,95)" };
  const pie5 = { fill: "rgb(255, 205,86)" };
  const pie6 = { fill: "rgb(255, 255,255)" };

  useEffect(() => {
    if (dataSend === null || dataSend.length == 0) return;
    let temp = [];
    dataSend.map((item) => {
      switch (item.key) {
        case 1:
          temp.push({ ...item, svg: pie1 });
          return;
        case 2:
          temp.push({ ...item, svg: pie2 });
          return;
        case 3:
          temp.push({ ...item, svg: pie3 });
          return;
        case 4:
          temp.push({ ...item, svg: pie4 });
          return;
        case 5:
          temp.push({ ...item, svg: pie5 });
          return;
        case 6:
          const percent_issues =
            100 -
            rs.data.data[0].percent_issues -
            rs.data.data[1].percent_issues -
            rs.data.data[2].percent_issues -
            rs.data.data[3].percent_issues -
            rs.data.data[4].percent_issues -
            rs.data.data[5].percent_issues;
          temp.push({ ...item, percent_issues, svg: pie6 });
          return;
      }
    });
    setData(temp);
  }, [dataSend]);

  //PieChart
  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <>
          {data.percent_issues > 0 ? (
            <Text
              key={index}
              x={pieCentroid[0]}
              y={pieCentroid[1]}
              fill={"white"}
              textAnchor={"middle"}
              alignmentBaseline={"center"}
              fontSize={20}
            >
              {data.percent_issues + "%"}
            </Text>
          ) : null}
        </>
      );
    });
  };

  function itemCircle({ status_name, svg, percent_issues, number_issues }) {
    return (
      <ScrollView style={{ flex: 1 }}>
        <Block padding={5} row alignCenter key={status_name}>
          <Block radius={5} width={25} height={25} backgroundColor={svg.fill} />
          <Texts marginLeft={10}>{status_name}</Texts>
          <Block flex alignEnd>
            <Texts>
              {number_issues} - {percent_issues}%
            </Texts>
          </Block>
        </Block>
      </ScrollView>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: 8,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 5,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        {data === null ? null : (
          <Block column margin={10} radius={8} padding={5}>
            {data !== null ? data.map((item) => itemCircle(item)) : null}
          </Block>
        )}
        <View
          style={{
            alignContent: "center",
            justifyContent: "center",
            borderRadius: 8,
            margin: 10,
            padding: 5,
          }}
        >
          {data === null ? null : data.length === 0 ? (
            <View
              style={{
                height: "100%",
                top: -100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Texts>Không có dữ liệu thống kê trong thời gian này.</Texts>
            </View>
          ) : (
            <PieChart
              style={{ height: 300 }}
              valueAccessor={({ item }) => item.percent_issues}
              data={data}
              spacing={0}
              outerRadius={"95%"}
            >
              <Labels />
            </PieChart>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Tab;
