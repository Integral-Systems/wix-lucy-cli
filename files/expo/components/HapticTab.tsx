import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

/**
 * Renders a tab button with haptic feedback on press.
 * @param props - The props for the tab button.
 * @returns The tab button component with haptic feedback.
 */
export function HapticTab(props: BottomTabBarButtonProps) {
	return (
		<PlatformPressable
			{...props}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === 'ios') {
					// Add a soft haptic feedback when pressing down on the tabs.
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				props.onPressIn?.(ev);
			}}
		/>
	);
}
