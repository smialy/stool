import { describe, it } from 'vitest';
import assert from 'node:assert';
import { HttpClient, TusHttpClient } from './src/http';
import { TusClient } from './src/client';
import { createTusClient } from './src/index';
import type { TusClientOptions } from './src/types';

describe('HttpClient', () => {
  it('should throw error for invalid URL', async () => {
    const client = new HttpClient();
    await assert.rejects(() => client.get('invalid-url', {}));
  });
});

describe('TusHttpClient', () => {
  it('should throw error if endpoint is missing', () => {
    assert.throws(() => new TusHttpClient(new HttpClient(), ''));
  });
});

describe('TusClient', () => {
  it('should build metadata correctly', () => {
    const transport = {
      createUpload: async () => '',
      uploadChunk: async () => 0,
      getUploadOffset: async () => 0,
    };
    const client = new TusClient(transport, { metadata: { foo: 'bar' } });
    const file = new Blob(['test'], { type: 'text/plain' });
    const metadata = client.buildMetadata(file);
    assert.ok(metadata && metadata.includes('foo'));
  });
});
