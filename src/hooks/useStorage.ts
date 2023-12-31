export default function useStorage() {
  return {
    get<T>(key: string): T | null {
      const local = localStorage.getItem(key);

      if (local) {
        const formatedLocal = JSON.parse(local);

        return formatedLocal as T;
      }

      return null;
    },
    add(key: string, item: string | object) {
      localStorage.setItem(key, JSON.stringify(item));
    },
  };
}
