/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { colors } from '@/constants/Colors';

import { useColorScheme } from './useColorSchemeRN';

/**
 * Returns the theme color based on the current color scheme and the provided color name.
 * @param props - An object containing light and dark color properties.
 * @param props.light - The color to use in light mode.
 * @param props.dark - The color to use in dark mode.
 * @param colorName - The name of the color to retrieve from the colors object.
 * @returns The color corresponding to the current color scheme.
 */
export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof colors.light
) {
	const theme = useColorScheme() ?? 'light';
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return colors[theme][colorName];
	}
}
