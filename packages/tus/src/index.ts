import { TusClient } from './client';
import { HttpClient, TusHttpClient } from './http';
import type { TusClientOptions } from './types';

export function createTusClient(endpoint: string, options: TusClientOptions = {}): TusClient {
    return new TusClient(new TusHttpClient(new HttpClient(), endpoint), options);
}
