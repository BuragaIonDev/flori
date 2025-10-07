export function getSessionId(): string {
  let sessionId = localStorage.getItem('flower_shop_session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('flower_shop_session', sessionId);
  }
  return sessionId;
}
