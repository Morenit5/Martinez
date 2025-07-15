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
    icon: 'speedometer2',
    permissions: [PERMISSIONS.ACCESS_USER],
  },
  {
    href: '/sales',
    title: 'Clientes', //Sales
    active: false,
    icon: 'table',
    permissions: [PERMISSIONS.ACCESS_SALE],
  },
  {
    href: '/inventory',
    title: 'Invetario', //Products
    active: false,
    icon: 'clipboard-check',
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
      }
    ],
  },
  {
    href: '/settings',
    title: 'Ajustes', //Settings
    active: false,
    icon: 'gear',
    divider: true,
  },
];
