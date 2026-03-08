// src/auth/adminAuth.js

const KEY = "sb_admin_session";

export function setAdminSession(session) {
  // session can be { token, adminName, expiresAt } etc
  localStorage.setItem(KEY, JSON.stringify(session || {}));
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminLoggedIn() {
  const s = getAdminSession();
  if (!s) return false;

  // Optional expiry support
  if (s.expiresAt && Date.now() > Number(s.expiresAt)) {
    clearAdminSession();
    return false;
  }
  return true;
}

export function clearAdminSession() {
  localStorage.removeItem(KEY);
}