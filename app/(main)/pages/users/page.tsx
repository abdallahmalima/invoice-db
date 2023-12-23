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
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useClients, useUsers } from '../../../../demo/hook/DataFetcher';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import LoadingSpinner from '../../../../demo/components/LoadingSpinner';
import { ScrollTop } from 'primereact/scrolltop';
import { UserAuth } from '../../../../demo/components/context/AuthContext';
import { Password } from 'primereact/password';
import { deleteUser } from '../../../../actions/deleteUser';




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

    const [usageInputFields, setUsageInputFields] = useState<any>([])
    const [diseaseInputFields, setDiseaseInputFields] = useState<any>([])
    // const [isLoading,setIsLoading]=useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)

    const [isLoading, setIsLoading, products, setProducts, loadProducts] = useUsers()


   

    


    const dropdownValues: InputValue[] = [
        { name: 'Arusha', code: '1' },
        { name: 'Babati', code: '2' },
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
        if (product.f_name.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product.id) {
                setIsLoadingSubmit(true)
                const ref = doc(FIRESTORE_DB, `users/${product.id}`)
                await updateDoc(ref, {
                    f_name: _product.f_name,
                    l_name: _product.l_name,
                    phone: _product.phone,
                    branch: _product.branch,
                    
                })
                loadProducts()
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
                console.log(product.id)




            } else {
                if (true) {
                   
                  


                    createUserWithEmailAndPassword(FIREBASE_AUTH,  _product.email as string, _product.password as string)
                    .then(async (userCredential:any) => {
                      // Signed up 
                      const {user} = userCredential;
                    
                      setIsLoadingSubmit(true)
                      const doc = await addDoc(collection(FIRESTORE_DB, 'users'), {
                        f_name: _product.f_name,
                        l_name: _product.l_name,
                        phone: _product.phone,
                        branch: _product.branch,
                         uid:user.uid
                        })
                        console.log(user)
                        loadProducts()
                        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
                      
                      
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.log(errorMessage)
                      // ..
                    });



                   



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

    const deleteProduct = async() => {

        // const reff = doc(FIRESTORE_DB, `users/${product.id}`)
        // deleteDoc(reff)
        const formData=new FormData()
        formData.append('uid',product.id)
        await deleteUser(formData)

        loadProducts()
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });


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

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
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
                {rowData.f_name + " " + rowData.l_name}
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
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };



    const streetBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Branch</span>
                {rowData.branch?.name}
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
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">{`List of Clients`} {` `}
                <Badge value={products.length} severity="success" className='text-lg'></Badge>
            </h5>

            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const isFormFilled = () => {

        return product.f_name?.length > 0 &&
            product.l_name?.length > 0 &&
            product.phone?.length > 0 &&
            product.email?.length > 0 &&
            product.password?.length > 0 
          
            


    }


    const productDialogFooter =()=> {
        const hasData= !! product?.f_name?.trim()
      return (
        <>
      <div className={hasData && `flex items-center justify-between`}>

         {hasData && <div className="mr-auto mt-5">
            <span className="text-500">By:</span>
            <span className="text-green-500 font-medium">Joyce Japhet </span>
            
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
                <span className="p-column-title">Name</span>
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
                <span className="p-column-title">Service</span>
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
                <span className="p-column-title">Street</span>
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
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    {isLoading && <DataTable
                        value={[{}, {}, {}, {}, {}, {}, {}, {}, {}]}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="Name" body={imageSkeletonBodyTemplate}></Column>
                        <Column field="title" header="phone" sortable body={titleSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="description" header="service" sortable body={descriptionSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="street" sortable body={priceSkeletonBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
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
                        <Column field="name" header="Client's Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Phone Number" body={phoneBodyTemplate} sortable></Column>
                        <Column field="service" header="Room No." body={serviceBodyTemplate} sortable></Column>
                        <Column field="street" header="Payment" body={streetBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>}

                    <Dialog visible={productDialog} style={{ width: '470px' }} header="Client's Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="f_name">First Name:</label>
                                <InputText placeholder='Enter First Name' id="f_name" value={product.f_name} onChange={(e) => onInputChange(e, 'f_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.f_name })} />
                                {submitted && !product.f_name && <small className="p-invalid">First Name: is required.</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="l_name">Last Name:</label>
                                <InputText placeholder='Enter Last Name' id="l_name" value={product.l_name} onChange={(e) => onInputChange(e, 'l_name')} required className={classNames({ 'p-invalid': submitted && !product.l_name })} />
                                {submitted && !product.l_name && <small className="p-invalid">Last Name: is required.</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="phone">Phone:</label>
                            <InputText placeholder='Enter Phone Number' id="phone" value={product.phone} onChange={(e) => onInputChange(e, 'phone')} required  className={classNames({ 'p-invalid': submitted && !product.phone })} />
                            {submitted && !product.phone && <small className="p-invalid">Phone: is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="email">Email:</label>
                            <InputText placeholder='Enter Email' id="email" value={product.email} onChange={(e) => onInputChange(e, 'email')} required  className={classNames({ 'p-invalid': submitted && !product.email })} />
                            {submitted && !product.email && <small className="p-invalid">Email: is required.</small>}
                        </div>
                        </div>
                        <div className="formgrid grid">
                        <div className="field col">
                                <label htmlFor="branch">Branch:</label>
                                <Dropdown id="branch" value={product.branch} onChange={(e) => onInputNumberChange(e, 'branch')} options={dropdownValues} optionLabel="name" placeholder="Select Branch" required className={classNames({ 'p-invalid': submitted && !product.branch })} />
                                {submitted && !product.branch && <small className="p-invalid">Branch: is required.</small>}
                            </div>
                        <div className="field col">
                            <label htmlFor="password">Password:</label>
                            <Password placeholder='Enter Password' id="password" value={product.password} onChange={(e) => onInputChange(e, 'password')} required  className={classNames({ 'p-invalid': submitted && !product.password })} />
                            {submitted && !product.password && <small className="p-invalid">Passoword: is required.</small>}
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
