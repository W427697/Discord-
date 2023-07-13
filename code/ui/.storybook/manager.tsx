import { addons, types } from '@storybook/manager-api';
import { IconButton, Icons } from '@storybook/components';
import startCase from 'lodash/startCase.js';
import React, { Fragment } from 'react';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});

addons.register('lalala', (api) => {
  addons.add('lalala', {
    title: 'lalala',
    type: types.TOOL,
    render() {
      return (
        <Fragment>
          <IconButton
            title="lalala"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('lalala', {
                [id]: {
                  description: 'lalala',
                  status: 'error',
                  title: 'lalala',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="failed" />
          </IconButton>
          <IconButton
            title="lalala"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('lalala', {
                [id]: {
                  description: 'lalala',
                  status: 'warn',
                  title: 'lalala',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="changed" />
          </IconButton>
          <IconButton
            title="lalala"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('lalala', {
                [id]: {
                  description: 'lalala',
                  status: 'success',
                  title: 'lalala',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="passed" />
          </IconButton>

          <IconButton
            title="foobar"
            color="red"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('foobar', {
                [id]: {
                  description: 'foobar',
                  status: 'error',
                  title: 'foobar',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="failed" />
          </IconButton>
          <IconButton
            title="foobar"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('foobar', {
                [id]: {
                  description: 'foobar',
                  status: 'warn',
                  title: 'foobar',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="changed" />
          </IconButton>
          <IconButton
            title="foobar"
            onClick={() => {
              const { id } = api.getCurrentStoryData();

              api.experimental_updateStatus('foobar', {
                [id]: {
                  description: 'foobar',
                  status: 'success',
                  title: 'foobar',
                  data: {},
                },
              });
            }}
          >
            <Icons icon="passed" />
          </IconButton>
        </Fragment>
      );
    },
  });
});
