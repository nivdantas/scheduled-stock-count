export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    if (process.env.INTERNAL_API_URL) return process.env.INTERNAL_API_URL;

    return "http://backend:3000";
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return window.location.origin.includes("localhost")
    ? "http://localhost:3000"
    : window.location.origin;
};
