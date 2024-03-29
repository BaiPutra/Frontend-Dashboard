// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'ATM',
    path: '/dashboard/atm',
    icon: getIcon('fluent:building-retail-money-20-filled'),
  },
  {
    title: 'CRM',
    path: '/dashboard/crm',
    icon: getIcon('ri:luggage-deposit-fill'),
  },
  {
    title: 'EDC',
    path: '/dashboard/edc',
    icon: getIcon('bxs:credit-card-alt'),
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
