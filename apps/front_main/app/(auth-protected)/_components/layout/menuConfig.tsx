import React from 'react';
import styled from 'styled-components';
import {
  FcBarChart,
  FcCollect,
  FcConferenceCall,
  FcGenealogy,
  FcTimeline,
  FcUpload,
  FcPrivacy,
  FcEngineering,
  FcDocument,
  FcGenericSortingAsc,
  FcSettings
} from 'react-icons/fc';

const StyledBar = styled(FcBarChart)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledRead = styled(FcCollect)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledCollab = styled(FcConferenceCall)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledCreate = styled(FcUpload)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledPermissions = styled(FcPrivacy)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledOnboarding = styled(FcTimeline)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledML = styled(FcGenealogy)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledDoc = styled(FcDocument)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledEng = styled(FcEngineering)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledLabs = styled(FcGenericSortingAsc)`
  height: 1.3rem;
  width: 1.3rem;
`;

const StyledSettings = styled(FcSettings)`
  height: 1.3rem;
  width: 1.3rem;
`;

export const getMenus = () => [
  {
    id: '1',
    name: 'Dashboard',
    route: `/app/dashboard`,
    icon: <StyledBar />
  },
  {
    id: '2',
    name: 'Read Update',
    route: `/app/readupdate`,
    icon: <StyledRead />
  },
  {
    id: '3',
    name: 'Create',
    route: `/app/create`,
    icon: <StyledCreate />
  },
  {
    id: '4',
    name: 'Permissions',
    route: `/app/permissions`,
    icon: <StyledPermissions />
  },
  {
    id: '5',
    name: 'Users',
    route: `/app/users`,
    icon: <StyledCollab />
  },
  {
    id: '6',
    name: 'Onboarding',
    route: `/app/onboarding`,
    icon: <StyledOnboarding />
  },
  {
    id: '7',
    name: 'Machine Learning',
    route: `/app/machinelearning`,
    icon: <StyledML />
  },
  {
    id: '8',
    name: 'Settings',
    route: `/app/settings`,
    icon: <StyledSettings />
  }
];
