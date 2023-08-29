import type { FC } from 'react';
import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { useAddonState, Provider as ManagerProvider, addons } from '../index';

class FakeProvider {
  constructor() {
    // @ts-expect-error (Converted from ts-ignore)
    this.addons = addons;
    // @ts-expect-error (Converted from ts-ignore)
    this.channel = {
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  }

  // @ts-expect-error (Converted from ts-ignore)
  getElements(type) {
    return addons.getElements(type);
  }

  renderPreview() {
    return <div>This is from a 'renderPreview' call from FakeProvider</div>;
  }

  // @ts-expect-error (Converted from ts-ignore)
  handleAPI(api) {
    addons.loadAddons(api);
  }

  getConfig() {
    return {};
  }
}

const Wrapper: FC = ({ children }) => (
  <ManagerProvider
    key="manager"
    provider={new FakeProvider()}
    path=""
    storyId="ui-app--loading-state"
    location={{ search: '' }}
    navigate={() => {}}
    docsOptions={{ docsMode: false }}
  >
    {children}
  </ManagerProvider>
);

type AddonLikeProps = {
  defaultValue?: string;
  id: string;
  name: string;
  valueToSet?: string | null | undefined | ((value: string) => string | null | undefined);
};

const AddonLike = ({ defaultValue, id, valueToSet, name }: AddonLikeProps) => {
  const [state, setState] = useAddonState(name, defaultValue);
  return (
    <button type="button" data-testid={id} onClick={() => setState(valueToSet)}>
      {state}
    </button>
  );
};
const LazyAddonLike = (props: AddonLikeProps) => {
  const [state, setState] = useState(false);
  return state ? (
    <AddonLike {...props} />
  ) : (
    <button type="button" data-testid="load" onClick={() => setState(true)}>
      Load
    </button>
  );
};

describe('sync', () => {
  test('sync up default state', () => {
    const name = 'basic';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" />
        <AddonLike name={name} id="B" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');
  });
  test('sync up default state, in reverse order', () => {
    const name = 'reversed';

    const result = render(
      <Wrapper>
        <AddonLike name={name} id="B" />
        <AddonLike name={name} id="A" defaultValue="foo" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');
  });
  test('sync up state from previous render, and ignore new default state', async () => {
    const name = 'first-cache';

    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" />
        <AddonLike name={name} id="B" />
        <LazyAddonLike name={name} id="C" defaultValue="baz" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');
    let C = result.queryByTestId('C');
    const loadButton = result.getByTestId('load');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');
    expect(C).toEqual(null);

    await fireEvent.click(loadButton);

    C = result.queryByTestId('C');
    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');
    expect(C.textContent).toEqual('foo');
  });
  test('sync up state from previous render, and take first default state', async () => {
    const name = 'late-cache';

    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" />
        <AddonLike name={name} id="B" />
        <LazyAddonLike name={name} id="C" defaultValue="baz" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');
    let C = result.queryByTestId('C');
    const loadButton = result.getByTestId('load');

    expect(A.textContent).toEqual('');
    expect(B.textContent).toEqual('');
    expect(C).toEqual(null);

    await fireEvent.click(loadButton);

    C = result.queryByTestId('C');
    expect(A.textContent).toEqual('baz');
    expect(B.textContent).toEqual('baz');
    expect(C.textContent).toEqual('baz');
  });
});

describe('updating', () => {
  test('allow setting new values', async () => {
    const name = 'setting';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" valueToSet="bar" />
        <AddonLike name={name} id="B" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');

    await fireEvent.click(A);

    expect(A.textContent).toEqual('bar');
    expect(B.textContent).toEqual('bar');
  });
  test('allow setting null values', async () => {
    const name = 'null';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" valueToSet={null} />
        <AddonLike name={name} id="B" valueToSet="bar" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');

    await fireEvent.click(B);

    expect(A.textContent).toEqual('bar');
    expect(B.textContent).toEqual('bar');

    await fireEvent.click(A);

    expect(A.textContent).toEqual('');
    expect(B.textContent).toEqual('');
  });
  test('allow setting undefined values', async () => {
    const name = 'undefined';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" valueToSet={undefined} />
        <AddonLike name={name} id="B" valueToSet="bar" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');

    await act(async () => {
      await fireEvent.click(B);
    });

    expect(A.textContent).toEqual('bar');
    expect(B.textContent).toEqual('bar');

    await act(async () => {
      await fireEvent.click(A);
    });

    expect(A.textContent).toEqual('');
    expect(B.textContent).toEqual('');
  });
  test('allow setting when there is no default state, ever', async () => {
    const name = 'no-default';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" valueToSet={undefined} />
        <AddonLike name={name} id="B" valueToSet="bar" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('');
    expect(B.textContent).toEqual('');

    await act(async () => {
      await fireEvent.click(B);
    });

    expect(A.textContent).toEqual('bar');
    expect(B.textContent).toEqual('bar');

    await act(async () => {
      await fireEvent.click(A);
    });

    expect(A.textContent).toEqual('');
    expect(B.textContent).toEqual('');
  });
  test('allow setter function', async () => {
    const name = 'setter';
    const result = render(
      <Wrapper>
        <AddonLike name={name} id="A" defaultValue="foo" valueToSet={(value) => `${value}!`} />
        <AddonLike name={name} id="B" />
      </Wrapper>
    );

    const A = result.getByTestId('A');
    const B = result.getByTestId('B');

    expect(A.textContent).toEqual('foo');
    expect(B.textContent).toEqual('foo');

    await fireEvent.click(A);

    expect(A.textContent).toEqual('foo!');
    expect(B.textContent).toEqual('foo!');
  });
});
