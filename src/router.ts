import { useEffect, useState } from "react";
import type { Route } from "./types";

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, "").replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "dashboard" };
  if (parts[0] === "new") return { name: "prepare" };
  if (parts[0] === "retrospective" && parts[1]) return { name: "retrospective", id: parts[1] };
  if (parts[0] === "retrospectives" && parts[1] && parts[2] === "ongoing") {
    return { name: "ongoing", id: parts[1] };
  }
  return { name: "dashboard" };
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "dashboard":
      return "#/";
    case "prepare":
      return "#/new";
    case "retrospective":
      return `#/retrospective/${encodeURIComponent(route.id)}`;
    case "ongoing":
      return `#/retrospectives/${encodeURIComponent(route.id)}/ongoing`;
  }
}

export function navigate(route: Route): void {
  window.location.hash = routeToHash(route);
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return parseHash(hash);
}
