import { Nullable } from './utils/Nullable';

export type SdkConfig = {
  url: string;
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

export type CurrencySymbolsResponse = {
  symbols: Record<string, CurrencySymbol>;
};

export type CurrencySymbol = {
  description: string;
  code: string;
};

export type CurrencyRateResponse = {
  historical?: boolean;
  base: string;
  date: string;
  rates: CurrencyRate;
};

export type CurrencyRate = Record<string, number>;

export type TimeSeriesCurrencyRatesResponse = {
  timeseries: boolean;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, CurrencyRate>;
};

export type FluctuationCurrencyRatesResponse = {
  fluctuation: boolean;
  start_date: string;
  end_date: string;
  rates: Record<string, FluctuationRate>;
};

export type FluctuationRate = {
  start_rate: 0.016158;
  endRate: 0.016207;
  change: -0.000049;
  change_pct: -0.003033;
};

export type ConvertResponse = {
  query: {
    from: string;
    to: string;
    amount: number;
  };
  info: {
    rate: Nullable<number>;
  };
  historical: boolean;
  date: string;
  result: Nullable<number>;
};

export type SourcesResponse = {
  sources: Record<string, CurrencySource>;
};

export type CurrencySource = {
  description: string;
  source: string;
  name: string;
  source_url: string;
  available_from_date: string;
};

export type VATRatesResponse = {
  rates: Record<string, VATRate>;
};

export type VATRate = {
  country_name: string;
  standard_rate: number;
  reduced_rates: number[];
  super_reduced_rates: number[];
  parking_rates: number[];
};

export type OutputFormat = 'tsv' | 'csv' | 'xml';

export type DataSource = 'ecb' | 'crypto';

export type BaseQuery = {
  base?: string;
  symbols?: string[];
  amount?: number;
  places?: number;
  format?: OutputFormat;
  source?: DataSource;
};
