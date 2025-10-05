/**
 * HTTP utility library for common HTTP operations
 */
export class HttpUtils {
  /**
   * Build query string from object
   */
  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  /**
   * Parse query string to object
   */
  static parseQueryString(queryString: string): Record<string, string | string[]> {
    const params = new URLSearchParams(queryString);
    const result: Record<string, string | string[]> = {};

    for (const [key, value] of params.entries()) {
      if (result[key]) {
        if (Array.isArray(result[key])) {
          (result[key] as string[]).push(value);
        } else {
          result[key] = [result[key] as string, value];
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Get file extension from URL
   */
  static getFileExtension(url: string): string {
    const pathname = new URL(url).pathname;
    return pathname.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if response is successful
   */
  static isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }

  /**
   * Get status text from status code
   */
  static getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      204: 'No Content',
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout'
    };

    return statusTexts[status] || 'Unknown Status';
  }

  /**
   * Create FormData from object
   */
  static createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File || value instanceof Blob) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, String(v)));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return formData;
  }

  /**
   * Download file from URL
   */
  static downloadFile(url: string, filename?: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Convert blob to base64
   */
  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Convert base64 to blob
   */
  static base64ToBlob(base64: string, contentType: string = ''): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  /**
   * Check if URL is absolute
   */
  static isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//.test(url);
  }

  /**
   * Join URL paths
   */
  static joinPaths(...paths: string[]): string {
    return paths
      .map(path => path.replace(/^\/+|\/+$/g, ''))
      .filter(path => path.length > 0)
      .join('/');
  }
}
