export function createRandomString(length: number) {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	const randomArray = new Uint8Array(length);
	crypto.getRandomValues(randomArray);
	randomArray.forEach((number) => {
		result += chars[number % chars.length];
	});
	return result;
}

export function secondToTimeString(sec: number): string {
	const min = Math.floor(sec / 60);
	const hour = Math.floor(min / 60);
	sec = sec % 60;
	const minStr = min < 10 ? `0${min}` : String(min);
	const hourStr = hour < 10 ? `0${hour}` : String(hour);
	const secStr = sec < 10 ? `0${sec}` : String(sec);

	return `${hourStr}:${minStr}:${secStr}`;
}
