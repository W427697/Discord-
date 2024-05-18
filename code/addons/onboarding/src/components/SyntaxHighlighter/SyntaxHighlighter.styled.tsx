import { styled } from '@storybook/core/dist/theming';
import { motion } from 'framer-motion';

export const Code = styled(motion.div)`
  position: relative;
  z-index: 2;
`;

export const SnippetWrapperFirst = styled(motion.div)`
  position: relative;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const SnippetWrapper = styled(motion.div)`
  position: relative;
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const Container = styled.div<{ width: number }>`
  position: relative;
  box-sizing: border-box;
  background: #171c23;
  width: ${({ width }) => width}px;
  height: 100%;
  overflow: hidden;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 4px;
  border-left: ${({ theme }) => (theme.base === 'dark' ? 1 : 0)}px solid #fff2;
  border-bottom: ${({ theme }) => (theme.base === 'dark' ? 1 : 0)}px solid #fff2;
  border-top: ${({ theme }) => (theme.base === 'dark' ? 1 : 0)}px solid #fff2;
  border-radius: 6px 0 0 6px;
  overflow: hidden;

  && {
    pre {
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`;

export const Backdrop = styled(motion.div)`
  background: #143046;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 44px;
  width: 100%;
  height: 81px;
`;
