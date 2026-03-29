const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "";
const BASE = `${API_BASE}/api/admin/drivers`;

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

function toQuery(params) {
  const sp = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    sp.set(key, String(value));
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function listAdminDrivers({
  enabled,
  onlineStatus,
  vehicleType,
  q,
  page = 0,
  size = 20,
  sort = "firstName,asc",
} = {}) {
  const qs = toQuery({
    enabled,
    onlineStatus,
    vehicleType,
    q,
    page,
    size,
    sort,
  });

  return httpJson(`${BASE}${qs}`, { method: "GET" });
}

export function getAdminDriver(driverId) {
  return httpJson(`${BASE}/${driverId}`, { method: "GET" });
}

export function createAdminDriver(payload) {
  return httpJson(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminDriver(driverId, payload) {
  return httpJson(`${BASE}/${driverId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function updateAdminDriverEnabled(driverId, enabled) {
  return httpJson(`${BASE}/${driverId}/enabled`, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}