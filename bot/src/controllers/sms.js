/* IMPORTS */
import axios from "axios";
import { config } from "dotenv";
config();

/* FUNCTIONS */

function sendLinkViaSMS(phone, meetingLink, notes, incident_id) {
  let msg = "";
  if (incident_id != "") {
    msg += `Incident ID: ${incident_id} \n`;
  }
  if (notes != "") {
    msg += `Additional Notes: ${notes}  \n`;
  }

  msg += `Your meeting link: ${meetingLink}\n\n`;

  const body = { number: phone, url: msg };

  axios
    .post(process.env.SMS_URL, body)
    .then((response) => {
      console.log("SMS sent succesfully:", response.data);
    })
    .catch((e) => {
      console.log("SMS Send error:");
      console.log(e);
    });
}

export { sendLinkViaSMS };
