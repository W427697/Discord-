import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import glamorous from 'glamorous';

import { Icons } from '@storybook/components';
import Link from './Link';
import StorybookLogo from './logos/Storybook';

import Bar from './TopBar';
import Suggestions from './SearchSuggestions';

const {
  Menu: MenuIcon,
  Github: GithubIcon,
  Slack: SlackIcon,
  Medium: MediumIcon,
  Twitter: TwitterIcon,
} = Icons;

const TopLogo = glamorous(({ className }) => (
  <Link href="/">
    <a className={className}>
      <StorybookLogo width="auto" height="100%" />
    </a>
  </Link>
))({
  height: '100%',
  width: 'auto',

  '@media screen and (min-width: 501px)': {
    margin: -4,
    height: 'calc(100% + 8px)',
  },

  '& svg': {
    height: '100%',
    width: 'auto',
  },
});
const Nav = glamorous.ul(({ active }) => ({
  margin: 0,
  padding: 0,
  '@media screen and (min-width: 501px)': {
    display: 'flex',
  },
  '@media screen and (max-width: 500px)': {
    position: 'absolute',
    top: 50,
    left: 0,
    height: 'calc(100vh - 50px)',
    minWidth: 'calc(100vw - 55px)',
    maxWidth: '90vw',
    overflow: 'auto',
    transition: 'transform .24s cubic-bezier(0.4, 0, 0, 1.17)',
    backgroundColor: 'rgba(244,244,244, 0.94)',
    transform: `translateX(${active ? 0 : -100}px)`,
    opacity: active ? 1 : 0,
  },
}));
const NavItem = glamorous.li({
  display: 'flex',
  boxSizing: 'border-box',
  '@media screen and (max-width: 500px)': {
    height: 45,
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    paddingLeft: 20,
    paddingRight: 20,
  },
  '@media screen and (min-width: 501px)': {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: '13px',
    borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
  },
  '& > a': {
    padding: 12,
    color: 'currentColor',
    textDecoration: 'none',
  },
  '& > a:hover, &>a:active, &>a:focus': {
    textDecoration: 'underline',
    outline: 0,
    color: '#f1618c',
  },
  '& > a + a': {
    marginLeft: -12,
  },
});

const NavToggle = glamorous(({ children = 'open navigation', active, ...props }) => (
  <button {...props} title={children}>
    <MenuIcon />
  </button>
))({
  background: 'none',
  border: '0 none',
  padding: 0,
  width: 30,
  '& > *': {
    height: '100%',
    width: 'auto',
  },
});
const Search = dynamic(import('./Search'), {
  ssr: false,
  loading: glamorous.span({
    padding: 12,
    lineHeight: '28px',
    '&::before': {
      content: '"⋯"',
      display: 'inline',
    },
  }),
});

const SearchContainer = glamorous.div({
  display: 'flex',
  borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
  order: -1,
});
const NavContainer = glamorous.div({
  display: 'flex',
  '@media screen and (min-width: 501px)': {
    margin: '-12px -12px -12px 12px',
  },
  '@media screen and (max-width: 500px)': {
    margin: '-8px -16px -8px 16px',
  },
});
const ToggleContainer = glamorous.div({
  '@media screen and (min-width: 501px)': {
    display: 'none',
  },
  '@media screen and (max-width: 500px)': {
    display: 'flex',
    paddingLeft: 8,
    paddingRight: 16,
    borderLeft: '1px solid rgba(0, 0, 0, 0.05)',
  },
});

const TopNav = class extends Component {
  constructor(props) {
    super(props);

    this.state = { active: false };
    this.toggleExpanded = () => {
      this.setState({ expanded: !this.state.expanded });
    };
    this.activateSearching = () => {
      this.setState({ searching: true });
    };
    this.deactivateSearching = () => {
      this.setState({ searching: false });
    };
  }
  render() {
    const { expanded, searching } = this.state;
    const active = expanded || searching;
    return (
      <div>
        <Bar active={active}>
          <TopLogo />
          <NavContainer>
            <Nav active={expanded}>
              <NavItem>
                <Link href="/guides/">
                  <a>Guides</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/demo/">
                  <a>Demo</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/docs/">
                  <a>Docs</a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/guides/">
                  <a>Examples</a>
                </Link>
              </NavItem>
              <NavItem>
                <a href="https://github.com/storybooks/storybook">
                  <GithubIcon height={20} />
                </a>
                <a href="https://storybooks.slack.com">
                  <SlackIcon height={20} />
                </a>
                <a href="https://twitter.com/storybookjs">
                  <TwitterIcon height={20} />
                </a>
                <a href="https://medium.com/storybookjs">
                  <MediumIcon height={20} />
                </a>
              </NavItem>
            </Nav>
            <SearchContainer>
              <Search onFocus={this.activateSearching} onBlur={this.deactivateSearching} />
            </SearchContainer>
            <ToggleContainer>
              <NavToggle onClick={this.toggleExpanded} active={expanded} />
            </ToggleContainer>
          </NavContainer>
        </Bar>
        <Suggestions />
      </div>
    );
  }
};

TopNav.displayName = 'TopNav';

export default TopNav;
