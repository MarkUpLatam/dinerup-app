import { httpClient } from "./httpClient";
import type { Cooperative } from "../types/cooperative";

export async function getCooperatives(): Promise<Cooperative[]> {
  const res = await httpClient<Cooperative[]>("/api/cooperatives", {
    method: "GET",
  });

  return res ?? [];
}
