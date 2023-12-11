import React, { useEffect } from 'react';
import {FIRESTORE_DB,FIREBASE_AUTH}  from "../../firebase.config";
import { useRouter } from 'next/navigation';

const AuthCheck = () => {
    const router=useRouter()
    useEffect(() => {
        console.log("hellooooooooooooooooooooo")
      // const user= FIREBASE_AUTH.currentUser

      //  if (!user) {
      //   router.push('/auth/login');
      // }

        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            // Set loading to false once the authentication status is determined
           console.log("mimiiiii")
            if (!user) {
              router.push('/auth/login');
            }
          });
        return unsubscribe()
    }, []);
    return (
        <div>
            
        </div>
    );
};

export default AuthCheck;