declare module 'expo-clipboard' {
  export function setStringAsync(text: string): Promise<void>;
  export function getStringAsync(): Promise<string>;
  const Clipboard: { setStringAsync: typeof setStringAsync; getStringAsync: typeof getStringAsync };
  export default Clipboard;
}
