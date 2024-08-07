import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';
import { HomeIcon } from '@heroicons/react/24/solid';
import {
  AdminPanelSettingsRounded,
  Newspaper,
  QuestionMark,
  SchoolOutlined, Work, ContentPaste
} from '@mui/icons-material';
import { ACCOUNT, SIDE_BAR } from '../../constants';

const types = require("../../../../src/main/Enums").USER_TYPES;


export const items = [
  {
    title: SIDE_BAR.HOME_PAGE,
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.ADMIN, types.TA]
  },
  {
    title: SIDE_BAR.MANAGE_USERS,
    path: '/admin/users',
    icon: (
      <SvgIcon fontSize="small">
        <AdminPanelSettingsRounded />
      </SvgIcon>
    ),
    permissions: [types.ADMIN]
  },
  {
    title: SIDE_BAR.ASK_FOR_WORK,
    icon: (
      <SvgIcon fontSize="small">
        <Work />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.TA],
    children: [
      {
        title: SIDE_BAR.TAG_ANSWERS,
        path: '/work/tag',
      }
    ]
  },
  {
    title: SIDE_BAR.CREATE_META_QUESTION,
    icon: (
        <SvgIcon fontSize="small">
          <QuestionMark />
        </SvgIcon>
    ),
    permissions: [types.LECTURER, types.TA],
    children: [
      {
        title: SIDE_BAR.SIMPLE_META_QUESTION,
        path: '/create/choose-appendix',
      },
      {
        title: SIDE_BAR.APPENDIX_PLUS_META_QUESTION,
        path: '/create/appendix-plus-question',
      },
      {
        title: SIDE_BAR.APPENDIX,
        path: '/create/appendix',
      }
    ]
  },
  {
    title: SIDE_BAR.META_QUESTIONS_CATALOG,
    icon: (
      <SvgIcon fontSize="small">
        <SchoolOutlined />
      </SvgIcon>
    ),
    permissions: [types.LECTURER, types.TA],
    children: [
      // {
      //   title: 'Test View',
      //   path: '/',
      // },
      {
        title: SIDE_BAR.META_QUESTIONS,
        path: '/catalog/questions',
      },
      {
        title: SIDE_BAR.APPENDICES,
        path: '/catalog/appendices',
      },
      // {
      //   title: 'Answer Sheet View',
      //   path: '/',
      // }
    ]
  },
  {
    title: SIDE_BAR.MANAGE_COURSE_STAFF,
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    permissions: [types.LECTURER],
    path: '/course-staff'
  },
  {
    title: SIDE_BAR.GENERATE_EXAM,
    path: '/generate-exam',
    icon: (
      <SvgIcon fontSize="small">
        <Newspaper />
      </SvgIcon>
    ),
    permissions: [types.LECTURER]
  },
  {
    title: SIDE_BAR.PAST_EXAMS,
    path: '/past-exams',
    icon: (
      <SvgIcon fontSize="small">
        <ContentPaste />
      </SvgIcon>
    ),
    permissions: [types.LECTURER]
  }
];
