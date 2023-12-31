import { collection, getDocs } from "firebase/firestore";
import  EmailTemplate  from "../../../demo/components/email-template";
import { Resend } from 'resend';
import { FIRESTORE_DB } from "../../../firebase.config";
import { initAdmin } from "../../../firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import { getReportEmails, isDevelopment, isLocalhost } from "../../../demo/lib/env";

export const maxDuration = 10; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request: Request) {

  await initAdmin();
 
  const clients:any =await loadLastDayClients()
  const emails:any =await loadReportEmails()
  const totalPayments:any = clients.reduce((totalPayments:number, client:any) => totalPayments + client.payment, 0);

  let reportEmails=getReportEmails(emails)

      try {
        const data = await resend.emails.send({
          from: 'Joshmal Hotels <promo@jasmai.design>',
          to:reportEmails,
          subject: 'Sales Report',
          react: EmailTemplate({ totalPayments,numberOfClients:clients.length, whenDay:'Yesterday' }),
        });
    
        console.log("yesss")
      } catch (error) {
        console.log(error)
      }

  
  
  return new Response("Done")
}


export const loadLastDayClients = async () => {
  const firestore = getFirestore();
  const productRef = await firestore.collection( 'products').get();

  const products:any = [];
 
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(yesterday.getHours() + 3);
  const querySnapshot = productRef.docs;
  querySnapshot.forEach((doc) => {
   
    // Assuming check_in is a Firestore Timestamp
    const check_in = doc.data().check_in?.toDate();
    const check_out = doc.data().check_out?.toDate();
    const createdAt = doc.data().createdAt?.toDate();
    products.push({
      id: doc.id,
      ...doc.data(),
      check_in,
      check_out,
      createdAt,
    });
    
  });

  return products .filter(payment => {
    const paymentDate = payment.check_in;
    paymentDate.setHours(paymentDate.getHours() + 3);
    return (
      paymentDate.getFullYear() === yesterday.getFullYear() &&
      paymentDate.getMonth() === yesterday.getMonth()       &&
      paymentDate.getDate() === yesterday.getDate()
    );
  });
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
