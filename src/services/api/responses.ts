import { ApiClient, ApiResponse } from './client';
import {
  ResponseSubmission,
  SubmissionResult,
  ResponseData,
  ResponseProperties,
  formatResponseForSubmission,
} from '../../types/response';

const DEFAULT_API_URL = 'https://surveys-backend-1mxy.onrender.com/api/v2';

export class ResponseService {
  private client: ApiClient;
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second

  constructor(apiUrl?: string, apiKey?: string) {
    this.client = new ApiClient({
      baseUrl: apiUrl || DEFAULT_API_URL,
      apiKey,
    });
  }

  /**
   * Submits a survey response
   * @param surveyId - Survey ID
   * @param orgId - Organization ID
   * @param responses - Response data
   * @param properties - Optional response properties
   * @param sessionId - Optional session ID
   * @returns Submission result
   */
  async submitResponse(
    surveyId: string,
    orgId: string,
    responses: ResponseData,
    properties?: ResponseProperties,
    sessionId?: string
  ): Promise<SubmissionResult> {
    const submission = formatResponseForSubmission(
      surveyId,
      orgId,
      responses,
      properties,
      sessionId
    );

    return this.submitWithRetry(surveyId, submission);
  }

  /**
   * Submits a response with retry logic
   * @param surveyId - Survey ID
   * @param submission - Formatted submission data
   * @param attempt - Current attempt number
   * @returns Submission result
   */
  private async submitWithRetry(
    surveyId: string,
    submission: ResponseSubmission,
    attempt: number = 1
  ): Promise<SubmissionResult> {
    try {
      const response = await this.client.post<any>(
        `/surveys/${surveyId}/responses`,
        submission
      );

      if (response.error) {
        // Check if we should retry
        if (attempt < this.maxRetries && this.shouldRetry(response.status)) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          await this.sleep(delay);
          return this.submitWithRetry(surveyId, submission, attempt + 1);
        }

        return {
          success: false,
          error: response.error,
          timestamp: Date.now(),
        };
      }

      return {
        success: true,
        responseId: response.data?.id || response.data?.response_id,
        timestamp: Date.now(),
      };
    } catch (error) {
      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.submitWithRetry(surveyId, submission, attempt + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Submits multiple responses in batch
   * @param surveyId - Survey ID
   * @param orgId - Organization ID
   * @param responses - Array of response data
   * @returns Array of submission results
   */
  async submitBatchResponses(
    surveyId: string,
    orgId: string,
    responses: Array<{
      data: ResponseData;
      properties?: ResponseProperties;
      sessionId?: string;
    }>
  ): Promise<SubmissionResult[]> {
    const results: SubmissionResult[] = [];

    for (const response of responses) {
      const result = await this.submitResponse(
        surveyId,
        orgId,
        response.data,
        response.properties,
        response.sessionId
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Sync offline responses
   * @param responses - Array of offline responses to sync
   * @returns Sync results
   */
  async syncOfflineResponses(
    responses: Array<{
      surveyId: string;
      orgId: string;
      data: ResponseData;
      properties?: ResponseProperties;
      sessionId?: string;
    }>
  ): Promise<{ successful: number; failed: number; results: SubmissionResult[] }> {
    const results: SubmissionResult[] = [];
    let successful = 0;
    let failed = 0;

    for (const response of responses) {
      const result = await this.submitResponse(
        response.surveyId,
        response.orgId,
        response.data,
        response.properties,
        response.sessionId
      );

      results.push(result);
      if (result.success) {
        successful++;
      } else {
        failed++;
      }
    }

    return { successful, failed, results };
  }

  /**
   * Determines if a request should be retried based on status code
   * @param status - HTTP status code
   * @returns Boolean indicating if retry should be attempted
   */
  private shouldRetry(status: number): boolean {
    // Retry on network errors (0), server errors (5xx), and certain client errors
    return status === 0 || status >= 500 || status === 429 || status === 408;
  }

  /**
   * Sleep utility for retry delays
   * @param ms - Milliseconds to sleep
   * @returns Promise that resolves after delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Updates the API configuration
   * @param apiUrl - New API URL
   * @param apiKey - New API key
   */
  updateConfig(apiUrl?: string, apiKey?: string) {
    if (apiUrl || apiKey) {
      this.client.updateConfig({
        baseUrl: apiUrl,
        apiKey,
      });
    }
  }

  /**
   * Sets the maximum number of retry attempts
   * @param maxRetries - Maximum retry attempts
   */
  setMaxRetries(maxRetries: number) {
    this.maxRetries = maxRetries;
  }

  /**
   * Sets the initial retry delay
   * @param delay - Initial delay in milliseconds
   */
  setRetryDelay(delay: number) {
    this.retryDelay = delay;
  }
}

// Singleton instance for convenience
let responseServiceInstance: ResponseService | null = null;

export function getResponseService(apiUrl?: string, apiKey?: string): ResponseService {
  if (!responseServiceInstance) {
    responseServiceInstance = new ResponseService(apiUrl, apiKey);
  } else if (apiUrl || apiKey) {
    responseServiceInstance.updateConfig(apiUrl, apiKey);
  }
  return responseServiceInstance;
}