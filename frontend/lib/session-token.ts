let currentAccessToken: string | null = null;

export function setAuthAccessToken(accessToken: string | null) {
  currentAccessToken = accessToken;
}

export function getAuthAccessToken() {
  return currentAccessToken;
}
