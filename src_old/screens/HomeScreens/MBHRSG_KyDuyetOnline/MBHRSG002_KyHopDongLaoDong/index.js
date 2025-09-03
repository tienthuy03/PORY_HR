import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSelector } from "react-redux";
import Block from "../../../../components/Block";
import Text from "../../../../components/Text";
import TVSHeader from "../../../../components/Tvs/Header";
import { APP_VERSION } from "../../../../config/Pro";
import { setHeaderChil2 } from "../../../../Language";
import sysFetch from "../../../../services/fetch_v1";
import StatusButtons from "./components/ButtonStatus";
import ContractInfo from "./components/ContractInfo";
import { formatContractEndDate } from "./components/FormattDeadline";
import ModalSignIn from "./components/ModalSignIn";

const KyHopDongLaoDong = ({ navigation }) => {

  const API = useSelector((state) => state.SysConfigReducer.API_URL);
  const Color = useSelector((state) => state.SystemReducer.theme);
  const loginReducers = useSelector((state) => state.loginReducers);
  const menuReducer = useSelector((state) => state.menuReducer);

  const [isShowModalSignIn, setIsShowModalSignIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("0");

  console.log("================ data =================: ", data);


  const employee_pk = useSelector(
    (state) => state.loginReducers.data.data.thr_emp_pk
  );
  const tokenLogin = useSelector(
    (state) => state.loginReducers.data.data.tokenLogin
  );
  const crt_by = useSelector((state) => state.loginReducers.data.data.crt_by);

  const headerTitle = setHeaderChil2(
    loginReducers.data?.data?.user_language,
    menuReducer.data?.data?.menu,
    "MBHRSG002",
    menuReducer.data?.data?.menu?.find((x) => x.menu_cd === "MBHRSG002")?.p_pk
  );

  const GetData = () => {
    setLoading(true);
    sysFetch(
      API,
      {
        pro: "SELHRSG002000",
        in_par: {
          p1_varchar2: employee_pk,
          p2_varchar2: APP_VERSION,
          p3_varchar2: crt_by,
        },
        out_par: {
          p1_sys: "data",
        },
      },
      tokenLogin
    )
      .then((rs) => {
        if (rs !== "Token Expired") {
          setData(rs.data.data || []);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    GetData();
  };

  // Lọc các giá trị status_val và status_nm duy nhất
  const uniqueStatuses = data.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (t) => t.status_val === item.status_val && t.status_nm === item.status_nm
      )
  );

  // Sắp xếp theo thứ tự status_val: 1, 2, 3
  const statusContract = uniqueStatuses
    .map(({ status_nm, status_val }) => ({
      status_nm,
      status_val,
    }))
    .sort((a, b) => a.status_val - b.status_val);

  console.log(statusContract);

  // Thêm phần tử "Tất cả" với id là 0
  statusContract.unshift({ status_nm: "Tất cả", status_val: "0" });

  //filterDate theo status
  const filteredData = selectedStatus === "0" ? data : data.filter((item) => item.status_val === selectedStatus);

  const handleStatusPress = (statusVal) => {
    setSelectedStatus(statusVal);
    console.log("Selected status value:", statusVal);
  };


  return (

    <Block flex backgroundColor={Color.white}>
      <TVSHeader goBack={navigation.goBack}>{headerTitle}</TVSHeader>
      <Block flex={1}>
        <FlatList
          ListHeaderComponent={<StatusButtons buttonStatus={statusContract} onPress={handleStatusPress} />}
          data={filteredData}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={{ paddingBottom: 12, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Block paddingBottom={12}>
              <ContractInfo
                title={item["_tên hợp đồng"]}
                data={{
                  "Số hợp đồng": item["_số hợp đồng"],
                  "Loại hợp đồng": item["_loại hợp đồng"],
                  "Bắt đầu hợp đồng": item["_bắt đầu hợp đồng"],
                  "Kết thúc hợp đồng": item["_kết thúc hợp đồng"],
                  ...(item.status_val !== '2' && { // kiểm tra nếu status_val khác 2 thì sẽ hiển thị deadline ký
                    "Thời hạn ký": formatContractEndDate(item["_thời hạn ký"]),
                  }),
                }}
                status={item.status_nm}
                onPress={() => navigation.navigate("ChiTietHopDongLaoDong",
                  {
                    contract_pk: item.contract_pk,
                    status_val: item.status_val
                  })}
                status_val={item.status_val}
              />
            </Block>
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            !loading && (
              <Block flex justifyContent="center" alignItems="center" marginTop={50}>
                <Text style={{ fontSize: 16, color: Color.textSecondary }}>
                  Không có hợp đồng nào.
                </Text>
              </Block>
            )
          }
          ListFooterComponent={
            loading && (
              <Block justifyContent="center" alignItems="center" paddingVertical={16}>
                <ActivityIndicator size="large" color={Color.primary} />
              </Block>
            )
          }
        />
      </Block>
      <ModalSignIn
        visible={isShowModalSignIn}
        onClose={() => setIsShowModalSignIn(false)}
      />
    </Block>
  );
};

export default KyHopDongLaoDong;
