import https from "https";
export default function handler(req: any, res: any) {

    // smsService.js


const api_key = "11fec7e975d60b7f";
const secret_key = "NDhmZTg0OWQ1ZGZlYzA0NTAxMmI4MDYxM2FmNDMwNzljYzc1ZmFlYTEyMDMxYWQ3NTY1ZjQwZDBkNDY1Yzc5Yg==";
const content_type = "application/json";
const source_addr = "+255676393918";

// Function to encode credentials using Buffer in Node.js
const encodeCredentials = () => {
  const credentials = `${api_key}:${secret_key}`;
  return Buffer.from(credentials).toString("base64");
};

 const sendSms = async () => {
  try {
    const response = await fetch("https://apisms.beem.africa/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": content_type,
        Authorization: "Basic " + encodeCredentials(),
      },
      agent: new https.Agent({
        rejectUnauthorized: false,
      }),
      body: JSON.stringify({
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
      }),
    });

    const data = await response.json();

    console.log(data, api_key + ":" + secret_key);
  } catch (error) {
    console.error(error);
  }
};

sendSms()


    res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'Fake Upload Process' });
}
