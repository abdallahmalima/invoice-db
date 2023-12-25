import { collection, getDocs } from "firebase/firestore";
import  EmailTemplate  from "../../../demo/components/email-template";
import { Resend } from 'resend';
import { FIRESTORE_DB } from "../../../firebase.config";
import { initAdmin } from "../../../firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";

export const maxDuration = 10; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request: Request) {

  const today = new Date();
// Check if today is Monday (1 corresponds to Monday)
if (today.getDay() !== 1) {
  return new Response("Today is Not Monday!")
}

  await initAdmin();
 
  const clients:any =await loadLastWeekClients()
  const emails:any =await loadReportEmails()
  const totalPayments:any = clients.reduce((totalPayments:number, client:any) => totalPayments + client.payment, 0);

      // to: emails,
      //to: ['abdallahantony55.aa@gmail.com'],
      try {
        const data = await resend.emails.send({
          from: 'Joshmal Hotels <promo@jasmai.design>',
          to: emails,
          subject: 'Sales Report',
          react: EmailTemplate({ totalPayments,
            numberOfClients:clients.length,
            whenDay:'Last Week' }),
        });
    
        console.log("yesss")
      } catch (error) {
        console.log(error)
      }

  
  
 
  return new Response("done")
}


export const loadLastWeekClients = async () => {
  const firestore = getFirestore();
  const productRef = await firestore.collection('products').get();

  const products: any = [];

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7); // Change to -6 if you want the last 6 days

  const querySnapshot = productRef.docs;
  querySnapshot.forEach((doc) => {
    const productData = doc.data();
    const checkInDate = productData.check_in?.toDate(); // Assuming check_in is a Firestore Timestamp

    // Check if check_in is within the last week
    if (checkInDate && checkInDate >= lastWeek) {
      products.push({
        id: doc.id,
        ...productData,
      });
    }
  });

  return products;
};


export const loadReportEmails = async () => {
  const firestore = getFirestore();
  const productRef = await firestore.collection( 'report_emails').get();

  const products:any = [];
 
  
  const querySnapshot = productRef.docs;
  querySnapshot.forEach((doc) => {
    const productData = doc.data();
   
      products.push({
        id: doc.id,
        ...productData
      });
    
  });

  return products.map((product:any)=>product.email);
};
