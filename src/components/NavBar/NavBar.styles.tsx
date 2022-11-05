import { Box, IconButton, styled, Toolbar, Typography } from '@mui/material';

export const NavToolBar = styled(Toolbar)(({ theme }) => ({
  paddingTop: '8px',
  paddingBottom: '8px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white
}));

export const NavBarDrawerIconButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  marginRight: '8px',
  [theme.breakpoints.up('md')]: {
    display: 'none'
  }
}));

export const NavBarPatientUserDataBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    display: 'none'
  },
  [theme.breakpoints.up('lg')]: {
    display: 'flex'
  }
}));

export const NavBarPatientUserDataIconButton = styled(IconButton)(({ theme }) => ({
  color: 'inherit',
  [theme.breakpoints.up('lg')]: {
    display: 'none'
  },
  paddingTop: '4px',
  paddingBottom: '4px'
}));

export const NavBarPatientDetailsTypography = styled(Typography)(() => ({
  textTransform: 'capitalize',
  fontSize: 14
}));

export const PatientDetailsDialogTypography = styled(Typography)(() => ({
  textTransform: 'capitalize',
  fontSize: 16
}));

export const NavBarTitleTypography = styled(Typography)(() => ({
  textTransform: 'capitalize',
  fontSize: 14,
  fontWeight: 500
}));
