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
}