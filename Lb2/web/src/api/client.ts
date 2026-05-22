import axios from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    errorMessage?: string;
  }

  interface InternalAxiosRequestConfig {
    errorMessage?: string;
  }
}

export const apiBaseUrl: string = "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 10000,
});

function createRequestError(error: unknown): Error {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return new Error(error.message, { cause: error });
    }

    return new Error("Unknown request error", { cause: error });
  }

  const requestErrorMessage = error.config?.errorMessage ?? "Request failed";
  const responseBody =
    typeof error.response?.data === "string"
      ? error.response.data
      : JSON.stringify(error.response?.data);
  const statusCode = error.response?.status ?? "unknown";

  return new Error(
    `${requestErrorMessage}: status=${statusCode}; body=${responseBody}; ${error.message}`,
    {
      cause: error,
    },
  );
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    throw createRequestError(error);
  },
);
