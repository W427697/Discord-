declare global {
    namespace jest {
        interface Matchers<R, T> {
            notToBeAbandoned(stories2snapsConverter: any): R;
        }
    }
}
declare function integrityTest(integrityOptions: any, stories2snapsConverter: any): void;
export default integrityTest;
