const axios = require("axios");
const https = require("https");


const api_key = "11fec7e975d60b7f";
const secret_key = "NDhmZTg0OWQ1ZGZlYzA0NTAxMmI4MDYxM2FmNDMwNzljYzc1ZmFlYTEyMDMxYWQ3NTY1ZjQwZDBkNDY1Yzc5Yg==";
const content_type = "application/json";
const source_addr = "+255676393918";

function send_sms() {
  axios
    .post(
      "https://apisms.beem.africa/v1/send",
      {
        source_addr: source_addr,
        schedule_time: "",
        encoding: 0,
        message: "Hello World",
        recipients: [
            {
                recipient_id: 1,
                dest_addr: "255677024584",
              },
        //   {
        //     recipient_id: 2,
        //     dest_addr: "255700000002",
        //   },
        ],
      },
      {
        headers: {
          "Content-Type": content_type,
          Authorization: "Basic " + btoa(api_key + ":" + secret_key),
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }
    )
    .then((response) => console.log(response, api_key + ":" + secret_key))
    .catch((error) => console.error(error.response.data));
}

