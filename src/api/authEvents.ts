export const AUTH_UNAUTHORIZED_EVENT = "app:auth-unauthorized";
let hasPendingUnauthorizedEvent = false;

export function emitUnauthorizedEvent() {
  if (typeof window === "undefined") {
    return;
  }

  if (hasPendingUnauthorizedEvent) {
    return;
  }

  hasPendingUnauthorizedEvent = true;
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}

export function resetUnauthorizedEventState() {
  hasPendingUnauthorizedEvent = false;
}
