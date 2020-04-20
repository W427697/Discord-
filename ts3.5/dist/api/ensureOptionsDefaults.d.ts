/// <reference types="jest" />
import { Stories2SnapsConverter } from '../Stories2SnapsConverter';
import { StoryshotsOptions } from './StoryshotsOptions';
declare function ensureOptionsDefaults(options: StoryshotsOptions): {
    asyncJest: boolean;
    suite: string;
    storyNameRegex: string | RegExp;
    storyKindRegex: string | RegExp;
    stories2snapsConverter: Stories2SnapsConverter;
    testMethod: (story: any, context: any, renderTree: import("../frameworks/Loader").RenderTree, options?: any) => any;
    snapshotSerializers: jest.SnapshotSerializerPlugin[];
    integrityOptions: boolean | {
        ignore: string[];
        absolute: boolean;
        cwd?: string;
        root?: string;
        dot?: boolean;
        nomount?: boolean;
        mark?: boolean;
        nosort?: boolean;
        stat?: boolean;
        silent?: boolean;
        strict?: boolean;
        cache?: {
            [path: string]: boolean | readonly string[] | "DIR" | "FILE";
        };
        statCache?: {
            [path: string]: false | {
                isDirectory(): boolean;
            };
        };
        symlinks?: {
            [path: string]: boolean;
        };
        realpathCache?: {
            [path: string]: string;
        };
        sync?: boolean;
        nounique?: boolean;
        nonull?: boolean;
        debug?: boolean;
        nobrace?: boolean;
        noglobstar?: boolean;
        noext?: boolean;
        nocase?: boolean;
        matchBase?: any;
        nodir?: boolean;
        follow?: boolean;
        realpath?: boolean;
        nonegate?: boolean;
        nocomment?: boolean;
        flipNegate?: boolean;
    };
};
export default ensureOptionsDefaults;
