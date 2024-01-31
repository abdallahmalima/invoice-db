/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
       
        {
            label: 'Features',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                
               
                {
                    label: ' Reservations',
                    icon: 'pi pi-fw pi-users',
                    to: '/pages/products'
                },
                {
                    label: 'Rooms',
                    icon: 'pi pi-fw pi-table',
                    to: '/pages/rooms'
                },
                // {
                //     label: 'Comments',
                //     icon: 'pi pi-fw pi-comment',
                //     to: '/pages/comments'
                // },
                
            ]
        },
      
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

               
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
