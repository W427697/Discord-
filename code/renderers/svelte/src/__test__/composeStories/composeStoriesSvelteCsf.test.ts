/// <reference types="@testing-library/jest-dom" />;
import { it, expect, vi, describe } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { expectTypeOf } from 'expect-type';
import type { Meta } from '../..';
import * as svelteCsfStories from './Button.stories.svelte';
// import type Button from './Button.svelte';
import Button from './Button.svelte';
import { composeStories, composeStory, setProjectAnnotations } from '../../portable-stories';
import { SvelteComponent } from 'svelte';

// example with composeStories, returns an object with all stories composed with args/decorators
const svelteCsf = composeStories(svelteCsfStories);

console.log('LOG: in test', { svelteCsf });
// example with composeStory, returns a single story composed with args/decorators
// const Secondary = composeStory(stories.CSF2Secondary, stories.default);

it('renders basic story', () => {
  const CSF3PrimaryRendered = svelteCsf.Primary({ label: 'Hello world' });
  render(CSF3PrimaryRendered.Component, CSF3PrimaryRendered.props);

  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).toBeInTheDocument();
});

it('reuses args from composed story', () => {
  const CSF3PrimaryRendered = svelteCsf.ButtonNoArgs();
  render(CSF3PrimaryRendered.Component, CSF3PrimaryRendered.props);

  const buttonElement = screen.getByText(/explicit label prop.*Text in the slot/i);
  expect(buttonElement).toBeInTheDocument();
});
