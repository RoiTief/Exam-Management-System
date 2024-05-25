import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import { HomeIcon } from '@heroicons/react/24/solid';
import {
  AdminPanelSettingsRounded,
  Newspaper,
  QuestionMark,
  SchoolOutlined,
} from '@mui/icons-material';

const types = require("../../../../src/main/Enums").USER_TYPES;


export const items = [
  {
    title: 'Home Page',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN, types.TA]
  },
  {
    title: 'Manage Users',
    path: '/admin/users',
    icon: (
      <SvgIcon fontSize="small">
        <AdminPanelSettingsRounded />
      </SvgIcon>
    ),
    permissions: [types.ADMIN]
  },
  {
    title: 'Create New Meta-Question',
    icon: (
        <SvgIcon fontSize="small">
          <QuestionMark />
        </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN, types.TA],
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
    title: 'All Questions',
    icon: (
      <SvgIcon fontSize="small">
        <SchoolOutlined />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN, types.TA],
    children: [
      {
        title: 'Test View',
        path: '/',
      },
      {
        title: 'Catalogue View',
        path: '/questions/catalog',
      },
      {
        title: 'Answer Sheet View',
        path: '/',
      }
    ]
  },
  {
    title: 'Manage Course Staff',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN],
    path: '/course-staff'
  },
  {
    title: 'previews exams',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <Newspaper />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN]
  }
];
