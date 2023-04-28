/* IMPORTS */

import axios from "axios";
import { config } from "dotenv";
import "@webex/internal-plugin-mercury";
config();
import Webex from "webex";

import { formSubmitted, notifyLink } from "../controllers/general.js";
import mainCard from "../cards/hanna.json" assert { type: "json" };
import defaultCard from "../cards/defaultCard.json" assert { type: "json" };
import mongoClient, { mongoDB, typeCol, collectionType } from "../utils/db.js";

const webex = Webex.init({
  credentials: {
    access_token: process.env.WEBEX_ACCESS_TOKEN,
  },
});

let botId;

/* FUNCTIONS */

function sendWebexMessage(roomId, message, card) {
  let payload = {
    roomId: roomId,
    markdown: message,
  };
  if (card !== undefined) {
    payload.attachments = [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      },
    ];
  }
  webex.messages.create(payload).catch((err) => {
    console.log(`error sending message card: ${err}`);
  });
}

function createWebexMembership(payload) {
  return webex.memberships.create(payload).catch(function (reason) {
    console.log(`create membership failed: ${reason}`);
  });
}

function sendMainCard(roomId, personId) {
  let scenarioTypes = [];
  try {
    mongoClient
      .db(mongoDB)
      .collection(collectionType)
      .find({ personID: personId })
      .toArray(function (err, documents) {
        console.log("got scenarioTypes");
        if (documents.length > 0) {
          for (let doc of documents) {
            for (let scenarioList of doc.scenarioList) {
              scenarioTypes.push({
                title: scenarioList.scenario,
                value: scenarioList.scenario,
              });
            }
          }
          mainCard.body[6].choices = scenarioTypes;
          mainCard.body[6].value = scenarioTypes[0]["value"]; //preselect first item as value.  remove this line to default to --select-- placeholder in JSON card.
          sendWebexMessage(
            roomId,
            "Major Incident Request - Adaptive Card",
            mainCard
          );
        } else {
          mongoClient
            .db(mongoDB)
            .collection(collectionType)
            .find({ personID: "default" })
            .toArray(function (err, documents) {
              for (let doc of documents) {
                for (let scenarioList of doc.scenarioList) {
                  scenarioTypes.push({
                    title: scenarioList.scenario,
                    value: scenarioList.scenario,
                  });
                }
              }
              defaultCard.body[6].choices = scenarioTypes;
              defaultCard.body[6].value = scenarioTypes[0]["value"]; //preselect first item as value.  remove this line to default to --select-- placeholder in JSON card.
              sendWebexMessage(
                roomId,
                "Major Incident Request - Adaptive Card",
                defaultCard
              );
            });
        }
      });
  } catch (error) {
    console.log("Mongo DB error:", error);
  }
}

function sendIntroSpaceMessage(roomId, actorId, inputs, meetingLink) {
  let msg = `<@personId:${actorId}|> has created:  \n`;
  if (inputs.incident_id != "") {
    msg += `>**Incident ID**: ${inputs.incident_id} \n`;
  }
  msg += `>**Scenario**: ${inputs.scenario_type}  \n`;
  if (inputs.notes != "") {
    msg += `>**Notes**: ${inputs.notes}\n\n`;
  }
  msg += `>**Meeting Link**: ${meetingLink}\n\n`;
  sendWebexMessage(roomId, msg);
}

export function eventListener() {
  console.log("connected");
  webex.messages
    .listen()
    .then(() => {
      console.log("listening to message events");
      webex.messages.on("created", (message) => {
        if (message.actorId != botId) {
          console.log("actorid", message.actorId);
          console.log("message created event:");
          console.log(message);
          let roomId = message.data.roomId;
          sendMainCard(roomId, message.actorId);
        }
      });
    })
    .catch((err) => {
      console.error(`error listening to messages: ${err}`);
      process.exit();
    });

  webex.attachmentActions
    .listen()
    .then(() => {
      console.log("listening to attachmentAction events");
      webex.attachmentActions.on("created", (attachmentAction) => {
        console.log("attachmentAction created event:");
        console.log(attachmentAction);
        let messageId = attachmentAction.data.messageId;
        let roomId = attachmentAction.data.roomId;
        let inputs = attachmentAction.data.inputs;
        webex.people
          .get(attachmentAction.actorId)
          .then((person) => {
            console.log(person);
            if (inputs.submit == "main") {
              if (inputs.scenario_type != "") {
                formSubmitted(attachmentAction.actorId, inputs);
                webex.messages.remove(messageId).catch((err) => {
                  console.error(`error removing messages: ${err}`);
                });
                sendWebexMessage(
                  roomId,
                  "Thank you for your submission. A new space to discuss your request is being created now."
                );
              } else {
                sendWebexMessage(
                  roomId,
                  "Please select a scenario and resubmit to continue."
                );
              }
            } else if (inputs.submit == "intro") {
              webex.messages.remove(messageId);
              sendMainCard(roomId);
            }
          })
          .catch((err) => {
            console.error(`error getting people details: ${err}`);
          });
      });
    })
    .catch((err) => {
      console.error(`error listening to attachmentActions: ${err}`);
      process.exit();
    });
}

function botSetup() {
  webex.people
    .get("me")
    .then(function (person) {
      console.log(person);
      botId = person.id;
      console.log(`Saving BotId:${botId}`);
    })
    .catch(function (reason) {
      console.error(reason);
      process.exit(1);
    });
}

function createRoom({ actorId, inputs, doc, roomPayload }) {
  let licensedLink;
  let default_space_message;
  return webex.rooms
    .create(roomPayload)
    .then(function (room) {
      console.log("scenario Type:");
      console.log(inputs.scenario_type);
      for (let i = 0; i < doc.memberList.length; i++) {
        createWebexMembership({
          roomId: room.id,
          personEmail: doc.memberList[i].email,
        });
      }

      const body = { expire_hours: 8, sip_target: room.id, version: 2 };

      axios
        .post(process.env.CREATE_URL, body)
        .then((response) => {
          const { data } = response;
          console.log("URL created succesfully:", data);

          console.log(data.urls.Licensed[0]);
          licensedLink = data.urls.Licensed[0];
          default_space_message = "Has to be set"; //doc.default_space_message;
          notifyLink(doc, licensedLink, inputs, default_space_message);
          createWebexMembership({
            roomId: room.id,
            personId: actorId,
          }).then(() => {
            sendIntroSpaceMessage(room.id, actorId, inputs, licensedLink);
          });
        })
        .catch((e) => {
          console.log("URL reation error:");
          console.log(e);
        });
    })
    .catch(function (error) {
      let msg = `formSubmitted Error: failed to create room: ${error}`;
      console.log(msg);
      sendWebexMessage(process.env.ERROR_ROOM_ID, msg);
    });
}

export default webex;

export {
  sendWebexMessage,
  sendIntroSpaceMessage,
  sendMainCard,
  createWebexMembership,
  botSetup,
  createRoom,
};
