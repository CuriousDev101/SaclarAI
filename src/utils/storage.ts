export const saveToStorage = (key: string, value: any) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromStorage = (key: string) => {
	return localStorage.getItem(key) || null;
};

export const removeFromStorage = (key: string) => {
	localStorage.removeItem(key);
};
