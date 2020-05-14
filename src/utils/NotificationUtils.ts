import { Platform, Vibration } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { addNotifTokenToUser, getUser } from "../utils/FirebaseUtils";

//import { Expo } from "expo-server-sdk";

//let expo = new Expo();

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
 commenterId is the id of the person who owns the comment
 userName is the name of the user who replied to the comment 
 */
async function sendCommenterNotification(reply, data, userName) {
  let commentUser = getUser(data.commenterId); // user profile of the person who owns the comment
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

/*
 If you want to navigate to a thread on opening notification data should
 be in form { commenterId, comment, commentId, date } else should be 
 {  }
 commentReply is the value of the reply
 userName is the name of the user who replied to the comment 
 */
async function sendRepliersNotification(
  currentUserId,
  commentReply,
  replies,
  userName,
  data
) {
  const sent = {}; // to make sure people do not get multiple notifs if they commented multiple times
  //sent[currentUserId] = "seen"; // to make sure current user doesnt get a notif
  replies.forEach(async (reply) => {
    const userId = reply.userId;
    if (!(userId in sent)) {
      sent[userId] = "seen";
      let commentUser = getUser(userId);
      if ((await commentUser).notificationId) {
        let notifId = (await commentUser).notificationId;
        const message = await {
          to: notifId,
          sound: "default",
          title: `${userName} responded to a comment you replied to`,
          body: commentReply,
          data,
          _displayInForeground: true,
        };

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
        });
      }
    }
  });
}

export {
  registerForPushNotificationsAsync,
  sendCommenterNotification,
  sendRepliersNotification,
};
