import axios from 'axios';
function RequestSendNotification(arrReceiver, apiAddress, token = '') {
  try {
    if (arrReceiver.length === 0) {
      return;
    }
    var arrayTokens = [];
    arrReceiver.map(item => {
      if (
        item.device_id !== '' &&
        item.device_id != null &&
        item.device_id != 'null'
      ) {
        arrayTokens.push(item.device_id);
      }
    });
    if (arrReceiver.length > 0) {
      console.log('arrReceiver[0].ann_content ', arrReceiver[0].ann_content);
      console.log('arrReceiver[0].ann_title ', arrReceiver[0].ann_title);
      console.log('arrayTokens ', arrayTokens);
      let prarams = {
        body: arrReceiver[0].ann_content,
        title: arrReceiver[0].ann_title,
        ids: arrayTokens,
      };
      const URL = apiAddress + 'Notification/Push';
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .post(URL, prarams, axiosConfig)
        .then(response => {
          console.log('arrayTokens ', arrayTokens);
          console.log('Send Notification:', response.data);
        })
        .catch(error => {
          console.log('Send Notification: Fail ', error);
        });
    }
  } catch (error) {
    console.log('Send Notification: Fail ', error);
  }
}
export default RequestSendNotification;
