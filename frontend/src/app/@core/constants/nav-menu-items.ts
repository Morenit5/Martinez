import { PERMISSIONS } from '../../auth/enums/permissions.enum';
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
  },
  {
    href: '/users',
    title: 'Usuarios', //Users
    active: false,
    icon: 'person-fill-gear',
    permissions: [PERMISSIONS.ACCESS_USER],
  },
  {
    href: '/client',
    title: 'Clientes', //Sales
    active: false,
    icon: 'person-vcard-fill',
    permissions: [PERMISSIONS.ACCESS_SALE],
  },
  {
    href: '/inventory',
    title: 'Inventario', //Products
    active: false,
    icon: 'clipboard-check-fill',
    subItems: [
      {
        href: '/category',
        title: 'Categoría', //Product Categories files-alt
        icon: 'files-alt',
        active: false,
      },
      {
        href: '/tool',
        title: 'Herramienta', //Product Types
        icon: 'hammer',
        active: false,
      },
    ],
  },
  {
    href: '/payment',
    title: 'Pagos', //Settings
    active: false,
    icon: 'cash-coin',
    divider: true,
  },
  {
    href: '/settings',
    title: 'Ajustes', //Settings
    active: false,
    icon: 'gear',
    divider: true,
  },
];
