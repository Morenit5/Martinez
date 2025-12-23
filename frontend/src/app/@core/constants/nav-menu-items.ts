import { ROLE } from '../../auth/enums/roles.enum';
//import { PERMISSIONS } from '../../auth/enums/permissions.enum';
import { NavMenuItem } from '@core/interfaces';

// THIS FILE CONTAINS THE NAVIGATION MENU ITEMS FOR THE SIDEBAR AND ALL OTHER NAVIGATION MENUS WHICH ARE USED IN THE APPLICATION AND ARE CONSTANT

/**
 * Navigation menu items for WEB Sidebar
 */
export const webSidebarMenuItems: NavMenuItem[] = [
  {
    href: '/dashboard',
    title: 'Dashboard',
    active: true,
    icon: 'house',
    roles: [ROLE.ADMIN,ROLE.USER,ROLE.MEMBER],
  },
  {
    href: '/users',
    title: 'Usuarios', //Users
    active: false,
    icon: 'person-fill-gear',
    roles: [ROLE.ADMIN],
    //permissions: [PERMISSIONS.CREATE_USER,PERMISSIONS.ACCESS_USER],
  },
  {
    href: '/client',
    title: 'Clientes', //Sales
    active: false,
    icon: 'person-vcard-fill',
    roles: [ROLE.ADMIN,ROLE.USER],
    //permissions: [PERMISSIONS.ACCESS_SALE],
  },
  {
    href: '/services',
    title: 'Servicios', //Servicios ofrecidos
    active: false,
    icon: 'clipboard-check-fill',
    roles: [ROLE.ADMIN,ROLE.USER],
    subItems: [
      {
        href: '/service',
        title: 'Servicio', 
        icon: 'list-check',
        active: false,
        roles: [ROLE.ADMIN,ROLE.USER],
      },
      {
        href: '/invoice',
        title: 'Factura', //factura
        icon: 'receipt-cutoff',
        active: false,
        roles: [ROLE.ADMIN,ROLE.USER],
      },
    ],
  },  
  {
    href: '/inventory',
    title: 'Inventario', //Products
    active: false,
    icon: 'tools',
    roles: [ROLE.ADMIN,ROLE.USER],
    subItems: [
      {
        href: '/category',
        title: 'Categoría', //Product Categories files-alt
        icon: 'files-alt',
        active: false,
        roles: [ROLE.ADMIN,ROLE.USER],
      },
      {
        href: '/tool',
        title: 'Herramienta', //Product Types
        icon: 'hammer',
        active: false,
        roles: [ROLE.ADMIN,ROLE.USER],
      },
    ],
  },
  {
    href: '/configs',
    title: 'Configuración', //Sales
    active: false,
    icon: 'gear',
    roles: [ROLE.ADMIN,ROLE.USER],
  },
];
