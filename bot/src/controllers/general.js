/* IMPORTS */

import { config } from "dotenv";
config();

import mongoClient, { mongoDB, typeCol, collectionType } from "../utils/db.js";

import { getDateTime } from "../utils/general.js";

import { createRoom, sendWebexMessage } from "../controllers/webex.js";

import { sendLinkViaSMS } from "../controllers/sms.js";

import { sendLinkViaEmail } from "../controllers/email.js";

import { placeCall } from "../controllers/call.js";

/* FUNCTIONS */

async function formSubmitted(actorId, inputs) {
  console.log("formSubmitted");
  console.log(inputs);

  let title;
  try {
    let cursor = await mongoClient
      .db(mongoDB)
      .collection(collectionType)
      .aggregate([{ $match: { personID: actorId } }]);
    let doc;
    if (await cursor.hasNext()) {
      doc = await cursor.next();
      console.log("doc:");
      console.log(doc);
      if (inputs.incident_id != "") {
        title =
          inputs.incident_id +
          " - " +
          inputs.scenario_type +
          " " +
          getDateTime();
      } else {
        title = inputs.scenario_type + " " + getDateTime();
      }
      let roomPayload = { title: title };
      if ([null, undefined, ""].indexOf(doc.teamID) < 0) {
        roomPayload["teamId"] = doc.teamID;
      }

      createRoom({ actorId, inputs, doc, roomPayload });
    } else {
      let defaultCursor = await mongoClient
        .db(mongoDB)
        .collection(collectionType)
        .aggregate([{ $match: { personID: "default" } }]);
      if (await defaultCursor.hasNext()) {
        doc = await defaultCursor.next();
        console.log("doc:");
        console.log(doc);
        if (inputs.incident_id != "") {
          title =
            inputs.incident_id +
            " - " +
            inputs.scenario_type +
            " " +
            getDateTime();
        } else {
          title = inputs.scenario_type + " " + getDateTime();
        }
        let roomPayload = { title: title };
        if ([null, undefined, ""].indexOf(doc.teamID) < 0) {
          roomPayload["teamId"] = doc.teamID;
        }

        createRoom({ actorId, inputs, doc, roomPayload });
      }
    }
  } catch (error) {
    console.log("Form Submitted error:", error);
  }
}

function notifyLink(doc, meetingLink, inputs, default_space_message) {
  try {
    console.log("inputs in notification", inputs);
    console.log("docs in notify", doc);

    for (let i = 0; i < doc.scenarioList.length; i++) {
      if (doc.scenarioList[i].scenario == inputs.scenario_type) {
        console.log("scenario now", doc.scenarioList[i].scenario);
        if (doc.scenarioList[i].sms) {
          for (let i = 0; i < doc.memberList.length; i++) {
            sendLinkViaSMS(
              doc.memberList[i].number,
              meetingLink,
              inputs.notes,
              inputs.incident_id
            );
          }
        }
        if (doc.scenarioList[i].call) {
          let voice_message =
            "Hello, there is a IT Major Incident. Please review your SMS or Email immediately for Incident Response conference bridge details";
          for (let i = 0; i < doc.memberList.length; i++) {
            placeCall(doc.memberList[i].number, voice_message);
          }
        }
        if (doc.scenarioList[i].email) {
          let email_subject = inputs.scenario_type;
          for (let i = 0; i < doc.memberList.length; i++) {
            sendLinkViaEmail(
              doc.memberList[i].email,
              meetingLink,
              inputs.notes,
              email_subject,
              inputs.incident_id
            );
          }
        }
      }
    }
    //   console.log("LicensedLink", meetingLink);
    //
    // }
  } catch (error) {
    console.log("Notify link error:", error);
  }
}

export { formSubmitted, notifyLink };
