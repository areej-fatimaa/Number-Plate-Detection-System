export function setCookie(name: string, value: string, days?: number) {
    if (typeof window !== "undefined") {
      let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
      if (days !== undefined) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        cookieString += `; expires=${expires}`;
      }
      document.cookie = cookieString;
    }
  }
  
  export function getCookie(name: string): string | null {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find(c => c.startsWith(name + '='));
      return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    }
    return null;
  }
  
  export function getCookiesJSON(name: string): Record<string, boolean> {
    const cookies: Record<string, boolean> = {};
    if (typeof window !== "undefined") {
      document.cookie.split('; ').forEach(cookie => {
        const [cookieName, value] = cookie.split('=');
        if (decodeURIComponent(cookieName) === name) {
          cookies[decodeURIComponent(cookieName)] = !!value;
        }
      });
    }
    console.log(":)"+JSON.stringify(cookies));
    return cookies;
  }
  
  export function deleteCookie(name: string) {
    if (typeof window !== "undefined") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
  
  export function safeJSONParse<T>(data: string | null): T | null {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }