import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Card, Text, Modal, Layout, Input } from "@ui-kitten/components";
import { View } from "react-native";
import PropTypes from "prop-types";
import { Entypo } from "@expo/vector-icons";
import Colors from "../constants/userColors";
import ListItemStyles from "../StyleSheets/ListItemStyles";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles";
import {
  manageFollowingComment,
  editComment,
  deleteComment,
} from "../utils/FirebaseUtils";
import PureImage from "../components/PureImage";

export default function ListItem({
  text,
  onReport,
  date,
  onReply,
  numReplies,
  showReplies,
  commenterName,
  color,
  following,
  commentId,
  userId,
  commenterId,
  setQuery,
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(following);

  const commentColor = Colors[color];

  const RepliesNumber = (
    <Layout style={{ flexDirection: "row", alignItems: "center" }}>
      <PureImage
        source={require("../../assets/chat-icon.png")}
        style={[ListItemStyles.image, ListItemStyles.mr]}
      />
      <Text style={ListItemStyles.replyNum}>{numReplies ? numReplies : 0}</Text>
    </Layout>
  );

  return (
    <Card style={ListItemStyles.card} onPress={onReply}>
      <View style={{ flexDirection: "row" }}>
        <View
          style={[ListItemStyles.square, { backgroundColor: commentColor }]}
        />
        <Text style={ListItemStyles.userName}>{commenterName}</Text>
        <Text style={ListItemStyles.date}>
          {" * "}
          {date}
        </Text>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={{ position: "absolute", right: 0 }}
        >
          <Entypo
            name="dots-three-horizontal"
            size={20}
            style={{ opacity: 0.7, paddingLeft: 7, paddingBottom: 7 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={ListItemStyles.comments}>{text}</Text>
      {showReplies ? (
      <View style={ListItemStyles.bottomRow}>
        {RepliesNumber}
        {!isFollowing ? (
          <View></View>
        ) : (
          <PureImage
            source={require("../../assets/follow-icon.png")}
            style={[ListItemStyles.image]}
          />
        )}
      </View>
      )  :  (
        <View></View>
      )}
      <Modal
        visible={visible}
        style={[ReportDialogueStyles.container, { height: "25%" }]}
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onBackdropPress={() => {
          // on touching anything but modal close and reset
          setVisible(false);
          setValue(text);
          setEditing(false);
        }}
      >
        {userId == commenterId ? (
          <>
            {editing ? ( // if editing is pressed edit comment
              <>
                <Input
                  multiline
                  value={value}
                  onChangeText={(e) => setValue(e)}
                  style={{
                    marginTop: 10,
                    marginBottom: 5,
                    width: "90%",
                    alignSelf: "center",
                    height: "20%",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    //edit comments and close/reset modal
                    editComment(commentId, value);
                    setVisible(false);
                    setValue(value);
                    setEditing(false);
                    if (setQuery) {
                      setQuery("");
                    }
                  }}
                  style={[ReportDialogueStyles.reportReasons]}
                >
                  <Text style={{ color: "white" }}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setEditing(true)}
                  style={[ReportDialogueStyles.reportReasons]}
                >
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteComment(commentId)}
                  style={[ReportDialogueStyles.reportReasons]}
                >
                  <Text style={{ color: "white" }}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              onPress={() => {
                // reset everything on cancel
                setVisible(false);
                setValue(text);
                setEditing(false);
              }}
              style={[ReportDialogueStyles.submitButton]}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={
                onReport /* currently "onReport" to make show false might have to change */
              }
              style={[ReportDialogueStyles.reportReasons]}
            >
              <Text style={{ color: "white" }}>Report</Text>
            </TouchableOpacity>
            {showReplies ? (
              <TouchableOpacity
                onPress={() => {
                  manageFollowingComment(isFollowing, commentId, userId);
                  setIsFollowing(!isFollowing);
                }}
                style={[ReportDialogueStyles.reportReasons]}
              >
                <Text style={{ color: "white" }}>
                  {isFollowing ? "Unfollow Post" : "Follow Post"}
                </Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
            <TouchableOpacity
              onPress={() => {
                // reset everything on cancel
                setVisible(false);
                setValue(text);
                setEditing(false);
              }}
              style={[ReportDialogueStyles.submitButton]}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </Modal>
    </Card>
  );
}

ListItem.propTypes = {
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onReport: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  commenterName: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  showReplies: PropTypes.bool.isRequired,
  numReplies: PropTypes.number,
  //following: PropTypes.bool.isRequired,
  commentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  commenterId: PropTypes.string.isRequired,
  setQuery: PropTypes.func,
};
