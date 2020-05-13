import { Platform, Vibration } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import screens from "../constants/screenNames";
import { addNotifTokenToUser, getUser } from "../utils/FirebaseUtils";

// Registers for notifications by adding Exponent token to user in db
async function registerForPushNotificationsAsync(userId) {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const token = await Notifications.getExpoPushTokenAsync();
    // TODO add token to user in db
    console.log(`The exponent token for your device is ${token}`);
    addNotifTokenToUser(userId, token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.createChannelAndroidAsync("default", {
      name: "default",
      sound: true,
      priority: "max",
      vibrate: [0, 250, 250, 250],
    });
  }
}

/*
 If you want to navigate to a thread on opening notification data should
 be in form { commenterId, comment, commentId, date } else should be 
 { commenterId }
 */
async function sendCommenterNotification(reply, data, userName) {
  let commentUser = getUser(data.commenterId);
  let notifId = (await commentUser).notificationId;
  const message = await {
    to: notifId,
    sound: "default",
    title: `${userName} replied to your comment!`,
    body: reply,
    data,
    _displayInForeground: true,
  };

  console.log(`sent ${message.title} to ${await commentUser}`);

  setTimeout(async () => {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }, 0);
}

export { registerForPushNotificationsAsync, sendCommenterNotification };
