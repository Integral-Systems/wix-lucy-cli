import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * This hook returns the color scheme after the component has mounted, ensuring that the initial render
 * does not depend on the color scheme.
 * @returns The current color scheme ('light' or 'dark') after hydration.
 */
export function useColorScheme() {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	const colorScheme = useRNColorScheme();

	if (hasHydrated) {
		return colorScheme;
	}

	return 'light';
}
