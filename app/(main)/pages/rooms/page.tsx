'use client'

/* eslint-disable @next/next/no-img-element */

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import { addDoc, collection, doc, updateDoc, onSnapshot, deleteDoc, where, query, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../../firebase.config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { uuid as uuidv4 } from 'uuidv4';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useClientRooms ,useRooms, useUser } from '../../../../demo/hook/DataFetcher';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import LoadingSpinner from '../../../../demo/components/LoadingSpinner';
import { ScrollTop } from 'primereact/scrolltop';
import { UserAuth } from '../../../../demo/components/context/AuthContext';
import ReactPDF, { PDFDownloadLink } from '@react-pdf/renderer';
import MyDocument from '../../../../demo/components/MyDocument';
import { useRouter } from 'next/navigation';
import { getCheckInDateRange } from '../../../../demo/lib/date';
import { setConstantValue } from 'typescript';
import { capitalizeFirstLetter } from '../../../../demo/lib/strings';
import { Checkbox } from 'primereact/checkbox';





const Product = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        image: '',
        description: '',
        category: '',
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };
    const [productImage, setProductImage] = useState<File | null>(null);
    // const [products, setProducts] = useState<Demo.Product[]>([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState<Demo.Product[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Demo.Product[]>>(null);
    const fileUploadRef = useRef<FileUpload>(null);
    const [currentUser, setCurrentUser] = useState(false);

    const [usageInputFields, setUsageInputFields] = useState<any>([])
    const [diseaseInputFields, setDiseaseInputFields] = useState<any>([])
    // const [isLoading,setIsLoading]=useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

    const [isLoading, setIsLoading, products, setProducts, loadProducts] = useClientRooms()
    const [
        isLoadingUser,
        setIsLoadingUser,
        user,
        setUser,
      ]=useUser(FIREBASE_AUTH.currentUser?.uid)
      console.log("",user)

    const [isLoadingRoom, setIsLoadingRoom, rooms, setRooms] = useRooms()

   const router=useRouter()


   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [calenderChangedByUser, setCalenderChangedByUser] = useState(false);
   const { lowestCheckIn, highestCheckIn } = getCheckInDateRange(products);
 
   
   useEffect(()=>{

    if(lowestCheckIn && highestCheckIn && !calenderChangedByUser){
        setStartDate(lowestCheckIn?.toLocaleDateString("en-US"))
        setEndDate(highestCheckIn?.toLocaleDateString("en-US"))
    }

   },[lowestCheckIn, highestCheckIn])

   useEffect(()=>{
   
    if(!startDate){
        setStartDate(lowestCheckIn?.toLocaleDateString("en-US"))
    }

    if(!endDate){
        setEndDate(highestCheckIn?.toLocaleDateString("en-US"))
    }


   },[startDate,endDate])
   
console.log(lowestCheckIn?.toLocaleDateString("en-US"), highestCheckIn?.toLocaleDateString("en-US"))
    

const onCurrentUserChange=()=>{
setCurrentUser(()=>!currentUser)
}


    const dropdownValues: InputValue[] = [
        { name: 'Single', code: '111' },
        { name: 'Double', code: '222' },
        { name: 'Twin Bed', code: '333' },
        { name: 'Executive', code: '444' },
    ];


    const addUsageInputField = () => {
        setUsageInputFields([...usageInputFields, {
            usage: '',
        }])

        console.log(usageInputFields)

    }

    const removeUsageInputField = (index: number) => {
        const rows = [...usageInputFields];
        rows.splice(index, 1);
        setUsageInputFields(rows);
    }

    const handleUsageInputFieldChange = (index: number, evnt: any) => {
        const { name, value } = evnt.target;
        const list: any = [...usageInputFields];
        list[index].usage = value
        setUsageInputFields(list);
    }


    const addDiseaseInputField = () => {
        setDiseaseInputFields([...diseaseInputFields, {
            disease: '',
        }])


    }

    const removeDiseaseInputField = (index: number) => {
        const rows = [...diseaseInputFields];
        rows.splice(index, 1);
        setDiseaseInputFields(rows);
    }

    const handleDiseaseInputFieldChange = (index: number, evnt: any) => {
        const { name, value } = evnt.target;
        const list: any = [...diseaseInputFields];
        list[index].disease = value
        setDiseaseInputFields(list);
    }




    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'TSH' });
    };

    const onUploadHandler = (event: any) => {
        const file = event.files[0];
        setProductImage(file);

    };

    const openNew = () => {
        setDiseaseInputFields([])
        setUsageInputFields([])
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
        
    };
    const openPrint = () => {
       
        const start_date=new Date(startDate).toLocaleDateString('sw-TZ')
        const end_date=new Date(endDate).toLocaleDateString('sw-TZ')
        const url = `/reports/rooms?start_date=${start_date}&end_date=${end_date}&user=${currentUser?FIREBASE_AUTH?.currentUser?.uid:''}`;
        window.open(url, '_blank');
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const handleSaveProduct = async (downloadURL: string) => {
        
        if (product.room_no.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                setIsLoadingSubmit(true)
                const ref = doc(FIRESTORE_DB, `rooms/${product.id}`)
                await updateDoc(ref, {
                   
                    room_no: _product.room_no,
                    payment_min: _product.payment_min,
                    payment: _product.payment,
                    room_type:_product.room_type,
                    updatedBy:FIREBASE_AUTH.currentUser?.uid,
                    updatedAt: serverTimestamp(),
                })
                loadProducts()
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Room Updated', life: 3000 });
                console.log(product.id)

            } else {
                if (true) {
                    setIsLoadingSubmit(true)
                    console.log(_product.room_type)
                    const doc = await addDoc(collection(FIRESTORE_DB, 'rooms'), {
                        room_no: _product.room_no,
                        payment_min: _product.payment_min,
                        payment: _product.payment,
                        room_type:_product.room_type,
                        createdBy:FIREBASE_AUTH.currentUser?.uid,
                        createdByName:capitalizeFirstLetter(user?.f_name)+" "+capitalizeFirstLetter(user?.l_name),
                        createdAt: serverTimestamp(),
                        

                    })
                    loadProducts()
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Room Created', life: 3000 });



                }

            }

            setProducts(_products);
            setProductDialog(false);
            setProduct(emptyProduct);
            setProductImage(null);
            setIsLoadingSubmit(false);
        }
       
        
    }


    const saveProduct = async () => {
        setSubmitted(true);
        handleSaveProduct('');

    };

    const editProduct = (product: Demo.Product) => {
        setProduct({ ...product });
        setUsageInputFields(product.usages)
        setDiseaseInputFields(product.diseases)
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {

        const reff = doc(FIRESTORE_DB, `rooms/${product.id}`)
        deleteDoc(reff)

        loadProducts()
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Room Deleted', life: 3000 });


    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };



    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts?.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...product };
        _product['category'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        console.log(val)
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2 flex">
                <Button icon="pi pi-print" severity="danger"  onClick={openPrint}/>
                <div className='ml-3'>
                <Calendar maxDate={new Date(endDate)} dateFormat="dd/mm/yy"  placeholder='Select Date' showIcon showButtonBar value={startDate} onChange={(e)=>{
                    console.log(e.target.value)
                    setCalenderChangedByUser(true)
                    setStartDate(e.target.value)
                    }} />
                </div>
                
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };



    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Full Name</span>
                {capitalizeFirstLetter(rowData.f_name) + " " + capitalizeFirstLetter(rowData.l_name)}
            </>
        );
    };

    const phoneBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };
    const serviceBodyTemplate = (rowData: Demo.Product) => {

        return (
            <>
                <span className="p-column-title">Room No.</span>
                {rowData.room_no}
            </>
        );
    };



    const streetBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Payment</span>
                {formatCurrency(rowData.payment as number)}{'/='}
            </>
        ); {rowData.room_type}
    };

    const minPaymentBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Minmum Price</span>
                {formatCurrency(rowData.payment_min as number)}{'/='}
            </>
        );
    };

    const roomTypeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Room Type</span>
                {rowData.room_type.name}
            </>
        );
    };


    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={rowData.image} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Category</span>
                {rowData.category}
            </>
        );
    };

    const ratingBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Reviews</span>
                <Rating value={rowData.rating} readOnly cancel={false} />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const descriptionBodyTemplate = (rowData: Demo.Post) => {
        return (
            <>
                <span className="p-column-title">Description</span>
                {rowData.description}
            </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />

                {rowData.createdBy==FIREBASE_AUTH?.currentUser?.uid ?<Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />:null}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{`List of Rooms`} {` `}
                <Badge value={products.length} severity="success" className='text-lg'></Badge>
            </h5>

            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const isFormFilled = () => {

        

        return product.room_no?.length > 0 &&
               product.room_type && 
               product.payment_min > 0 &&
               product.payment > 0


    }


    const productDialogFooter =()=> {
        const hasData= !! product?.room_no?.trim()
      return (
        <>
      <div className={hasData && `flex items-center justify-between`}>

         {hasData && <div className="mr-auto mt-5">
            <span className="text-500">By:</span>
            <span className="text-green-500 font-medium">{product?.createdByName} </span>
            
            </div>}

          <div className={hasData && `flex space-x-4`}>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button
              label={!isLoadingSubmit ? `Save` : <LoadingSpinner />}
              icon={!isLoadingSubmit && `pi pi-check`}
              text
              onClick={saveProduct}
              disabled={!isFormFilled() || isLoadingSubmit}
            />
          </div>
        </div>
        </>
      )
    };
      


    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    const imageSkeletonBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Full Name</span>
                <Skeleton width="7rem" height="4rem"></Skeleton>
            </>
        );
    };
    const titleSkeletonBodyTemplate = (rowData: Demo.Post) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                <div className="flex">
                    <div style={{ flex: '1' }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </>
        );
    };

    const descriptionSkeletonBodyTemplate = (rowData: Demo.Post) => {
        return (
            <>
                <span className="p-column-title">Check In</span>
                <div className="flex">
                    <div style={{ flex: '1' }}>
                        <Skeleton width="100%" className="mb-2"></Skeleton>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </>
        );
    };

    const priceSkeletonBodyTemplate = (rowData: Demo.Post) => {
        return (
            <>
                <span className="p-column-title">Payment</span>
                <div className="flex">
                    <div style={{ flex: '1' }}>
                        <Skeleton width="75%"></Skeleton>
                    </div>
                </div>
            </>
        );
    };


    const actionSkeletonBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <div className='flex'>
                    <Skeleton shape="circle" size="3rem" className="mr-2"></Skeleton>
                    <Skeleton shape="circle" size="3rem" className="mr-2"></Skeleton>
                </div>
            </>
        );
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    {isLoading && <DataTable
                        value={[{}, {}, {}, {}, {}, {}, {}, {}, {}]}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="Client's Name" body={imageSkeletonBodyTemplate}></Column>
                        <Column field="title" header="Phone Number" sortable body={titleSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="Room no." sortable body={descriptionSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Payment" sortable body={priceSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionSkeletonBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>}



                    {!isLoading && <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value as Demo.Product[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="room_no" header="Room No." body={serviceBodyTemplate} sortable></Column>
                        <Column field="room_type" header="Room Type" body={roomTypeBodyTemplate} sortable></Column>
                        <Column field="payment_min" header="Minmum Price" body={minPaymentBodyTemplate} sortable></Column>
                        <Column field="payment" header="Maximun Price" body={streetBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>}

                    <Dialog visible={productDialog} style={{ width: '470px' }} header="Rooms's Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="room_no">Room Number:</label>
                                <InputText placeholder='Enter Room Number' id="room_no" value={product.room_no} onChange={(e) => onInputChange(e, 'room_no')} required  className={classNames({ 'p-invalid': submitted && !product.room_no })} />
                                {submitted && !product.room_no && <small className="p-invalid">Room Number: Name is required.</small>}
                            </div>


                            <div className="field col">
                                <label htmlFor="room_type">Room Type:</label>
                                <Dropdown id="room_type" value={product.room_type} onChange={(e) => onInputNumberChange(e, 'room_type')} options={rooms} optionLabel="name" placeholder="Select Room Type" required className={classNames({ 'p-invalid': submitted && !product.room_type })} />
                                {submitted && !product.room_type && <small className="p-invalid">Room Type: is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">

                            <div className="field col">
                                <label htmlFor="payment">Minmum Price:</label>
                                <InputNumber placeholder='Enter Amount in Tsh' id="payment_min" value={product.payment_min} onChange={(e) => onInputNumberChange(e, 'payment_min')} required  className={classNames({ 'p-invalid': submitted && !product.payment_min })} mode="currency" currency="TZS" locale="en-TZ" />
                                {submitted && !product.payment_min && <small className="p-invalid">Minmum Price: is required.</small>}
                            </div>

                            <div className="field col">
                                <label htmlFor="payment">Maximum Price:</label>
                                <InputNumber placeholder='Enter Amount in Tsh' id="payment" value={product.payment} onChange={(e) => onInputNumberChange(e, 'payment')} required  className={classNames({ 'p-invalid': submitted && !product.payment })} mode="currency" currency="TZS" locale="en-TZ" />
                                {submitted && !product.payment && <small className="p-invalid">Maximum Price: is required.</small>}
                            </div>
                        </div>

                       

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Product;
