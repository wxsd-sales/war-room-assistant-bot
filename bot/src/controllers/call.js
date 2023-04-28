/* IMPORTS */

import axios from "axios";
import { config } from "dotenv";
config();

/* FUNCTIONS */

function placeCall(phone, voice_message) {
  phone = "1" + phone;
  let imi_data = { phone_number: phone, message: voice_message };

  axios
    .post(process.env.IMI_PHONE_URL, imi_data)
    .then((response) => {
      console.log("imi init flow launched with data:", response.data);
    })
    .catch((e) => {
      console.log("IMI Send error:");
      console.log(e);
    });
}

export { placeCall };
