import { EmailTemplate } from "../../../demo/components/emails/email-template";
import { Resend } from 'resend';

export const maxDuration = 10; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function GET(request: Request) {
//   //const {phone,email} = await request.json();
//     // smsService.js
    

//     const api_key = process.env.NEXT_SMS_API_KEY;
//     const secret_key = process.env.NEXT_SMS_API_SECRET;
//     const content_type = "application/json";
//     const source_addr = "JASMAI";
    
//     // Function to encode credentials using Buffer in Node.js
//     const encodeCredentials = () => {
//       const credentials = `${api_key}:${secret_key}`;
//       return Buffer.from(credentials).toString("base64");
//     };
    
    
//       try {
//         const response = await fetch("https://apisms.beem.africa/v1/send", {
//           method: "POST",
//           headers: {
//             "Content-Type": content_type,
//             Authorization: "Basic " + encodeCredentials(),
//           },
         
//           body: JSON.stringify({
//             source_addr: source_addr,
//             schedule_time: "",
//             encoding: 0,
//             message: "Ndugu mteja, Joshmal Hotel tunashukuru kwa maoni yako",
//             recipients: [
//               {
//                 recipient_id: 1,
//                 dest_addr: "255758453701",
//               },
//             //   {
//             //     recipient_id: 2,
//             //     dest_addr: "255700000002",
//             //   },
//             ],
//           }),
//         });
    
//         const data = await response.json();
    
//         console.log(data, api_key + ":" + secret_key);
//       } catch (error) {
//         console.error(error);
       
//       }

//       // try {
//       //   const data = await resend.emails.send({
//       //     from: 'Joshmal Hotels <promo@jasmai.design>',
//       //     to: [email],
//       //     subject: 'Ahsante Mteja!',
//       //     react: EmailTemplate({ firstName: "Malima" }),
//       //   });
    
//       //   console.log("yesss")
//       // } catch (error) {
//       //   console.log(error)
//       // }
  

//     return new Response('Hello, Next.js!')

// }
 

 
 
export async function GET(request: Request) {

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sms1="Hi Selena Hotels,\n\nYour balance for invoice no. 234 is 2,500,000 TZS. The invoice due date will be May 31, 2024.\n\nThank you for your loyalty.\n(Tribute Tanzania Ltd)"
const sms2="Hi Selena Hotels,\n\nThis is a reminder to settle the outstanding balance for invoice no. 234, which amounts to 2,500,000 TZS. The invoice is overdue, with a due date of May 31, 2024.\n\nThank you for your loyalty.(Tribute Tanzania Ltd)"

client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: sms1,
         to: 'whatsapp:+255676393918'
       })
      .then(message => console.log(message.sid));

      return new Response('Hello, Next.js!'+accountSid+" : "+authToken)
}
 
export async function DELETE(request: Request) {}
 
export async function PATCH(request: Request) {}
 
// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {}