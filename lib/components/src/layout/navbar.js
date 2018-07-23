import styled from 'react-emotion';

export const NavBar = styled('nav')(({ theme }) => ({
  width: 50,
  background: theme.navFill,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  justifyContent: 'space-between',
}));

export const NavBarHead = styled('header')(({ theme }) => theme);
export const NavPrimary = styled('ul')({
  background: 'rgba(0,0,0,0.15)',
  width: '100%',
  minHeight: 50,
  margin: '10px 0',
  padding: 0,
});
export const NavSecondary = styled('ul')({
  background: 'rgba(0,0,0,0.25)',
  width: '100%',
  minHeight: 50,
  margin: 0,
  padding: 0,
});

export const Other = styled('div')({
  width: 'calc(100% - 50px)',
  height: '100%',
  position: 'relative',
});
