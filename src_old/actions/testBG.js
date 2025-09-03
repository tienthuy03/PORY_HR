import BackgroundService from 'react-native-background-actions';
const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};
await BackgroundService.start(veryIntensiveTask, options);
await BackgroundService.updateNotification({
  taskDesc: 'New ExampleTask description',
}); // Only Android, iOS will ignore this call
// iOS will also run everything here in the background until .stop() is called
await BackgroundService.stop();
