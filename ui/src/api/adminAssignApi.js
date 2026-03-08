// src/api/adminAssignApi.js

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || ""; // "" when using Vite proxy
const BASE = `${API_BASE}/api/admin/bookings`;

async function httpJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export function getEligibleDrivers(bookingId) {
  return httpJson(`${BASE}/${bookingId}/eligible-drivers`, { method: "GET" });
}

export function assignDriver(bookingId, driverId) {
  return httpJson(`${BASE}/${bookingId}/assign-driver`, {
    method: "PUT",
    body: JSON.stringify({ driverId }),
  });
}