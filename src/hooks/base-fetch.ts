import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
const baseUrl = "http://202.157.176.100:3001";
export interface IApiRequestServiceProps {
  url: string;
  method: string;
  params?: Record<string, string> | null;
}
export const ContentType = {
  json: "application/json",
};
export const baseOptions = {
  method: "GET", // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    "Content-Type": ContentType.json,
  }),
};
export const apiFetchRequest = async <T>(args: IApiRequestServiceProps) => {
  const { method, params, url: dataUrl } = args;
  const options = {
    ...baseOptions,
    ...args,
    method: method,
  };
  let urlSearchParams = "";
  if (params) {
    urlSearchParams = "?" + new URLSearchParams(params);
  }
  let result;
  const url = `${baseUrl}${dataUrl}${urlSearchParams}`;
  let data: T | null = null;
  try {
    result = await fetch(url, options);
    data = await result.json();
  } catch (error) {
    console.log("🔴 Error", error);
  }

  if (!result?.ok) {
    console.log("🔴 Error", result?.ok, result?.status, data);
    return {
      data: null,
      error: "Something went wrong",
    };
  } else {
    return {
      data: data,
      error: null,
    };
  }
};
