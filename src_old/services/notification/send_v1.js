import axios from 'axios';
function RequestSendNotificationV1(arrReceiver, apiAddress, token = '') {
  try {
    if (arrReceiver.length === 0) {
      return;
    }
    console.log('send v1 v1');
    console.log(apiAddress);
    if (arrReceiver.length > 0) {
      const URL = apiAddress + 'Notification/PushV1';
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      let prarams;
      let arrayTokens = [];
      let arrayTitles = [];
      let arrayBodys = [];
      arrReceiver.forEach(function (item) {
        if (
          item.device_id !== '' &&
          item.device_id != null &&
          item.device_id != 'null'
        ) {
          arrayTokens.push(item.device_id);
          arrayTitles.push(item.ann_title);
          arrayBodys.push(item.ann_content);
        }
      });
      console.log('arrayTitles ', arrayTitles);
      if (arrayTokens.length > 0) {
        prarams = {
          body: arrayBodys,
          title: arrayTitles,
          ids: arrayTokens,
          length: arrReceiver.length,
        };
        console.log('prarams ', prarams);
        axios
          .post(
            URL,
            {
              body: arrayBodys,
              title: arrayTitles,
              ids: arrayTokens,
              length: arrayTokens.length,
            },
            axiosConfig,
          )
          .then(response => {
            console.log('Send v1 Notification:', response.data);
          })
          .catch(error => {
            console.log('Send Notification: Fail ', error);
          });
      }
    }
  } catch (error) {
    console.log('Send Notification: Fail ', error);
  }
}
export default RequestSendNotificationV1;
