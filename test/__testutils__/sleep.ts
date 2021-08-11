export const sleep = (timeout = 0): Promise<null> =>
	new Promise((res) => {
		setTimeout(() => {
			res(null);
		}, timeout);
	});
