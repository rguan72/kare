import { Platform, Vibration } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import {
  addNotifTokenToUser,
  getUser,
  getComment,
} from "../utils/FirebaseUtils";

interface data {
  commenterId: String;
  comment: String;
  commentId: String;
  date: String;
}

// Registers for notifications by adding Exponent token to user in db
async function registerForPushNotificationsAsync(userId: string) {
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
async function sendCommenterNotification(
  reply: string,
  data: data,
  userName: string
) {
  let sent = {};
  let commentUser = getUser(data.commenterId); // user profile of the person who owns the comment
  sent[(await commentUser).userId] = "seen"; // mark that a notif has been sent to the user
  let notifId = (await commentUser).notificationId;
  const message = await {
    to: notifId,
    sound: "default",
    title: `${userName} replied to your comment!`,
    body: reply,
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
  }, 0);

  return sent;
}

/*
 If you want to navigate to a thread on opening notification data should
 be in form { commenterId, comment, commentId, date } else should be 
 {  }
 commentReply is the value of the reply
 userName is the name of the user who replied to the comment 
 */
async function sendRepliersNotification(
  currentUserId: string,
  commentReply: string,
  replies: Array<string>,
  userName: string,
  data: data,
  sent: object
) {
  // might not need with new follow logic
  sent[currentUserId] = "seen"; // to make sure current user doesnt get a notif
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

  return sent;
}

/*
 If you want to navigate to a thread on opening notification data should
 be in form { commenterId, comment, commentId, date } else should be 
 {  }
 commentReply is the value of the reply
 userName is the name of the user who replied to the comment 
 */
async function sendFollowersNotification(
  commentReply: string,
  userName: string,
  data: data,
  sent: object
) {
  const commentData = getComment(data.commentId);
  const followers = (await commentData).followers;
  followers.forEach(async (userId) => {
    if (!(userId in sent)) {
      sent[userId] = "seen";
      let commentUser = getUser(userId);
      if ((await commentUser).notificationId) {
        let notifId = (await commentUser).notificationId;
        const message = await {
          to: notifId,
          sound: "default",
          title: `${userName} responded to a comment you follow`,
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

async function managePushNotification(
  commentReply: string,
  currentUserId: string,
  userName: string,
  data: data
) {
  const sent = {};
  sent[currentUserId] = "seen"; // so current user does not get notification
  if (currentUserId != data.commenterId) {
    // if you are not replying to your own comment
    const sentAfterInit = sendCommenterNotification(
      commentReply,
      data,
      userName
    );
    sendFollowersNotification(
      commentReply,
      userName,
      data,
      await sentAfterInit
    );
  } else {
    sendFollowersNotification(commentReply, userName, data, sent);
  }
}

export {
  registerForPushNotificationsAsync,
  sendCommenterNotification,
  sendRepliersNotification,
  sendFollowersNotification,
  managePushNotification,
};
