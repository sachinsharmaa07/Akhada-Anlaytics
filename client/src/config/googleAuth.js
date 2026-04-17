const DEFAULT_GOOGLE_CLIENT_ID = '1004581803165-4dq1ee0aeq27cgj7g3pml3ipjojmt6sd.apps.googleusercontent.com';

export const GOOGLE_CLIENT_ID = (
  process.env.REACT_APP_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID
).trim();

export const GOOGLE_CONFIG_ERROR =
  'Google Sign-In is unavailable. Configure REACT_APP_GOOGLE_CLIENT_ID for this environment.';