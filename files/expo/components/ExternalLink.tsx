import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

/**
 * Renders an external link that opens in an in-app browser on native platforms.
 * @param root0 - The props for the external link component.
 * @param root0.href - The URL to link to.
 * @param root0.rest - Additional props for the link component.
 * @returns The external link component.
 */
export function ExternalLink({ href, ...rest }: Props) {
	return (
		<Link
			target="_blank"
			{...rest}
			href={href}
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			onPress={async (event) => {
				if (Platform.OS !== 'web') {
					// Prevent the default behavior of linking to the default browser on native.
					event.preventDefault();
					// Open the link in an in-app browser.
					await openBrowserAsync(href);
				}
			}}
		/>
	);
}
