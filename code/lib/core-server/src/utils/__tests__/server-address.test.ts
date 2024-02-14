import { describe, beforeEach, it, expect, vi } from 'vitest';
import internalIp from 'internal-ip';
import { getServerAddresses } from '../server-address';

vi.mock('internal-ip');
const mockedInternalIp = vi.mocked(internalIp);

describe('getServerAddresses', () => {
  beforeEach(() => {
    mockedInternalIp.internalIpV4Sync.mockReturnValue('192.168.0.5');
  });

  it('builds addresses with a specified host', () => {
    const { address, networkAddress } = getServerAddresses(9009, '192.168.89.89', 'http');
    expect(address).toEqual('http://localhost:9009/');
    expect(networkAddress).toEqual('http://192.168.89.89:9009/');
  });

  it('builds addresses with local IP when host is not specified', () => {
    const { address, networkAddress } = getServerAddresses(9009, '', 'http');
    expect(address).toEqual('http://localhost:9009/');
    expect(networkAddress).toEqual('http://192.168.0.5:9009/');
  });
});
