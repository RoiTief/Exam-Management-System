import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
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
        path: '/create/simple',
      },
      {
        title: 'Appendix plus Meta-Question',
        path: '/create/appendix',
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
    title: 'Course staff',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: 'view Existing staff',
        path: '/',
      },
      {
        title: 'add TA',
        path: '/',
      },
      {
        title: 'Add tester',
        path: '/',
      }
    ]
  },
  {
    title: 'previews exams',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  }
];
