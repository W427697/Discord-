import styled from 'react-emotion';
import { Link } from '../router/router';

const SectionLink = styled(Link)(({ theme }) => ({
  display: 'block',
  flex: 1,
  padding: theme.layoutMargin,
  textDecoration: 'none',
  fontSize: theme.mainTextSize,
  color: 'inherit',
}));

export { SectionLink as default };
