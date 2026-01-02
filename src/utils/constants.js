export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:7777"
    : "http://ec2-13-60-28-16.eu-north-1.compute.amazonaws.com:7777";
