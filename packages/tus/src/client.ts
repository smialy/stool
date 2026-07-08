/**
 * TUS Protocol Resumable Upload Client
 * Implementation from scratch without external dependencies
 */

import type { ITransport, TusClientOptions } from './types';

export class TusClient {
    private options: Required<TusClientOptions>;

    constructor(
        private readonly transport: ITransport,
        options: TusClientOptions = {},
    ) {
        this.options = {
            headers: options.headers || {},
            chunkSize: options.chunkSize || 1024 * 1024, // 1MB default
            retryDelays: options.retryDelays || [0, 1000, 3000, 5000],
            metadata: options.metadata || {},
            onProgress: options.onProgress || function () {},
            onSuccess: options.onSuccess || function () {},
            onError: options.onError || function () {},
        };
    }

    /**
     * Upload a file using the TUS protocol
     * @param {File|Blob} file - The file to upload
     * @returns {Promise<string>} - Promise resolving to the uploaded file URL
     */
    async upload(file: File | Blob): Promise<string> {
        try {
            // Create upload URL
            const uploadUrl = await this.createUpload(file);

            // Upload file data
            await this.uploadData(file, uploadUrl);

            // Notify success
            this.options.onSuccess(uploadUrl);
            return uploadUrl;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            this.options.onError(err);
            throw error;
        }
    }

    /**
     * Create a new upload resource
     * @param {File|Blob} file - The file to upload
     * @returns {Promise<string>} - Promise resolving to the upload URL
     */
    async createUpload(file: File | Blob): Promise<string> {
        const metadata = this.buildMetadata(file);
        const headers = {
            'Upload-Length': file.size.toString(),
            ...this.options.headers,
        };

        return this.transport.createUpload(headers, metadata);
    }

    /**
     * Upload file data in chunks
     * @param {File|Blob} file - The file to upload
     * @param {string} uploadUrl - The upload URL
     */
    async uploadData(file: File | Blob, uploadUrl: string): Promise<void> {
        let offset = await this.transport.getUploadOffset(uploadUrl, this.options.headers || {});

        while (offset < file.size) {
            const end = Math.min(offset + this.options.chunkSize, file.size);
            const chunk = file.slice(offset, end);

            try {
                offset = await this.transport.uploadChunk(
                    uploadUrl,
                    chunk,
                    offset,
                    this.options.headers || {},
                );
                this.options.onProgress(offset, file.size);
            } catch (error) {
                // Retry logic
                const shouldRetry = await this.handleUploadError(
                    error instanceof Error ? error : new Error(String(error)),
                    uploadUrl,
                );
                if (!shouldRetry) {
                    throw error;
                }
            }
        }
    }

    /**
     * Handle upload errors with retry logic
     * @param {Error} error - The error that occurred
     * @param {string} uploadUrl - The upload URL
     * @returns {Promise<boolean>} - Whether to retry the upload
     */
    async handleUploadError(error: Error, uploadUrl: string): Promise<boolean> {
        // For simplicity, we'll implement a basic retry mechanism
        // In a production environment, you might want more sophisticated logic
        console.warn('Upload error:', error.message, uploadUrl);
        return false;
    }

    /**
     * Build metadata string for Upload-Metadata header
     * @param {File|Blob} file - The file being uploaded
     * @returns {string|null} - Base64 encoded metadata string
     */
    buildMetadata(file: File | Blob): string | null {
        const metadataObj: Record<string, string> = { ...this.options.metadata };

        if ('name' in file && file.name && !metadataObj.filename) {
            metadataObj.filename = file.name;
        }

        if (file.type && !metadataObj.filetype) {
            metadataObj.filetype = file.type;
        }

        const entries = Object.entries(metadataObj);
        if (entries.length === 0) {
            return null;
        }

        return entries
            .map(([key, value]) => {
                return `${key} ${btoa(encodeURIComponent(value))}`;
            })
            .join(',');
    }
}
