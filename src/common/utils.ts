import {matchPath} from "react-router";
import {RedirectError} from "./Errors";

export function checkFastRedirect(pathname: string, rules: Array<{path?: string; exact?: boolean; module: string}>) {
  rules.forEach(route => {
    if (matchPath(pathname, route)) {
      throw new RedirectError("301", route.module);
    }
  });
  return true;
}

export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export type PickOptional2<T> = Pick<T, {[K in keyof T]-?: T[K] extends Exclude<T[K], undefined> ? never : K}[keyof T]>;

export function equal(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  } else if (typeof obj1 !== typeof obj2 || typeof obj1 !== "object") {
    return false;
  } else {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    } else {
      if (keys1.every(key => obj1[key] === obj2[key])) {
        return true;
      } else {
        return JSON.stringify(obj1) === JSON.stringify(obj1);
      }
    }
  }
}
