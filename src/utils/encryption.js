import cryptoJs, { AES } from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET;

export const encrypt = (text) => {
	return AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (hash) => {
	let bytes = AES.decrypt(hash, SECRET_KEY);
	return bytes.toString(cryptoJs.enc.Utf8);
};
