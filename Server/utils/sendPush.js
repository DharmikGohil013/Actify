// Placeholder: Replace with OneSignal, FCM, or custom Web Push implementation

const sendPush = async (user, message, data = {}) => {
  // If pushToken exists and push is enabled, send
  if (!user || user.settings?.pushNotifications === false) {
    return false;
  }

  // Log for now – replace with push provider code
  console.log(`📲 PUSH to ${user.email || user._id}: ${message}`);

  // Example to integrate:
  // await pushProvider.send({
  //   to: user.pushToken,
  //   title: 'Actify',
  //   body: message,
  //   data
  // });

  return true;
};

module.exports = sendPush;
