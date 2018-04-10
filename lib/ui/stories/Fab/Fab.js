// @flow
import React from 'react';

import '@material/fab/dist/mdc.fab.min.css';

type Props = {
  className?: string,
  style?: {},
  iconName: string,
  small?: boolean,
  onClick: (e: MouseEvent) => void,
};

const Fab: React$ComponentType<Props> = ({
  className,
  style,
  iconName,
  small = false,
  onClick,
}) => {
  const smallClass: string = small ? 'mdc-fab--mini' : '';
  const mainClass: string = `mdc-fab material-icons ${smallClass} ${className || ''}`.trim();
  return (
    <button className={mainClass} style={style} onClick={onClick}>
      <span className="mdc-fab__icon">{iconName}</span>
    </button>
  );
};

export default Fab;
