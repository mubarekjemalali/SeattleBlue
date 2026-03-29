export async function getPublicBooking(token) {
  if (!token) {
    throw new Error("Booking token is missing.");
  }

  const res = await fetch(`/api/bookings/public/${encodeURIComponent(token)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = "Failed to load booking.";
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

export async function cancelPublicBooking(token, reason) {
  if (!token) {
    throw new Error("Booking token is missing.");
  }

  const res = await fetch(`/api/bookings/public/${encodeURIComponent(token)}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason,
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