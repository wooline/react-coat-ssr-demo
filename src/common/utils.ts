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
      let result = true;
      for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
          result = false;
          if (typeof obj1[key] !== "object" || typeof obj2[key] !== "object") {
            return false;
          }
        }
      }
      if (result) {
        return true;
      } else {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
      }
    }
  }
}
export function reference(data: any) {
  return data;
}
