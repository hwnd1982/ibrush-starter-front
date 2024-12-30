import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "./config";
import { BaseResponse } from "../types/api";

export function checkResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(response);
}

export async function sendRequest<R = void, D = void>(
  url: string,
  body?: D,
  method?: "post" | "get",
  init?: AxiosRequestConfig<D>,
): Promise<AxiosResponse<BaseResponse<R>, any>> {
  if (window.assetsUrl) {
    return axios[method ?? "post"](url, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...init,
    });
  } else {
    return axios[method ?? "get"](url, body, init);
  }
}
