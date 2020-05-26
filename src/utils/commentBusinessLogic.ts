import * as Analytics from "expo-firebase-analytics";
import { User } from "../Models";
import {
  addComment,
  addReply,
  incrementGroupConnectors,
  followComment,
} from "../utils/FirebaseUtils";
import { managePushNotification } from "../utils/NotificationUtils";

function addReplyLogic(
  userId: string,
  value: string,
  commentId: string,
  commenterId: string,
  comment: string,
  date: string,
  user: User
) {
  followComment(commentId, userId);
  managePushNotification(value, userId, user.name, {
    commenterId,
    comment,
    commentId,
    date,
  });
  addReply(commentId, {
    userId: userId,
    text: value,
    reports: 0,
    show: true,
    numReplies: 0,
    color: user.color,
    commenterName: user.name,
  });
  Analytics.logEvent("ReplySubmitted", {
    name: "reply",
    screen: "Replies",
    purpose: "Reply to a comment",
  });
}

function addCommentLogic(
  userId: string,
  value: string,
  groupId: string,
  user: User
) {
  addComment(
    {
      userId: userId,
      text: value,
      reports: 0,
      show: true,
      numReplies: 0,
      color: user.color,
      commenterName: user.name,
    },
    groupId
  );
  incrementGroupConnectors(groupId);
  Analytics.logEvent("CommentSubmitted", {
    name: "comment",
    screen: "Thread",
    purpose: "Post a comment",
  });
}

export { addReplyLogic, addCommentLogic };
