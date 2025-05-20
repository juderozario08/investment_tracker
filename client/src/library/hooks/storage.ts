import { MMKV } from 'react-native-mmkv';
import { useState, useEffect } from 'react';

const storage = new MMKV();

export const useStorage = <T>(key: string, defaultValue: T): [T, (value: T) => void] => {
    const [value, setValue] = useState<T>(() => {
        const stored = storage.getString(key);
        return stored ? JSON.parse(stored) : defaultValue;
    });

    const save = (val: T) => {
        setValue(val);
        storage.set(key, JSON.stringify(val));
    };

    useEffect(() => {
        const stored = storage.getString(key);
        if (stored) setValue(JSON.parse(stored));
    }, [key]);

    return [value, save];
};
