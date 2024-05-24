import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import { HomeIcon } from '@heroicons/react/24/solid';
import {
  AdminPanelSettingsRounded,
  Newspaper,
  QuestionMark,
  SchoolOutlined,
} from '@mui/icons-material';

export const items = [
  {
    title: 'Home Page',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Manage Users',
    path: '/admin/users',
    icon: (
      <SvgIcon fontSize="small">
        <AdminPanelSettingsRounded />
      </SvgIcon>
    )
  },
  {
    title: 'Create New Meta-Question',
    icon: (
        <SvgIcon fontSize="small">
          <QuestionMark />
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
    title: 'All Questions',
    icon: (
      <SvgIcon fontSize="small">
        <SchoolOutlined />
      </SvgIcon>
    ),
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
    path: '/course-staff'
  },
  {
    title: 'previews exams',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <Newspaper />
      </SvgIcon>
    )
  }
];
