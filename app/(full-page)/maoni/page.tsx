'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { NodeRef } from '../../../types/types';
import { classNames } from 'primereact/utils';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { useRouter } from 'next/navigation';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { addDoc, collection, doc, updateDoc,onSnapshot, deleteDoc, where, query } from "firebase/firestore";
import {FIRESTORE_DB,FIREBASE_AUTH}  from "../../../firebase.config";
import { sendClientSms } from '../../../actions/server';
import useHostName from '../../../demo/hook/hostname';

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const toast = useRef<Toast>(null);
    const { url } =useHostName();

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };


    const [comment, setComment] = useState({
        name:'',
        phone:'',
        email:'',
        message:'',
    });

    const [checked, setChecked] = useState(false);
    const [email, setEmail] = useState('');

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleLogin=async ()=>{
       console.log(comment)
       const doc=await addDoc(collection(FIRESTORE_DB,'comments'),{
        name:comment.name,
        phone:comment.phone,
        email:comment.email,
        message:comment.message,
     })
     
     // sendClientSms(formData)

     let urlSms = `${url}/api/sms`;
     let urlEmail = `${url}/api/email`;

     
     // Create the data to be sent in the request body (in JSON format)
     
    
       const responsePhone = await fetch(urlSms, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json' 
         },
         body: JSON.stringify({
            phone:comment.phone,
            email:comment.email,
        }) 
       });

    //    const responseEmail = await fetch(urlEmail, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json' 
    //     },
    //     body: JSON.stringify({email:comment.email}) 
    //   });

     setComment({
        name:'',
        phone:'',
        email:'',
        message:'',
    });
     
     toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Maoni Yako Yametumwa, Ahsante!', life: 3000 });
        
       }

       const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product:any = { ...comment };
        _product[`${name}`] = val;

        setComment(_product);
    };



    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
              

                <div
                    id="hero"
                    className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
                    style={{
                        background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)',
                        clipPath: 'ellipse(150% 87% at 93% 13%)'
                    }}
                >
                    <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                        <h1 className="text-6xl font-bold text-gray-900 line-height-2">
                            <span className="font-light block">Ndugu Mteja,Karibu SamakiSamaki Toa Maoni</span>
                        </h1>
                        <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Tunathamini maoni yako Kwani ndio msingi wa kuborsha huduma zetu</p>
                      
                    </div>
                    <div className="flex justify-content-center pt-6">
                   
                  
                        <div className="flex  align-items-center justify-content-center">
                       
                            <div
                                style={{
                                    borderRadius: '56px',
                                    padding: '0.3rem',
                                    background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                                }}
                            >
                                 <Toast ref={toast} />
                                <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                                    <div className="text-center mb-5">
                                        <div className="text-900 text-3xl font-medium mb-3">Andika Maoni Yako Hapa</div>
                                       
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                                            Jina Kamili
                                        </label>
                                        <InputText id="name" value={comment.name} onChange={(e) => onInputChange(e, 'name')}  type="text" placeholder="Andika Jina" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                                        <label htmlFor="phone" className="block text-900 text-xl font-medium mb-2">
                                            Namba Ya Simu
                                        </label>
                                        <InputText id="phone" value={comment.phone} onChange={(e) => onInputChange(e, 'phone')}  type="text" placeholder="Andika Namba Ya Simu" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                            Email(Sio lazima)
                                        </label>
                                        <InputText id="email" value={comment.email} onChange={(e) => onInputChange(e, 'email')}  type="text" placeholder="Andika Email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                                         
                                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                            Maoni
                                        </label>
                                        <InputTextarea value={comment.message} onChange={(e) => onInputChange(e, 'message')} placeholder="Andika Maoni"  rows={5} cols={30} className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                      
                                        <Button label="Tuma Maoni" className="w-3 p-3 text-xl" onClick={handleLogin}></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
            
        </div>

                    </div>
                </div>

              
            </div>
        
    );
};

export default LandingPage;
