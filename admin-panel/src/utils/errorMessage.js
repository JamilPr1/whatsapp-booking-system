export function toErrorMessage(err, fallback = 'Something went wrong') {
  try {
    if (!err) return fallback;

    // If it's already a string
    if (typeof err === 'string') return err;

    // Axios-style errors
    const data = err?.response?.data;
    if (typeof data === 'string') return data;

    // Our APIs usually return { error: "..." }
    if (typeof data?.error === 'string') return data.error;

    // Vercel / platform errors sometimes look like { code, message }
    if (typeof data?.message === 'string') return data.message;

    // Generic Error object
    if (typeof err?.message === 'string') return err.message;

    // Last resort: stringify (but keep it short)
    return JSON.stringify(data || err);
  } catch {
    return fallback;
  }
}

