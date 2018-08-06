import styled from 'react-emotion';

export const NavBar = styled('nav')(({ theme }) => ({
  width: 50,
  background: theme.navFill,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
}));

export const NavBarHead = styled('header')(({ theme }) => theme);
export const NavPrimary = styled('ul')({
  background: 'rgba(0,0,0,0.15)',
  width: '100%',
  minHeight: 10,
  margin: '10px 0',
  padding: 10,
  boxSizing: 'border-box',
});
export const NavSecondary = styled('ul')({
  background: 'rgba(0,0,0,0.25)',
  width: '100%',
  minHeight: 10,
  margin: 0,
  padding: 10,
  boxSizing: 'border-box',
});

export const Other = styled('div')({
  width: 'calc(100% - 50px)',
  height: '100%',
  position: 'relative',
  boxSizing: 'border-box',
});
