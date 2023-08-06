import type { ComponentType, FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { motion } from 'framer-motion';

interface MobileMenuDrawerProps {
  setMenuOpen: (isMenuOpen: boolean) => void;
  Sidebar: ComponentType<any>;
}

const Container = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  width: '100%',
  background: theme.background.content,
  height: '80%',
  bottom: 0,
  left: 0,
  zIndex: 11,
  borderRadius: '10px 10px 0 0',
}));

const Overlay = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  background: 'rgba(0, 0, 0, 0.5)',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: 10,
}));

export const MobileMenuDrawer: FC<MobileMenuDrawerProps> = ({ setMenuOpen, Sidebar }) => {
  return (
    <>
      <Container
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Sidebar />
      </Container>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
};
