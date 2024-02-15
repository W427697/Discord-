import { describe, it, expect, vi } from 'vitest';
import { getServerAddresses, getServerPort, getServerChannelUrl } from './server-address';
import detectPort from 'detect-port';

vi.mock('internal-ip', () => ({
  internalIpV4Sync: vi.fn(),
}));
vi.mock('detect-port');
vi.mock('@storybook/node-logger');

describe('getServerAddresses', () => {
  const port = 3000;
  const host = 'localhost';
  const proto = 'http';

  it('should return server addresses without initial path by default', async () => {
    const expectedAddress = `${proto}://localhost:${port}/`;
    const expectedNetworkAddress = `${proto}://${host}:${port}/`;

    const result = await getServerAddresses(port, host, proto);

    expect(result.address).toBe(expectedAddress);
    expect(result.networkAddress).toBe(expectedNetworkAddress);
  });

  it('should return server addresses with initial path', async () => {
    const initialPath = '/foo/bar';

    const expectedAddress = `${proto}://localhost:${port}/?path=/foo/bar`;
    const expectedNetworkAddress = `${proto}://${host}:${port}/?path=/foo/bar`;

    const result = await getServerAddresses(port, host, proto, initialPath);

    expect(result.address).toBe(expectedAddress);
    expect(result.networkAddress).toBe(expectedNetworkAddress);
  });

  it('should return server addresses with initial path and add slash if missing', async () => {
    const initialPath = 'foo/bar';

    const expectedAddress = `${proto}://localhost:${port}/?path=/foo/bar`;
    const expectedNetworkAddress = `${proto}://${host}:${port}/?path=/foo/bar`;

    const result = await getServerAddresses(port, host, proto, initialPath);

    expect(result.address).toBe(expectedAddress);
    expect(result.networkAddress).toBe(expectedNetworkAddress);
  });

  it('should return the internal ip if host is not specified', async () => {
    const initialPath = 'foo/bar';
    const mockedNetworkIP = '192.168.0.5';

    const expectedAddress = `${proto}://localhost:${port}/?path=/foo/bar`;
    const expectedNetworkAddress = `${proto}://${mockedNetworkIP}:${port}/?path=/foo/bar`;

    vi.mocked(await import('internal-ip')).internalIpV4Sync.mockReturnValue('192.168.0.5');

    const result = await getServerAddresses(port, undefined, proto, initialPath);

    expect(result.address).toBe(expectedAddress);
    expect(result.networkAddress).toBe(expectedNetworkAddress);
  });
});

describe('getServerPort', () => {
  const port = 3000;

  it('should resolve with a free port', async () => {
    const expectedFreePort = 4000;

    vi.mocked(detectPort).mockResolvedValue(expectedFreePort);

    const result = await getServerPort(port);

    expect(result).toBe(expectedFreePort);
  });
});

describe('getServerChannelUrl', () => {
  const port = 3000;
  it('should return WebSocket URL with HTTP', () => {
    const options = { https: false };
    const expectedUrl = `ws://localhost:${port}/storybook-server-channel`;

    const result = getServerChannelUrl(port, options);

    expect(result).toBe(expectedUrl);
  });

  it('should return WebSocket URL with HTTPS', () => {
    const options = { https: true };
    const expectedUrl = `wss://localhost:${port}/storybook-server-channel`;

    const result = getServerChannelUrl(port, options);

    expect(result).toBe(expectedUrl);
  });
});
