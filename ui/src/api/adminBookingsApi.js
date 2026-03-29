// src/api/adminBookingsApi.js

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

/**
 * Backend: GET /api/admin/bookings
 * Params supported:
 *  - status (BookingStatus) [optional]
 *  - from, to (ISO LocalDateTime) [optional]
 *  - q (string) [optional]
 *  - pageable: page, size, sort
 *
 * Returns Spring Page:
 *  {
 *    content: [...],
 *    totalElements, totalPages, size, number, ...
 *  }
 */
export function listAdminBookings({
  status,
  from,
  to,
  q,
  page = 0,
  size = 20,
  sort = "pickupTime,desc",
} = {}) {
  const qs = new URLSearchParams();

  if (status) qs.set("status", status);
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  if (q) qs.set("q", q);

  qs.set("page", String(page));
  qs.set("size", String(size));
  qs.set("sort", sort);

  return httpJson(`/api/admin/bookings?${qs.toString()}`, { method: "GET" });
}

// COMPLETING BOOKING
export async function completeAdminBooking(bookingId) {
  const res = await fetch(`/api/admin/bookings/${bookingId}/complete`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = "Failed to complete booking.";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  // if backend returns JSON, keep this:
  try {
    return await res.json();
  } catch {
    return null;
  }
}

//CANCEL BOOKING
export async function cancelAdminBooking(bookingId, cancellationReason) {
  const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancellationReason,
    }),
  });

  if (!res.ok) {
    let message = "Failed to cancel booking.";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}