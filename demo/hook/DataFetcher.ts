import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIRESTORE_DB } from "../../firebase.config";
import { Demo } from "../../types/demo";

export const  useClients=()=>{
    const [isLoading,setIsLoading]=useState(false)
    const [products, setProducts] = useState<Demo.Product[]>([]);

    useEffect(() => {
        const unsubscribe=loadProducts()

          return ()=>{unsubscribe()}
    }, []);

    const loadProducts=()=>{
        setIsLoading(true)
        const productRef=collection(FIRESTORE_DB,'products')
        const subscriber=onSnapshot(productRef,{
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
              console.log(products)
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
<<<<<<< HEAD
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
=======
>>>>>>> 5985b220a6bc2df5bb5c310cde96f6a1a39ae6a4
}