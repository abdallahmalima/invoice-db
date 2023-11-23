import { EmailTemplate } from "../../../demo/components/email-template";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request: Request) {



  
      try {
        const data = await resend.emails.send({
          from: 'WebXite <promo@jasmai.design>',
          to: ["abdallahantony55.aa@gmail.com"],
          subject: 'Hello '+ 'Malima',
          react: EmailTemplate({ firstName: "Malima" }),
        });
    
        
      } catch (error) {
        console.log(error)
      }

  
  


 
  return new Response('Yessss')
}
