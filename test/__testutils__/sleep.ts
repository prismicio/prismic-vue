/**
 * Pauses process for the specified amount of time.
 */
export const sleep = (timeout = 0): Promise<null> =>
	new Promise((res) => {
		setTimeout(() => {
			res(null);
		}, timeout);
	});
