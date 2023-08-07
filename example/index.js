import { ExchangerateHostApi } from '../dist/exhcangerate-host-api.js';

const api = ExchangerateHostApi.create();

const result = await api.getLatest();
console.log(result);
