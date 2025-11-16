import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Hook to run pause/resume callbacks when app goes to background/foreground.
 * Ensures callbacks only fire on actual state transitions.
 */
export function useAppStatePause(pause?: () => void, resume?: () => void) {
	const appStateRef = useRef<AppStateStatus>(AppState.currentState);

	useEffect(() => {
		const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
			const prev = appStateRef.current;
			const becameInactive = prev === 'active' && (next === 'inactive' || next === 'background');
			const becameActive = (prev === 'inactive' || prev === 'background') && next === 'active';
			if (becameInactive) {
				pause?.();
			}
			if (becameActive) {
				resume?.();
			}
			appStateRef.current = next;
		});
		return () => sub.remove();
	}, [pause, resume]);
}


