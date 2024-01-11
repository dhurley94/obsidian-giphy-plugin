export interface ApiClient {
  get(url: string, params: Record<string, any>): Promise<any>;
}

export class GiphyApiClient implements ApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async get(url: string, params: Record<string, any>): Promise<any> {
    const queryString = new URLSearchParams({ ...params, api_key: this.apiKey }).toString();
    const response = await fetch(`${url}?${queryString}`);
    return response.json();
  }
}

export class GiphyService {
  private client: ApiClient;

  private lastKeywordSearch: string;

  private offset: number = 0;

  constructor(client: ApiClient) {
    this.client = client;
  }

  getLastKeyword(): string {
    return this.lastKeywordSearch;
  }

  async queryGiphy(keyword: string, limit = 3): Promise<string[] | null> {
    const GIPHY_API_ENDPOINT = 'https://api.giphy.com/v1/gifs/search';

    if (!keyword) console.warn('No keyword specified');
    if (keyword === this.lastKeywordSearch) this.offset += limit;
    this.lastKeywordSearch = keyword;

    const data = await this.client.get(GIPHY_API_ENDPOINT, { q: keyword, limit, offset: this.offset });

    if (data.data.length === 0) return null;
    
    return data.data.map((gif: { images: { original: { url: string } } }) => gif.images.original.url);
  }
}