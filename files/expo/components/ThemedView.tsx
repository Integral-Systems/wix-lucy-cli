import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

/**
 * Renders a themed view with a background color based on the color scheme.
 * @param root0 - The props for the themed view component.
 * @param root0.style - Additional styles to apply to the view.
 * @param root0.lightColor - The color to use in light mode.
 * @param root0.darkColor - The color to use in dark mode.  
 * @param root0.rest - Additional props for the view component.
 * @returns The themed view component.
 */
export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

	return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
