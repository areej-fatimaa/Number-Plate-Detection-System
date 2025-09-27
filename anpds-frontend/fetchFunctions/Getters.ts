import { getCookie } from "@/cookies";

export function getActiveUser(): string | null {
    return getCookie('activeUser');
  }