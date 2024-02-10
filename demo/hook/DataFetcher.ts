import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebase.config";
import { Demo } from "../../types/demo";
import { ProgressSpinner } from 'primereact/progressspinner';
import { isDevelopment, isProduction } from "../lib/env";
import getCurrentWeekMondayAndSunday, { getCurrentWeekMondayAndSundayClient } from "../lib/calc";

        

export const  useClients=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [products, setProducts] = useState<Demo.Product[]>([]);

    useEffect(() => {
        const unsubscribe=loadProducts()

          return ()=>{unsubscribe()}
    }, []);

    const loadProducts=()=>{
        setIsLoading(true)
        const productRef = collection(FIRESTORE_DB, 'products');
        const q = query(
          productRef,
          orderBy('createdAt', 'desc'),
        );
      
        const subscriber=onSnapshot(q,{
            next:(snapshot)=>{
              const products:any=[];
              snapshot.docs.forEach((doc)=>{
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
                
              })
              
              setIsLoading(false)
                setProducts(products)
            }
          })

          return subscriber
    }

    return [
            isLoading,
            setIsLoading,
            products,
            setProducts,
            loadProducts
          ]
}

export const  useClientsWeekly=()=>{
  const [isLoadingWeekly,setIsLoadingWeekly]=useState(false)
  const [productsWeekly, setProductsWeekly] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProductsWeekly()

        return ()=>{unsubscribe()}
  }, []);

  const loadProductsWeekly=()=>{
      setIsLoadingWeekly(true)
      const {  currentWeekMonday, currentWeekSunday } = getCurrentWeekMondayAndSundayClient();
     console.log({"currentWeekMonday":"---"+currentWeekMonday,currentWeekSunday:"---"+currentWeekSunday})
      const productRef = collection(FIRESTORE_DB, 'products');
   
  
       let q = query(productRef);

       q = query(q, where('check_in', '>=', currentWeekMonday));
       q = query(q, where('check_in', '<=', currentWeekSunday));
       q = query(q, orderBy('check_in'));
    
      const subscriber=onSnapshot(q,{
          next:(snapshot)=>{
            const products:any=[];
            snapshot.docs.forEach((doc)=>{
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
              
            })
            
            setIsLoadingWeekly(false)
              setProductsWeekly(products)
          }
        })

        return subscriber
  }

  return [
          isLoadingWeekly,
          setIsLoadingWeekly,
          productsWeekly,
          setProductsWeekly,
          loadProductsWeekly
        ]
}

export const  useClientRooms=()=>{
  const [isLoading,setIsLoading]=useState(false)
  const [products, setProducts] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProducts()

        return ()=>{unsubscribe()}
  }, []);

  const loadProducts=()=>{
      setIsLoading(true)
      const productRef = collection(FIRESTORE_DB, 'rooms');
      const q = query(
        productRef,
        orderBy('room_no', 'asc'),
      );
    
      const subscriber=onSnapshot(q,{
          next:(snapshot)=>{
            const products:any=[];
            snapshot.docs.forEach((doc)=>{
              const createdAt=doc.data().createdAt?.toDate()
              products.push({
                id:doc.id,
                ...doc.data(),
                createdAt,
              })
              
            })
            
            setIsLoading(false)
              setProducts(products)
          }
        })

        return subscriber
  }

  return [
          isLoading,
          setIsLoading,
          products,
          setProducts,
          loadProducts
        ]
}

export const  useUsers=()=>{
  const [isLoading,setIsLoading]=useState(false)
  const [products, setProducts] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProducts()

        return ()=>{unsubscribe()}
  }, []);

  const loadProducts=()=>{
      setIsLoading(true)
      const productRef = collection(FIRESTORE_DB, 'users');
      const q = query(
        productRef,
        orderBy('f_name', 'asc'),
      );
    
      const subscriber=onSnapshot(q,{
          next:(snapshot)=>{
            const products:any=[];
            snapshot.docs.forEach((doc)=>{
              const createdAt=doc.data().createdAt?.toDate()
              products.push({
                id:doc.id,
                ...doc.data(),
                createdAt,
              })
              
            })
            
              setIsLoading(false)
              setProducts(products)
          }
        })

        return subscriber
  }

  return [
          isLoading,
          setIsLoading,
          products,
          setProducts,
          loadProducts
        ]
}

export const useUser = (id = null) => {
  console.log("Userrrrrrrrrrrrrrrrrrr", id);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const loadUser = async () => {
      setIsLoadingUser(true);
      let userData = null;

      if (id) {
        const docRef = doc(FIRESTORE_DB, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          userData = {
            id: docSnap.id,
            ...docSnap.data(),
          };
        }
      }

      setIsLoadingUser(false);
      setUser(userData);
    };

    loadUser();
  }, [id]);

  return [isLoadingUser, setIsLoadingUser, user, setUser];
};

export const  useClientsForReports=(start_date,end_date,isCurrentUser)=>{
  const [isLoading,setIsLoading]=useState(true)
  const [products, setProducts] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProducts()

        return ()=>{
          unsubscribe()
        }
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    const productRef = collection(FIRESTORE_DB, 'products');
    console.log(start_date, end_date);
  
    let q = query(productRef);
  
    if (start_date) {
      const date = new Date(start_date);
      date.setHours(0, 0, 0, 0);
      console.log("start date",date )
      q = query(q, where('check_in', '>=', date));
    }
  
    if (end_date) {
      // Adjust end_date to include the full day
      const date = new Date(end_date);
      date.setHours(0, 0, 0, 0);
      console.log("end date",date )
      q = query(q, where('check_in', '<=', date));
    }

    if (isCurrentUser) {
      if(isCurrentUser.length>0){
        q = query(q,where("createdBy", "==", isCurrentUser));
      }
     
    }
    
    q = query(q, orderBy('check_in'));
    
    const subscriber = onSnapshot(q, {
      next: (snapshot) => {
        const products = [];
        snapshot.docs.forEach((doc) => {
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
         
        console.log(products);
        setIsLoading(false);
        setProducts(products);
      },
    });
  
    return subscriber;
  };
  

  return [
          isLoading,
          setIsLoading,
          products,
          setProducts,
          loadProducts
        ]
}

export const  useClientsForRoomReports=(start_date,end_date,isCurrentUser)=>{
  const [isLoading,setIsLoading]=useState(true)
  const [products, setProducts] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProducts()

        return ()=>{
          unsubscribe.subscriber()
          unsubscribe.subscriberr()
        }
  }, []);

  const loadProducts = () => {
    setIsLoading(true);
    const productRef = collection(FIRESTORE_DB, 'products');
    
  
    const yesterday = new Date(start_date);
   
  
  // if(isProduction()|| isDevelopment()){
  //   yesterday.setHours(yesterday.getHours() + 3);
  // }

  const productReff = collection(FIRESTORE_DB, 'rooms');
  const q = query(
    productReff,
    orderBy('room_no', 'asc'),
  );

  const all_rooms:any=[];
  const subscriberr=onSnapshot(q,{
      next:(snapshot)=>{
        
        snapshot.docs.forEach((doc)=>{
          const createdAt=doc.data().createdAt?.toDate()
          all_rooms.push({
            id:doc.id,
            ...doc.data(),
            createdAt,
          })
          
        })
        
       
      }
    })



    
    const subscriber = onSnapshot(productRef, {
      next: (snapshot) => {
        const products = [];
        snapshot.docs.forEach((doc) => {
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


        const rooms_used= products.filter(payment => {
          const paymentDate = payment.check_out;
          const checkInDate = payment.check_in;
      
          // if(isProduction()|| isDevelopment()){
          //   paymentDate.setHours(paymentDate.getHours() + 3);
          //   checkInDate.setHours(checkInDate.getHours() + 3);
          //   //hello
          // }
      
          return (
            paymentDate.getFullYear() > yesterday.getFullYear() ||
            paymentDate.getFullYear() == yesterday.getFullYear() && paymentDate.getMonth() > yesterday.getMonth() ||
            paymentDate.getFullYear() == yesterday.getFullYear() && paymentDate.getMonth() == yesterday.getMonth() && (paymentDate.getDate() > yesterday.getDate() && checkInDate.getDate()<=yesterday.getDate())
            ||(paymentDate.getDate() == yesterday.getDate() && checkInDate.getDate()==yesterday.getDate())
          );
        })
  
        
        const rooms = rooms_used.map(room=>{
        const cur_room=all_rooms.find(roomm=>roomm.room_no==room.room_no)
          return {
            room_no:room.room_no,
            room_type:cur_room?.room_type?.name,
            price:room.payment,
            price_min:cur_room?.payment_min,
            price_max:cur_room?.payment,
            date:new Date(yesterday).toLocaleDateString('sw-TZ'),
            user:room.createdByName,

          }
        })
        console.log("malimaaaaaaaaaaaaaaa",rooms);
        setIsLoading(false);
        setProducts(rooms);
      },
    });
  
    return {subscriber,subscriberr};
  };
  

  return [
          isLoading,
          setIsLoading,
          products,
          setProducts,
          loadProducts
        ]
}


export const  useRooms=()=>{
  const [isLoadingRoom,setIsLoadingRoom]=useState(false)
  const [rooms, setRooms] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadRooms()

        return ()=>{unsubscribe()}
  }, []);

  const loadRooms=()=>{
      setIsLoadingRoom(true)
      const productRef=collection(FIRESTORE_DB,'room_types')
      const subscriber=onSnapshot(productRef,{
          next:(snapshot)=>{
            const products:any=[];
            snapshot.docs.forEach((doc)=>{
              
              products.push({
                id:doc.id,
                ...doc.data(),
              })
              
            })
            console.log(products)
              setIsLoadingRoom(false)
              setRooms(products)
          }
        })

        return subscriber
  }

  return [
          isLoadingRoom,
          setIsLoadingRoom,
          rooms,
          setRooms,
          loadRooms,
        ]
}