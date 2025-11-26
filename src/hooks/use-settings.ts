import { useState, useEffect } from 'react';
import { initializeGemini } from '../services/gemini';

const STORAGE_KEY = 'gemini_api_keys';

export function useSettings() {
    const [apiKeys, setApiKeys] = useState<string[]>([]);
    const [apiKey, setApiKey] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedKeys = localStorage.getItem(STORAGE_KEY);
        if (storedKeys) {
            try {
                const keys = JSON.parse(storedKeys);
                if (Array.isArray(keys) && keys.length > 0) {
                    setApiKeys(keys);
                    setApiKey(keys[0]);
                    initializeGemini(keys);
                    setIsInitialized(true);
                }
            } catch (e) {
                // Fallback to old single key format
                const oldKey = localStorage.getItem('gemini_api_key');
                if (oldKey) {
                    const keys = [oldKey];
                    setApiKeys(keys);
                    setApiKey(oldKey);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
                    localStorage.removeItem('gemini_api_key');
                    initializeGemini(keys);
                    setIsInitialized(true);
                }
            }
        } else {
            // Fallback to old single key format
            const oldKey = localStorage.getItem('gemini_api_key');
            if (oldKey) {
                const keys = [oldKey];
                setApiKeys(keys);
                setApiKey(oldKey);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
                localStorage.removeItem('gemini_api_key');
                initializeGemini(keys);
                setIsInitialized(true);
            }
        }
    }, []);

    const saveApiKey = (key: string) => {
        const trimmedKey = key.trim();
        if (!trimmedKey) return;

        // Check if key already exists
        if (apiKeys.includes(trimmedKey)) {
            return;
        }

        const newKeys = [...apiKeys, trimmedKey];
        setApiKeys(newKeys);
        setApiKey(newKeys[0]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
        initializeGemini(newKeys);
        setIsInitialized(true);
    };

    const removeApiKey = (keyToRemove?: string) => {
        if (keyToRemove) {
            const newKeys = apiKeys.filter(k => k !== keyToRemove);
            if (newKeys.length === 0) {
                localStorage.removeItem(STORAGE_KEY);
                setApiKeys([]);
                setApiKey('');
                setIsInitialized(false);
            } else {
                setApiKeys(newKeys);
                setApiKey(newKeys[0]);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newKeys));
                initializeGemini(newKeys);
            }
        } else {
            // Remove all keys (backward compatibility)
            localStorage.removeItem(STORAGE_KEY);
            setApiKeys([]);
            setApiKey('');
            setIsInitialized(false);
        }
    };

    return { apiKey, apiKeys, isInitialized, saveApiKey, removeApiKey };
}
