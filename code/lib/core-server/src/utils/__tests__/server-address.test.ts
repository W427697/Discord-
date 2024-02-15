import { describe, beforeEach, it, expect, vi } from 'vitest';
import { getServerAddresses } from '../server-address';

vi.mock('internal-ip');
let mockedInternalIp;

describe('getServerAddresses', () => {
  beforeEach(async () => {
    const importIp = await import('internal-ip');
    mockedInternalIp = vi.mocked(importIp);
    mockedInternalIp.internalIpV4Sync.mockReturnValue('192.168.0.5');
  });

  it('builds addresses with a specified host', async () => {
    const { address, networkAddress } = await getServerAddresses(9009, '192.168.89.89', 'http');
    expect(address).toEqual('http://localhost:9009/');
    expect(networkAddress).toEqual('http://192.168.89.89:9009/');
  });

  it('builds addresses with local IP when host is not specified', async () => {
    const { address, networkAddress } = await getServerAddresses(9009, '', 'http');
    expect(address).toEqual('http://localhost:9009/');
    expect(networkAddress).toEqual('http://192.168.0.5:9009/');
  });
});
