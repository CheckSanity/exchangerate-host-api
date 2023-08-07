import { ExchangerateHostApi } from './ExchangerateHostApi';
import {
  buildIntegrationTestApiInstance,
  FetchApiSpy,
} from './test/ExchangerateHostApi.builder';

describe('exchangerate.host API tests', () => {
  let api: ExchangerateHostApi;
  let fetchSpy: FetchApiSpy;

  beforeEach(() => {
    [api, fetchSpy] = buildIntegrationTestApiInstance();
  });

  describe('get symbols', () => {
    it('should return list of symbols', async () => {
      const result = await api.getSymbols();

      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/symbols`,
      );

      expect(result.symbols).toBeDefined();
    });
  });

  describe('get latest', () => {
    it('get latest should return today currency rate for EUR', async () => {
      const result = await api.getLatest();
      const today = new Date().toISOString().slice(0, 10);

      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/latest`,
      );

      expect(result.base).toStrictEqual('EUR');
      expect(result.date).toStrictEqual(today);
      expect(result.rates).toBeDefined();
    });

    it('get latest should return today currency rate for specified symbols and custom base currency, with provided amount', async () => {
      const result = await api.getLatest({
        base: 'AED',
        amount: 1200,
        symbols: ['RUB', 'USD'],
      });
      const today = new Date().toISOString().slice(0, 10);

      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/latest?base=AED&amount=1200&symbols=RUB,USD`,
      );

      expect(result.base).toStrictEqual('AED');
      expect(result.date).toStrictEqual(today);
      expect(result.rates['RUB']).toBeDefined();
      expect(result.rates['USD']).toBeDefined();
    });
  });

  describe('convert', () => {
    it('should return converted result', async () => {
      const result = await api.convert({ from: 'AED', to: 'RUB' });
      const today = new Date().toISOString().slice(0, 10);

      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/convert?from=AED&to=RUB`,
      );

      expect(result.query.from).toStrictEqual('AED');
      expect(result.query.to).toStrictEqual('RUB');
      expect(result.historical).toStrictEqual(false);
      expect(result.date).toStrictEqual(today);
      expect(result.info.rate).not.toBeNull();
      expect(result.result).not.toBeNull();
    });

    it('should return null result on invalid currency', async () => {
      const result = await api.convert({ from: 'AED', to: 'AAAAAASSSSS' });
      const today = new Date().toISOString().slice(0, 10);

      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/convert?from=AED&to=AAAAAASSSSS`,
      );

      expect(result.query.from).toStrictEqual('AED');
      expect(result.query.to).toStrictEqual('AAAAAASSSSS');
      expect(result.historical).toStrictEqual(false);
      expect(result.date).toStrictEqual(today);
      expect(result.info.rate).toBeNull();
      expect(result.result).toBeNull();
    });
  });

  describe('get by date', () => {
    it('should return result by date', async () => {
      const result = await api.getByDate('2021-04-04');
      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/2021-04-04`,
      );

      expect(result.base).toStrictEqual('EUR');
      expect(result.historical).toStrictEqual(true);
      expect(result.date).toStrictEqual('2021-04-04');
      expect(result.rates).toBeDefined();
    });
  });

  describe('get by timeseries', () => {
    it('should return result by timeseries', async () => {
      const result = await api.getByDateRange({
        start_date: '2021-04-01',
        end_date: '2021-04-03',
        base: 'AED',
      });
      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/timeseries?start_date=2021-04-01&end_date=2021-04-03&base=AED`,
      );

      expect(result.timeseries).toStrictEqual(true);
      expect(result.base).toStrictEqual('AED');
      expect(result.start_date).toStrictEqual('2021-04-01');
      expect(result.end_date).toStrictEqual('2021-04-03');
      expect(result.rates).toBeDefined();
    });
  });

  describe('get with fluctuation', () => {
    it('should return result with fluctuation', async () => {
      const result = await api.getWithFluctuation({
        start_date: '2021-04-01',
        end_date: '2021-04-03',
        base: 'AED',
      });
      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/fluctuation?start_date=2021-04-01&end_date=2021-04-03&base=AED`,
      );

      expect(result.fluctuation).toStrictEqual(true);
      expect(result.start_date).toStrictEqual('2021-04-01');
      expect(result.end_date).toStrictEqual('2021-04-03');
      expect(result.rates).toBeDefined();
    });
  });

  describe('get VAT rates', () => {
    it('should return result', async () => {
      const result = await api.getVATRates({ symbols: ['FI'] });
      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/vat_rates?symbols=FI`,
      );
      expect(result.rates).toBeDefined();
    });
  });

  describe('get sources', () => {
    it('should return result', async () => {
      const result = await api.getSources();
      expect(fetchSpy.request().input).toBe(
        `https://api.exchangerate.host/sources`,
      );
      expect(result.sources).toBeDefined();
    });
  });
});
