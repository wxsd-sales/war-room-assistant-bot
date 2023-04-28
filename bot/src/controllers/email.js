/* IMPORTS */

import axios from "axios";
import { config } from "dotenv";
config();

import { getDateTime } from "../utils/general.js";

/* FUNCTIONS */

function sendLinkViaEmail(email, meetingLink, notes, subject, incident_id) {
  let msg = "";
  if (incident_id != "") {
    msg += `Incident ID: ${incident_id} <br>`;
  }
  if (notes != "") {
    msg += `Additional Notes: ${notes}  <br>`;
  }
  msg += `Your meeting link: ${meetingLink} <br>`;
  subject = subject + " " + getDateTime();

  const body = { to: email, message: msg, subject: subject };

  axios
    .post(process.env.EMAIL_URL, body)
    .then((response) => {
      console.log("Email sent succesfully:", response.data);
    })
    .catch((e) => {
      console.log("EMAIL Send error:");
      console.log(e);
    });
}

export { sendLinkViaEmail };
