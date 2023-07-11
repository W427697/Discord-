import type { Icons } from '@storybook/components';
import type { ComponentProps } from 'react';
import type { API_StatusValue } from '@storybook/types';

export const statusPriority: API_StatusValue[] = ['unknown', 'pending', 'success', 'warn', 'error'];
export const statusMapping: Record<
  API_StatusValue,
  [ComponentProps<typeof Icons>['icon'] | null, string | null, string | null]
> = {
  unknown: [null, null, null],
  pending: ['watch', 'currentColor', 'currentColor'],
  success: ['passed', 'green', 'currentColor'],
  warn: ['changed', 'orange', '#A15C20'],
  error: ['failed', 'red', 'brown'],
};
