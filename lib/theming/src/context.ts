import React from 'react';
import { convert } from './convert';
import { Theme } from './types';
import { themes } from './create';

export const Context = React.createContext<Theme>(convert(themes.light));
