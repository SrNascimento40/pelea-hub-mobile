import { Platform } from 'react-native';

// EXPO_PUBLIC_API_URL lets you point the app at a LAN IP for physical device
// testing (e.g. EXPO_PUBLIC_API_URL=http://192.168.0.10:8000/api/v1).
const fromEnv = process.env.EXPO_PUBLIC_API_URL;

// Android emulators can't reach the host via localhost; 10.0.2.2 is the
// documented alias for the host loopback interface.
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = fromEnv ?? `http://${defaultHost}:8000/api/v1`;
