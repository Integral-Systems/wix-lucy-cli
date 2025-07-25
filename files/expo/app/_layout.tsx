import '@/global.css';
import '@/lib/utils/polyfills';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';

import { NAV_THEME } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};
export { ErrorBoundary } from 'expo-router';
/**
 * Root layout component for the application.
 * This component sets up the theme provider and status bar style based on the user's color scheme preference
 * @returns The root layout component.
 */
export default function RootLayout() {
	const hasMounted = React.useRef(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}
		if (Platform.OS === 'web') {
			// Adds the background color to the html element to prevent white background on overscroll.
			document.documentElement.classList.add('bg-background');
		}
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);
	if (!isColorSchemeLoaded) {
		return null;
	}
	
	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
			<Stack />
		</ThemeProvider>
	);
}
const useIsomorphicLayoutEffect = Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;