import type { ITransport } from './types';

type BodyInit = string | FormData | Blob | File | ArrayBuffer | ReadableStream<Uint8Array>;

interface HttpRequestOptions {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: BodyInit | undefined;
}

export class HttpClient {
    private async _request(options: HttpRequestOptions): Promise<Response> {
        try {
            const response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body || null,
            });
            return response;
        } catch (error) {
            throw new Error(
                `Network error: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async post(url: string, headers: Record<string, string>, body?: BodyInit): Promise<Response> {
        return this._request({ url, method: 'POST', headers, body });
    }

    async patch(url: string, headers: Record<string, string>, body?: BodyInit): Promise<Response> {
        return this._request({ url, method: 'PATCH', headers, body });
    }

    async head(url: string, headers: Record<string, string>): Promise<Response> {
        return this._request({ url, method: 'HEAD', headers });
    }

    async get(url: string, headers: Record<string, string>): Promise<Response> {
        return this._request({ url, method: 'GET', headers });
    }
}

export class TusHttpClient implements ITransport {
    constructor(
        private httpClient: HttpClient,
        private readonly endpoint: string,
    ) {
        if (!endpoint) {
            throw new Error('Endpoint is required');
        }
    }

    async createUpload(headers: Record<string, string>, metadata?: string | null): Promise<string> {
        const requestHeaders: Record<string, string> = {
            'Tus-Resumable': '1.0.0',
            ...headers,
        };

        if (metadata) {
            requestHeaders['Upload-Metadata'] = metadata;
        }

        const response = await this.httpClient.post(this.endpoint, requestHeaders);

        if (response.status !== 201) {
            throw new Error(`Failed to create upload: ${response.status} ${response.statusText}`);
        }

        const location = response.headers.get('Location');
        if (!location) {
            throw new Error('Missing Location header in response');
        }

        return location;
    }

    async uploadChunk(
        url: string,
        chunk: Blob,
        offset: number,
        headers: Record<string, string>,
    ): Promise<number> {
        const requestHeaders: Record<string, string> = {
            'Tus-Resumable': '1.0.0',
            'Content-Type': 'application/offset+octet-stream',
            'Upload-Offset': offset.toString(),
            ...headers,
        };

        const response = await this.httpClient.patch(url, requestHeaders, chunk);

        if (response.status === 204) {
            const newOffsetStr = response.headers.get('Upload-Offset');
            if (newOffsetStr === null) {
                throw new Error("Server didn't return Upload-Offset header");
            }
            const newOffset = parseInt(newOffsetStr, 10);
            if (Number.isNaN(newOffset)) {
                throw new Error("Server didn't return valid Upload-Offset header");
            }
            return newOffset;
        } else if (response.status === 409) {
            // Conflict, need to get current offset
            const currentOffset = await this.getUploadOffset(url, headers);
            return currentOffset;
        } else {
            throw new Error(`Failed to upload chunk: ${response.status} ${response.statusText}`);
        }
    }

    async getUploadOffset(url: string, headers: Record<string, string>): Promise<number> {
        const requestHeaders: Record<string, string> = {
            'Tus-Resumable': '1.0.0',
            Accept: 'application/offset+octet-stream',
            ...headers,
        };

        const response = await this.httpClient.head(url, requestHeaders);

        if (response.status !== 200) {
            throw new Error(
                `Failed to get upload offset: ${response.status} ${response.statusText}`,
            );
        }

        const offsetStr = response.headers.get('Upload-Offset');
        if (offsetStr === null) {
            throw new Error('Missing Upload-Offset header in response');
        }

        const offset = parseInt(offsetStr, 10);
        if (Number.isNaN(offset)) {
            throw new Error('Invalid Upload-Offset header value');
        }

        return offset;
    }
}
