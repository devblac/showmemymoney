export const STORAGE_PREFERENCE_KEY = 'smm_storage_preference';

export const getStoragePreference = (): string => {
  const preference = localStorage.getItem(STORAGE_PREFERENCE_KEY);
  if (!preference) {
    // Set default preference if none exists
    localStorage.setItem(STORAGE_PREFERENCE_KEY, 'memory');
    return 'memory';
  }
  return preference;
};

export const setStoragePreference = (type: string): void => {
  localStorage.setItem(STORAGE_PREFERENCE_KEY, type);
}; 