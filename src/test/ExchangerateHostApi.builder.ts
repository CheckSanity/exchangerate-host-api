import { ExchangerateHostApi } from '../ExchangerateHostApi';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class FetchApiSpy {
  private issuedRequests: {
    input: RequestInfo | URL;
    init?: RequestInit;
  }[] = [];

  constructor(readonly logResults: boolean = false) {}

  public async fetch(
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ): Promise<Response> {
    this.issuedRequests.push({ input, init });
    const result = fetch(input, init);

    if (this.logResults) {
      const awaited = await result;
      const clone = awaited.clone();

      if (!fs.existsSync('temp')) {
        fs.mkdirSync('temp');
      }

      const uniqueId = uuidv4();
      const bodyText = await clone.text();

      const fileContents = `
// URL: ${awaited.url}
// Status: ${awaited.status}
// Status Text: ${awaited.statusText}

${bodyText}`.trim();

      fs.writeFileSync(`temp/${uniqueId}.json`, fileContents);

      return awaited;
    }

    return result;
  }

  public request() {
    return this.issuedRequests[0];
  }

  public lastRequest() {
    return this.issuedRequests[this.issuedRequests.length - 1];
  }
}

export function buildIntegrationTestApiInstance(
  logResults: boolean = false,
): [ExchangerateHostApi, FetchApiSpy] {
  const fetchSpy = new FetchApiSpy(logResults);

  const sdkInstance = ExchangerateHostApi.create({
    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
      return fetchSpy.fetch(input, init);
    },
  });

  return [sdkInstance, fetchSpy];
}
