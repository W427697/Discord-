import type { WriteStream } from 'fs-extra';
import { move, remove, writeFile, readFile, createWriteStream } from 'fs-extra';
import { join } from 'path';
// import { Transform } from 'stream';
import tempy from 'tempy';

export function parseList(str: string): string[] {
  return str
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function getEnvConfig(program: Record<string, any>, configEnv: Record<string, any>): void {
  Object.keys(configEnv).forEach((fieldName) => {
    const envVarName = configEnv[fieldName];
    const envVarValue = process.env[envVarName];
    if (envVarValue) {
      // eslint-disable-next-line no-param-reassign
      program[fieldName] = envVarValue;
    }
  });
}

// class NullByteFilter extends Transform {
//   _transform(chunk, encoding, callback) {
//     console.log('IS THIS DOING SOMETHING');
//     // Remove all null bytes from the chunk
//     const filteredChunk = chunk.filter((byte: number) => {
//       console.log({ byte });
//       return byte !== 0x00;
//     });

//     // Pass the filtered chunk to the next stream in the pipeline
//     callback(null, filteredChunk);
//   }
// }

export const createLogStream = async (
  logFileName: string
): Promise<{
  moveLogFile: () => Promise<void>;
  removeLogFile: () => Promise<void>;
  clearLogFile: () => Promise<void>;
  readLogFile: () => Promise<string>;
  logStream: WriteStream;
}> => {
  const finalLogPath = join(process.cwd(), logFileName);
  const temporaryLogPath = tempy.file({ name: logFileName });
  // const filterNull = new Transform({
  //   transform(chunk, encoding, callback) {
  //     const filtered = chunk.filter((byte: number) => {
  //       console.log('byte', byte);
  //       return byte !== 0x00;
  //     });
  //     this.push(filtered);
  //     callback();
  //   },
  // });

  const logStream = createWriteStream(temporaryLogPath, { encoding: 'utf8' });

  // logStream.on('data', (chunk) => {
  //   console.log('DATA!', chunk);
  //   // Filter out null bytes from the chunk
  //   const filteredChunk = chunk.filter((byte: number) => byte !== 0x00);

  //   // Write the filtered chunk to the output file
  //   logStream.write(filteredChunk);
  // });

  return new Promise((resolve, reject) => {
    // logStream.pipe(filterNull);
    logStream.once('open', () => {
      const moveLogFile = async () => move(temporaryLogPath, finalLogPath, { overwrite: true });
      const clearLogFile = async () => writeFile(temporaryLogPath, '');
      const removeLogFile = async () => remove(temporaryLogPath);
      const readLogFile = async () => {
        // eslint-disable-next-line no-control-regex
        return (await readFile(temporaryLogPath, 'utf8')).replace(/[\x00-\x1F\x7F]/g, '');
      };
      resolve({ logStream, moveLogFile, clearLogFile, removeLogFile, readLogFile });
    });
    logStream.once('error', reject);
  });
};
