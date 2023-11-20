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
                products.push({
                  id:doc.id,
                  ...doc.data()
                })
                
              })
              setIsLoading(false)
                setProducts(products)
            }
          })

          return subscriber
    }

    return [isLoading,products,setProducts]
}