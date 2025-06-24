import Image from 'next/image';
import { ThemeIconContainer } from './styles';

type IconOptions = {
	'theme/sidebar':
	| 'arrow-down'
	| 'arrow-up'
	| 'bell-icon'
	| 'bet7k-icon'
	| 'cassino-pix-icon'
	| 'config-icon'
	| 'creation-icon'
	| 'dashboard-icon'
	| 'default-user-icon'
	| 'domain-icon'
	| 'logout-icon'
	| 'monitoring-icon'
	| 'offer-icon'
	| 'security-icon'
	| 'shipments-icon'
	| 'strategy-icon';

	'theme/sidebar/featured':
	| 'arrow-down'
	| 'bell-icon'
	| 'bet7k-icon'
	| 'cassino-pix-icon'
	| 'config-icon'
	| 'creation-icon'
	| 'dashboard-icon'
	| 'default-user-icon'
	| 'domain-icon'
	| 'logout-icon'
	| 'monitoring-icon'
	| 'offer-icon'
	| 'security-icon'
	| 'shipments-icon'
	| 'strategy-icon';

	'theme/input':
	| 'search-icon'
	| 'user'
	| 'lock'
	| 'key'
	| 'mail'
	| 'users'
	| 'monitor';


	'assets/error': 'error';

	'assets/construction': 'construction';

	'assets/notfound': 'notfound';

	'theme/analytics':
	| 'clicks-icon'
	| 'convertion-icon'
	| 'cost-icon'
	| 'featured-offer-icon'
	| 'metrics-icon'
	| 'sales-cost-icon'
	| 'sales-icon'
	| 'statistics-icon'
	| 'calendar-icon';

	'theme/analytics/featured':
	| 'clicks-icon'
	| 'convertions-icon'
	| 'cost-icon'
	| 'featured-offer-icon'
	| 'metrics-icon'
	| 'sales-cost-icon'
	| 'sales-icon'
	| 'statistics-icon';

	'theme/campaigns':
	| 'clicks'
	| 'visits'
	| 'participants'
	| 'bonus-given'
	| 'statistic'
	| 'campaigns'
	| 'details'
	| 'minigame'
	| 'minigame-clicks'
	| 'minigame-visits'
	| 'minigame-participants'
	| 'minigame-bonus'
	| 'campaign-geral'
	| 'active-players'
	| 'start-date'
	| 'end-date';

	'theme/tooltip':
	| 'info';
};

type ThemeIconProps<T extends keyof IconOptions> = {
	type: T;
	icon: IconOptions[T];
	width?: number;
	height?: number;
	className?: string;
};

export const ThemeIcon = <T extends keyof IconOptions>({
	type,
	icon,
	width = 24,
	height = 24,
	className,
}: ThemeIconProps<T>) => {
	return (
		<ThemeIconContainer className={className}>
			<Image
				src={`/${type}/${icon}.svg`}
				width={width}
				height={height}
				alt='theme-icon'
			/>
		</ThemeIconContainer>
	);
};
