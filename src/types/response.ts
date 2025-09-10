export interface ResponseData {
  [questionName: string]: any;
}

export interface SurveyResponse {
  surveyId: string;
  orgId: string;
  responseJson: ResponseData;
  responseProperties?: ResponseProperties;
  status: ResponseStatus;
  sessionId?: string;
  timestamp?: number;
  duration?: number;
}

export type ResponseStatus = 'COMPLETE' | 'INCOMPLETE' | 'PARTIAL';

export interface ResponseProperties {
  email?: string;
  firstName?: string;
  lastName?: string;
  customerId?: string;
  userId?: string;
  [key: string]: any;
}

export interface ResponseSubmission {
  org_id: number;
  survey_id: string;
  response_json: ResponseData;
  response_properties?: ResponseProperties;
  status: ResponseStatus;
  session_id?: string;
}

export interface ResponseValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SubmissionResult {
  success: boolean;
  responseId?: string;
  error?: string;
  timestamp?: number;
}

export interface OfflineResponse extends SurveyResponse {
  id: string;
  retryCount: number;
  lastRetryAt?: number;
  syncStatus: 'pending' | 'syncing' | 'failed' | 'synced';
}

export function validateResponse(
  responses: ResponseData,
  requiredFields: string[]
): ResponseValidation {
  const errors: Record<string, string> = {};
  let isValid = true;

  requiredFields.forEach(field => {
    const value = responses[field];
    if (value === undefined || value === null || value === '') {
      errors[field] = 'This field is required';
      isValid = false;
    }
  });

  return { isValid, errors };
}

export function formatResponseForSubmission(
  surveyId: string,
  orgId: string,
  responses: ResponseData,
  properties?: ResponseProperties,
  sessionId?: string
): ResponseSubmission {
  return {
    org_id: parseInt(orgId, 10),
    survey_id: surveyId,
    response_json: responses,
    response_properties: properties,
    status: 'COMPLETE',
    session_id: sessionId,
  };
}

export function calculateResponseDuration(
  startTime?: number,
  endTime?: number
): number | undefined {
  if (!startTime || !endTime) return undefined;
  return Math.floor((endTime - startTime) / 1000); // Duration in seconds
}