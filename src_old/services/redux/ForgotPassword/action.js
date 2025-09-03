export const FP_CHECK_USERNAME = 'FP_CHECK_USERNAME';

export const fpCheckUsername = (username, email, deviceName, deviceId) => {
  return {
    type: FP_CHECK_USERNAME,
    username,
    email,
    deviceName,
    deviceId
  };
};

export const FP_SET_INFORMATION = 'FP_SET_INFORMATION';
export const fpSetInformation = (info) => ({
  type: FP_SET_INFORMATION,
  info,
});
