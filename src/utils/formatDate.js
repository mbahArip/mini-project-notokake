export const formatDate = (date) => {
	const d = new Date(date);
	const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const month = `${d.getMonth()}`;
	const day = `${d.getDate()}`.padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${monthsList[month]}/${year}`;
};

export const formatDateWithTime = (date) => {
	const d = new Date(date);
	const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const month = `${d.getMonth()}`;
	const day = `${d.getDate()}`.padStart(2, '0');
	const year = d.getFullYear();
	const hours = `${d.getHours()}`.padStart(2, '0');
	const minutes = `${d.getMinutes()}`.padStart(2, '0');
	return `${day} ${monthsList[month]} ${year}, at ${hours}:${minutes}`;
};
