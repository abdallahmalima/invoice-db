import { EmailTemplate } from "../../../demo/components/email-template";
import { Resend } from 'resend';

export const maxDuration = 10; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(request: Request) {
  const {email} = await request.json();


  
      try {
        const data = await resend.emails.send({
          from: 'WebXite <promo@jasmai.design>',
          to: [email],
          subject: 'Hello '+ 'Malima',
          react: EmailTemplate({ firstName: "Malima" }),
        });
    
        console.log("yesss")
      } catch (error) {
        console.log(error)
      }

  
  


 
  return new Response('Yessss')
}
