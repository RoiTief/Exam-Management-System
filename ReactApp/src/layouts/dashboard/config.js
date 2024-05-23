import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Home Page',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Create New Meta-Question',
    icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
    ),
    children: [
      {
        title: 'Simple Meta-Question',
        path: '/create/simple',
      },
      {
        title: 'Appendix Meta-Question',
        path: '/create/choose-appendix',
      },
      {
        title: 'Appendix plus Meta-Question',
        path: '/create/appendix-plus-question',
      }
    ]
  },
  {
    title: 'Generate Views For Meta Question',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: 'View question as in test',
        path: '/',
      },
      {
        title: 'View question as in catalogue',
        path: '/questions/catalog',
      },
      {
        title: 'View question as in answer sheet',
        path: '/',
      }
    ]
  },
  {
    title: 'Manage Course Staff',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    path: '/course-staff'
  },
  {
    title: 'previews exams',
    path: '/course-stuff',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }
];
