export interface TusClientOptions {
    headers?: Record<string, string>;
    chunkSize?: number;
    retryDelays?: number[];
    metadata?: Record<string, string>;
    onProgress?: (loaded: number, total: number) => void;
    onSuccess?: (uploadUrl: string) => void;
    onError?: (error: Error) => void;
}

export interface ITransport {
    createUpload(headers: Record<string, string>, metadata?: string | null): Promise<string>;
    uploadChunk(url: string, chunk: Blob, offset: number, headers: Record<string, string>): Promise<number>;
    getUploadOffset(url: string, headers: Record<string, string>): Promise<number>;
}

export interface MakeRequestOptions {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: BodyInit;
}
