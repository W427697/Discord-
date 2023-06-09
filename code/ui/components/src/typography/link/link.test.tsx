import type { AnchorHTMLAttributes } from 'react';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import type { LinkProps } from './link';
import { Link } from './link';

const LEFT_BUTTON = '[MouseLeft]';
const MIDDLE_BUTTON = '[MouseMiddle]';
const RIGHT_BUTTON = '[MouseRight]';

function ThemedLink(props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <Link {...props} />
    </ThemeProvider>
  );
}

describe('Link', () => {
  describe('events', () => {
    it('should call onClick on a plain left click', () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${LEFT_BUTTON}`,
      });
      expect(handleClick).toHaveBeenCalled();
    });

    it("shouldn't call onClick on a middle click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${MIDDLE_BUTTON}`,
      });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on a right click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${RIGHT_BUTTON}`,
      });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on alt+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.keyboard('[>AltLeft]');
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${LEFT_BUTTON}`,
      });
      userEvent.keyboard('[/AltLeft]');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on ctrl+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.keyboard('[>ControlLeft]');
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${LEFT_BUTTON}`,
      });
      userEvent.keyboard('[/ControlLeft]');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on cmd+click / win+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.keyboard('[>MetaLeft]');
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${LEFT_BUTTON}`,
      });
      userEvent.keyboard('[/MetaLeft]');
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("shouldn't call onClick on shift+click", () => {
      const handleClick = jest.fn();
      render(<ThemedLink onClick={handleClick}>Content</ThemedLink>);
      userEvent.keyboard('[>ShiftLeft]');
      userEvent.pointer({
        target: screen.getByText('Content'),
        keys: `${LEFT_BUTTON}`,
      });
      userEvent.keyboard('[/ShiftLeft]');
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
