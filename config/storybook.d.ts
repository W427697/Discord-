// Type definitions for dist/client/index.js
// Project: https://github.com/kadirahq/react-storybook

declare var module: any; // dangerous

interface StoryApi {
    add (storyName: string, callback: Function): StoryApi;
}

interface Story {
    name: string;
    render: Function[];
}

interface Book {
    kind: string;
    stories: Story[];
}

export function storiesOf(name: string, module: any): StoryApi;
export function setAddon(module: any): void;
export function addDecorator(module: Function);
export function getStorybook(): Book[];
export function configure(loaders: Function[], module: any);

export function action(name: string, ...params: any[]): Function;
export function linkTo(name: string, story: any): Function;
