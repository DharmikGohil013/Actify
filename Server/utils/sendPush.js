// /utils/sendPush.js
// This is a placeholder—expand as needed with your notification provider

const sendPush = async (user, message, data = {}) => {
  // Implement push logic using FCM, OneSignal, or browser API
  // Example:
  // await pushProvider.send({ to: user.pushToken, title: 'Actify', body: message, ...data });
  console.log(`Push notification to user ${user.email}: ${message}`);
  return true;
};

module.exports = sendPush;
