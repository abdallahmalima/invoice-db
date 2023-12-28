import { collection, getDocs } from "firebase/firestore";
import  EmailTemplate  from "../../../demo/components/email-template";
import { Resend } from 'resend';
import { FIRESTORE_DB } from "../../../firebase.config";
import { initAdmin } from "../../../firebaseAdmin";
import { getFirestore } from "firebase-admin/firestore";
import EmailTemplateBussinessStatus from "../../../demo/components/email-template-bussiness-status";
import { calculateSalesDifference, getTotalSalesLastWeekDataset, getTotalSalesThisWeekDataset } from "../../../demo/lib/calc";
import { useClients } from "../../../demo/hook/DataFetcher";

export const maxDuration = 10; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


const resend = new Resend(process.env.RESEND_API_KEY);


export async function GET(request: Request) {

//   const today = new Date();
// // Check if today is Monday (1 corresponds to Monday)
// if (today.getDay() !== 1) {
//   return new Response("Today is Not Monday!")
// }

  await initAdmin();
 
  const products:any =await allClients()
  const emails:any =await loadReportEmails()
 
 const weeklyPaymentsDataset= getTotalSalesLastWeekDataset(products)
 const thisweeklyPaymentsDataset=getTotalSalesThisWeekDataset(products)

 const {
  salesDifference,
  percentageChange,
  status,
  totalLastWeekSales,
  totalThisWeekSales,
}= calculateSalesDifference(weeklyPaymentsDataset,thisweeklyPaymentsDataset)

const positivePercentageChange = Math.abs(percentageChange);

  if (positivePercentageChange < 30) {
     return new Response("Today is Not Monday!")
   }




      // to: emails,
      //to: ['abdallahantony55.aa@gmail.com'],
      try {
        const data = await resend.emails.send({
          from: 'Joshmal Hotels <promo@jasmai.design>',
          to: ['abdallahantony55.aa@gmail.com'],
          subject: 'Alert: Business Performance Update 🚀🎉💼',
          react: EmailTemplateBussinessStatus({
            salesDifference,
            positivePercentageChange,
            status,
            totalLastWeekSales,
            totalThisWeekSales,
          }),
        });
        console.log("yesss")
      } catch (error) {
        console.log(error)
      }

  
  
 
  return new Response("done")
}


export const allClients = async () => {
  const firestore = getFirestore();
  const productRef = await firestore.collection('products').get();

  const products: any = [];

 ; // Change to -6 if you want the last 6 days

  const querySnapshot = productRef.docs;
  querySnapshot.forEach((doc) => {
    const check_in=doc.data().check_in?.toDate()
    const check_out=doc.data().check_out?.toDate()
    const createdAt=doc.data().createdAt?.toDate()
    products.push({
      id:doc.id,
      ...doc.data(),
      check_in,
      check_out,
      createdAt,
    })
    
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
