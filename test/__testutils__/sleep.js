/**
 * Pauses process for the specified amount of time.
 */
export const sleep = (timeout = 0) =>
	new Promise((res) => {
		setTimeout(() => {
			res(null);
		}, timeout);
	});
