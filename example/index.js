import { ExchangerateHostApi } from '../dist/exchangerate-host-api.js';

const api = ExchangerateHostApi.create();

const result = await api.getLatest();
console.log(result);
