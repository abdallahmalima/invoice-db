import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../../firebase.config";


const AuthContext = createContext(0);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // const googleSignIn = () => {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider);
  // };

  // const logOut = () => {
  //   signOut(auth);
  // };

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser:any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};