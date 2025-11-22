import { useState, useEffect } from 'react';
import { initializeGemini } from '../services/gemini';

export function useSettings() {
    const [apiKey, setApiKey] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            initializeGemini(storedKey);
            setIsInitialized(true);
        }
    }, []);

    const saveApiKey = (key: string) => {
        localStorage.setItem('gemini_api_key', key);
        setApiKey(key);
        initializeGemini(key);
        setIsInitialized(true);
    };

    const removeApiKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setIsInitialized(false);
    };

    return { apiKey, isInitialized, saveApiKey, removeApiKey };
}
