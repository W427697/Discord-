import type { ComponentProps, FC } from 'react';
import React, { memo } from 'react';
import * as StorybookIcons from '@storybook/icons';
import { styled } from '@storybook/theming';
import { deprecate, logger } from '@storybook/client-logger';

export type IconType = keyof typeof icons;
type NewIconTypes = typeof icons[IconType];

const Svg = styled.svg`
  display: inline-block;
  shape-rendering: inherit;
  vertical-align: middle;
  fill: currentColor;
  path {
    fill: currentColor;
  }
`;

export interface IconsProps extends ComponentProps<typeof Svg> {
  icon: IconType;
  useSymbol?: boolean;
  onClick?: () => void;
}

/**
 * @deprecated No longer used, will be removed in Storybook 9.0
 * Please use the `@storybook/icons` package instead.
 * */
export const Icons: FC<IconsProps> = ({ icon, useSymbol, ...props }: IconsProps) => {
  deprecate(
    `Use of the deprecated Icons ${
      `(${icon})` || ''
    } component detected. Please use the @storybook/icons component directly. For more informations, see the migration notes at https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#icons-is-deprecated`
  );
  const findIcon: NewIconTypes = icons[icon] || null;
  if (!findIcon) {
    logger.warn(
      `Use of an unknown prop ${
        `(${icon})` || ''
      } in the Icons component. The Icons component is deprecated. Please use the @storybook/icons component directly. For more informations, see the migration notes at https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#icons-is-deprecated`
    );
    return null;
  }
  const Icon: FC = StorybookIcons[findIcon];

  return <Icon {...props} />;
};

export interface SymbolsProps {
  icons?: IconType[];
}

/**
 * @deprecated No longer used, will be removed in Storybook 9.0
 * Please use the `@storybook/icons` package instead.
 * */
export const Symbols = memo<SymbolsProps>(function Symbols({ icons: keys = Object.keys(icons) }) {
  return (
    <Svg
      viewBox="0 0 14 14"
      style={{ position: 'absolute', width: 0, height: 0 }}
      data-chromatic="ignore"
    >
      {keys.map((key: IconType) => (
        <symbol id={`icon--${key}`} key={key}>
          {icons[key]}
        </symbol>
      ))}
    </Svg>
  );
});

export const icons = {
  user: 'User',
  useralt: 'UserAlt',
  useradd: 'UserAdd',
  users: 'Users',
  profile: 'Profile',
  facehappy: 'FaceHappy',
  faceneutral: 'FaceNeutral',
  facesad: 'FaceSad',
  accessibility: 'Accessibility',
  accessibilityalt: 'AccessibilityAlt',
  arrowup: 'ChevronUp',
  arrowdown: 'ChevronDown',
  arrowleft: 'ChevronLeft',
  arrowright: 'ChevronRight',
  arrowupalt: 'ArrowUp',
  arrowdownalt: 'ArrowDown',
  arrowleftalt: 'ArrowLeft',
  arrowrightalt: 'ArrowRight',
  expandalt: 'ExpandAlt',
  collapse: 'Collapse',
  expand: 'Expand',
  unfold: 'Unfold',
  transfer: 'Transfer',
  redirect: 'Redirect',
  undo: 'Undo',
  reply: 'Reply',
  sync: 'Sync',
  upload: 'Upload',
  download: 'Download',
  back: 'Back',
  proceed: 'Proceed',
  refresh: 'Refresh',
  globe: 'Globe',
  compass: 'Compass',
  location: 'Location',
  pin: 'Pin',
  time: 'Time',
  dashboard: 'Dashboard',
  timer: 'Timer',
  home: 'Home',
  admin: 'Admin',
  info: 'Info',
  question: 'Question',
  support: 'Support',
  alert: 'Alert',
  email: 'Email',
  phone: 'Phone',
  link: 'Link',
  unlink: 'LinkBroken',
  bell: 'Bell',
  rss: 'RSS',
  sharealt: 'ShareAlt',
  share: 'Share',
  circle: 'Circle',
  circlehollow: 'CircleHollow',
  bookmarkhollow: 'BookmarkHollow',
  bookmark: 'Bookmark',
  hearthollow: 'HeartHollow',
  heart: 'Heart',
  starhollow: 'StarHollow',
  star: 'Star',
  certificate: 'Certificate',
  verified: 'Verified',
  thumbsup: 'ThumbsUp',
  shield: 'Shield',
  basket: 'Basket',
  beaker: 'Beaker',
  hourglass: 'Hourglass',
  flag: 'Flag',
  cloudhollow: 'CloudHollow',
  edit: 'Edit',
  cog: 'Cog',
  nut: 'Nut',
  wrench: 'Wrench',
  ellipsis: 'Ellipsis',
  check: 'Check',
  form: 'Form',
  batchdeny: 'BatchDeny',
  batchaccept: 'BatchAccept',
  controls: 'Controls',
  plus: 'Plus',
  closeAlt: 'CloseAlt',
  cross: 'Cross',
  trash: 'Trash',
  pinalt: 'PinAlt',
  unpin: 'Unpin',
  add: 'Add',
  subtract: 'Subtract',
  close: 'Close',
  delete: 'Delete',
  passed: 'Passed',
  changed: 'Changed',
  failed: 'Failed',
  clear: 'Clear',
  comment: 'Comment',
  commentadd: 'CommentAdd',
  requestchange: 'RequestChange',
  comments: 'Comments',
  lock: 'Lock',
  unlock: 'Unlock',
  key: 'Key',
  outbox: 'Outbox',
  credit: 'Credit',
  button: 'Button',
  type: 'Type',
  pointerdefault: 'PointerDefault',
  pointerhand: 'PointerHand',
  browser: 'Browser',
  tablet: 'Tablet',
  mobile: 'Mobile',
  watch: 'Watch',
  sidebar: 'Sidebar',
  sidebaralt: 'SidebarAlt',
  sidebaralttoggle: 'SidebarAltToggle',
  sidebartoggle: 'SidebarToggle',
  bottombar: 'BottomBar',
  bottombartoggle: 'BottomBarToggle',
  cpu: 'CPU',
  database: 'Database',
  memory: 'Memory',
  structure: 'Structure',
  box: 'Box',
  power: 'Power',
  photo: 'Photo',
  component: 'Component',
  grid: 'Grid',
  outline: 'Outline',
  photodrag: 'PhotoDrag',
  search: 'Search',
  zoom: 'Zoom',
  zoomout: 'ZoomOut',
  zoomreset: 'ZoomReset',
  eye: 'Eye',
  eyeclose: 'EyeClose',
  lightning: 'Lightning',
  lightningoff: 'LightningOff',
  contrast: 'Contrast',
  switchalt: 'SwitchAlt',
  mirror: 'Mirror',
  grow: 'Grow',
  paintbrush: 'PaintBrush',
  ruler: 'Ruler',
  stop: 'Stop',
  camera: 'Camera',
  video: 'Video',
  speaker: 'Speaker',
  play: 'Play',
  playback: 'PlayBack',
  playnext: 'PlayNext',
  rewind: 'Rewind',
  fastforward: 'FastForward',
  stopalt: 'StopAlt',
  sidebyside: 'SideBySide',
  stacked: 'Stacked',
  sun: 'Sun',
  moon: 'Moon',
  book: 'Book',
  document: 'Document',
  copy: 'Copy',
  category: 'Category',
  folder: 'Folder',
  print: 'Print',
  graphline: 'GraphLine',
  calendar: 'Calendar',
  graphbar: 'GraphBar',
  menu: 'Menu',
  menualt: 'Menu',
  filter: 'Filter',
  docchart: 'DocChart',
  doclist: 'DocList',
  markup: 'Markup',
  bold: 'Bold',
  paperclip: 'PaperClip',
  listordered: 'ListOrdered',
  listunordered: 'ListUnordered',
  paragraph: 'Paragraph',
  markdown: 'Markdown',
  repository: 'Repo',
  commit: 'Commit',
  branch: 'Branch',
  pullrequest: 'PullRequest',
  merge: 'Merge',
  apple: 'Apple',
  linux: 'Linux',
  ubuntu: 'Ubuntu',
  windows: 'Windows',
  storybook: 'Storybook',
  azuredevops: 'AzureDevOps',
  bitbucket: 'Bitbucket',
  chrome: 'Chrome',
  chromatic: 'Chromatic',
  componentdriven: 'ComponentDriven',
  discord: 'Discord',
  facebook: 'Facebook',
  figma: 'Figma',
  gdrive: 'GDrive',
  github: 'Github',
  gitlab: 'Gitlab',
  google: 'Google',
  graphql: 'Graphql',
  medium: 'Medium',
  redux: 'Redux',
  twitter: 'Twitter',
  youtube: 'Youtube',
  vscode: 'VSCode',
} as const;
