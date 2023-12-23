"use server"

import { getAuth } from "firebase/auth";
import { initAdmin } from "../firebaseAdmin";



export const deleteUser= async (formData:any)=>{
    console.log("tryyyyyyyyyyyyyyyyyyyyyyy")
    await initAdmin();

 const uid= formData.uid
 getAuth()
  .deleteUser(uid)
  .then(() => {
    console.log('Successfully deleted user');
  })
  .catch((error) => {
    console.log('Error deleting user:', error);
  });
}