import DefaultResponseValidator from './utils/ResponseValidator';
import DefaultResponseDeserializer from './utils/ResponseDeserializer';
import {
  BaseQuery,
  ConvertResponse,
  CurrencyRateResponse,
  CurrencySymbolsResponse,
  FluctuationCurrencyRatesResponse,
  OutputFormat,
  SdkConfig,
  SourcesResponse,
  TimeSeriesCurrencyRatesResponse,
  VATRatesResponse,
} from './Api.types';

import * as qs from 'qs';

export class ExchangerateHostApi {
  private configuration: SdkConfig;
  private validator = new DefaultResponseValidator();
  private deserializer = new DefaultResponseDeserializer();

  private constructor(config?: Partial<SdkConfig>) {
    this.configuration = this.initialize(config);
  }

  public static create(config?: Partial<SdkConfig>): ExchangerateHostApi {
    return new ExchangerateHostApi(config);
  }

  /**
   * Get list of available currencies
   */
  public async getSymbols(query?: {
    format?: OutputFormat;
  }): Promise<CurrencySymbolsResponse> {
    return this.makeRequest<CurrencySymbolsResponse>(
      `symbols${this.getQueryString(query)}`,
    );
  }

  /**
   * Get latest currency rate
   */
  public async getLatest(query?: BaseQuery): Promise<CurrencyRateResponse> {
    const string = this.getQueryString(query);
    return this.makeRequest<CurrencyRateResponse>(`latest${string}`);
  }

  /**
   * Convert currency
   */
  public async convert(
    query: {
      from: string;
      to: string;
      date?: string;
    } & BaseQuery,
  ): Promise<ConvertResponse> {
    return this.makeRequest<ConvertResponse>(
      `convert${this.getQueryString(query)}`,
    );
  }

  /**
   * Get currency rate for specific date
   */
  public async getByDate(
    date: string,
    query?: BaseQuery,
  ): Promise<CurrencyRateResponse> {
    return this.makeRequest<CurrencyRateResponse>(
      `${date}${this.getQueryString(query)}`,
    );
  }

  public async getByDateRange(
    query: {
      start_date: string;
      end_date: string;
    } & BaseQuery,
  ): Promise<TimeSeriesCurrencyRatesResponse> {
    const string = this.getQueryString(query);
    return this.makeRequest<TimeSeriesCurrencyRatesResponse>(
      `timeseries${string}`,
    );
  }

  public async getWithFluctuation(
    query: {
      start_date: string;
      end_date: string;
    } & BaseQuery,
  ): Promise<FluctuationCurrencyRatesResponse> {
    return this.makeRequest<FluctuationCurrencyRatesResponse>(
      `fluctuation${this.getQueryString(query)}`,
    );
  }

  public async getVATRates(query?: {
    symbols?: string[];
    format?: OutputFormat;
  }): Promise<VATRatesResponse> {
    return this.makeRequest<VATRatesResponse>(
      `vat_rates${this.getQueryString(query)}`,
    );
  }

  public async getSources(): Promise<SourcesResponse> {
    return this.makeRequest<SourcesResponse>(`sources`);
  }

  private async makeRequest<R>(url: string): Promise<R> {
    const fullUrl = this.configuration.url + url;

    const opts: RequestInit = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    };

    const result = await this.configuration.fetch(fullUrl, opts);

    await this.validator.validateResponse(result);
    return this.deserializer.deserialize<R>(result).then((result) => {
      if (!result) {
        throw new Error('Unable to deserialize content');
      }

      return result;
    });
  }

  private getQueryString(args?: unknown): string {
    if (!args) {
      return '';
    }

    return `?${qs.stringify(args, {
      arrayFormat: 'comma',
      encode: false,
    })}`;
  }

  private initialize(config?: Partial<SdkConfig>) {
    const defaultConfig: SdkConfig = {
      fetch: (req: RequestInfo | URL, init: RequestInit | undefined) =>
        fetch(req, init),
      url: 'https://api.exchangerate.host/',
    };

    return { ...defaultConfig, ...config };
  }
}
