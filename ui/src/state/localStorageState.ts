export default interface LocalStorageState {
    getLocalStorage: () => Map<number, string | null> | null
  }