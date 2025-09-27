import { setCookie } from "@/cookies";

export function setActiveUser(username: string, days?: number) {
    setCookie('activeUser', username, days);
  }
