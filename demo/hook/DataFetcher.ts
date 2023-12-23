import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
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
}

export const  useClientsForReports=(start_date,end_date)=>{
  const [isLoading,setIsLoading]=useState(false)
  const [products, setProducts] = useState<Demo.Product[]>([]);

  useEffect(() => {
      const unsubscribe=loadProducts()

        return ()=>{unsubscribe()}
  }, []);

  const loadProducts=()=>{
      setIsLoading(true)
      const productRef=collection(FIRESTORE_DB,'products')
      console.log(start_date,end_date)
      const date=new Date(end_date) 
      const my_end_date=date.setDate(date.getDate()+1)

      let q = query(productRef);

      if (start_date) {
        q=query(productRef,where('check_in', '>=', new Date(start_date)));
      }
      
      if (my_end_date) {
        q=query(productRef,where('check_in', '<=', new Date(my_end_date)));
      }
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