import { httpClient } from "./httpClient";
import type { Cooperative } from "../types/cooperative";

const COOP_API = import.meta.env.VITE_API_COOPERATIVE; // http://localhost:8080/api

export async function getCooperatives(): Promise<Cooperative[]> {
  const res = await httpClient<Cooperative[]>("/cooperatives", {
    method: "GET",
    baseUrl: COOP_API,
  });

  return res ?? [];
}
