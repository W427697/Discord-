const logger = require('@storybook/node-logger');
const detectFreePort = require('detect-port');

export async function getServerAddresses(
  port: number,
  host: string | undefined,
  proto: string,
  initialPath?: string
) {
  const address = new URL(`${proto}://localhost:${port}/`);

  // importing purely ESM 'internal-ip' package asynchronously to support CommonJS outputs
  const internalIp = await import('internal-ip');

  const networkAddress = new URL(
    `${proto}://${host || internalIp.internalIpV4Sync()}:${port}/`
  );

  if (initialPath) {
    const searchParams = `?path=${decodeURIComponent(
      initialPath.startsWith('/') ? initialPath : `/${initialPath}`
    )}`;
    address.search = searchParams;
    networkAddress.search = searchParams;
  }

  return {
    address: address.href,
    networkAddress: networkAddress.href,
  };
}

interface PortOptions {
  exactPort?: boolean;
}

export const getServerPort = (port?: number, { exactPort }: PortOptions = {}) =>
  detectFreePort(port)
    .then((freePort) => {
      if (freePort !== port && exactPort) {
        process.exit(-1);
      }
      return freePort;
    })
    .catch((error) => {
      logger.error(error);
      process.exit(-1);
    });

export const getServerChannelUrl = (port: number, { https }: { https?: boolean }) => {
  return `${https ? 'wss' : 'ws'}://localhost:${port}/storybook-server-channel`;
};
