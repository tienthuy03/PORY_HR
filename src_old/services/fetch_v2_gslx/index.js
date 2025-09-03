import axios from "axios";
import { deviceId } from "../../constants";

const sysFetch = async (api, data, api_key, token) => {
  let axiosConfig = {
    headers: {
      "x-api-key": api_key,
    },
  };

  const response = await axios
    .post(
      api + "AuthAPIKey/MOBILE_V1/",
      {
        ...data,
        machine_id: deviceId,
        token: "tvs",
      },
      axiosConfig
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("err sysFetch", err);
    });

  return response;
};
export default sysFetch;
