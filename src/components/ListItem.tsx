import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import { Card, Text, Modal, Button, Input } from "@ui-kitten/components";
import { View } from "react-native";
import PropTypes from "prop-types";
import Colors from "../constants/userColors";
import ListItemStyles from "../StyleSheets/ListItemStyles";
import ReportDialogueStyles from "../StyleSheets/ReportDialogueStyles";
import {
  manageFollowingComment,
  editComment,
  deleteComment,
} from "../utils/FirebaseUtils";
import { Entypo } from "@expo/vector-icons";

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
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(following);

  const commentColor = Colors[color];

  const RepliesNumber = () => {
    if (showReplies == "True") {
      return (
        <View>
          <Text>{numReplies ? numReplies : 0} Replies </Text>
        </View>
      );
    } else {
      return null;
    }
  };

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
            style={{ opacity: 0.7 }}
          />
        </TouchableOpacity>
      </View>
      <Text style={ListItemStyles.comments}>{text}</Text>
      <View style={ListItemStyles.bottomRow}>
        <RepliesNumber />
        {showReplies === "False" ? (
          <Text></Text>
        ) : !isFollowing ? (
          /*<Image
            source={require("../../assets/unfollow.png")}
            style={ListItemStyles.image}
          /> Keep these comments in case we want to change back*/
          <Text></Text>
        ) : (
          /*<Image
            source={require("../../assets/follow-icon.png")}
            style={ListItemStyles.image}
          />*/
          <Text style={{ fontSize: 12, opacity: 0.5, padding: 1 }}>
            Following
          </Text>
        )}
      </View>
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
                  }}
                  style={[
                    ReportDialogueStyles.reportReasons,
                    {
                      marginBottom: 50,
                      height: "20%",
                      backgroundColor: "#5505BA",
                    },
                  ]}
                >
                  <Text style={{ color: "white" }}>Save Changes</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setEditing(true)}
                  style={[
                    ReportDialogueStyles.reportReasons,
                    {
                      marginBottom: 5,
                      marginTop: 10,
                      height: "20%",
                      backgroundColor: "#5505BA",
                    },
                  ]}
                >
                  <Text style={{ color: "white" }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteComment(commentId)}
                  style={[
                    ReportDialogueStyles.reportReasons,
                    {
                      marginBottom: 50,
                      marginTop: 5,
                      height: "20%",
                      backgroundColor: "#5505BA",
                    },
                  ]}
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
              style={[
                ReportDialogueStyles.reportReasons,
                { marginTop: 5, height: "20%", backgroundColor: "#5505BA" },
              ]}
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
              style={[
                ReportDialogueStyles.reportReasons,
                {
                  marginBottom: 5,
                  marginTop: 10,
                  height: "20%",
                  backgroundColor: "#5505BA",
                },
              ]}
            >
              <Text style={{ color: "white" }}>Report</Text>
            </TouchableOpacity>
            {showReplies == "True" ? (
              <TouchableOpacity
                onPress={() => {
                  manageFollowingComment(isFollowing, commentId, userId);
                  setIsFollowing(!isFollowing);
                }}
                style={[
                  ReportDialogueStyles.reportReasons,
                  {
                    marginBottom: 50,
                    marginTop: 10,
                    height: "20%",
                    backgroundColor: "#5505BA",
                  },
                ]}
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
              style={[
                ReportDialogueStyles.reportReasons,
                { marginTop: 5, height: "20%", backgroundColor: "#5505BA" },
              ]}
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
  //following: PropTypes.bool.isRequired,
  commentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  commenterId: PropTypes.string.isRequired,
};
