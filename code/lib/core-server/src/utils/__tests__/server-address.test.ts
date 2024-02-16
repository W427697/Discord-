import { describe, beforeEach, it, expect, vi } from 'vitest';
import os from 'os';
import { getServerAddresses } from '../server-address';

vi.mock('os');
const mockedOs = vi.mocked(os);

describe('getServerAddresses', () => {
  beforeEach(() => {
    mockedOs.networkInterfaces.mockReturnValue({
      eth0: [
        {
          address: '192.168.0.5',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '01:02:03:0a:0b:0c',
          internal: false,
          cidr: '192.168.0.5/24',
        },
      ],
    });
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
