
/**
 * Safely stringifies JSON objects with circular references
 */
export const safeStringify = (obj: any, indent: number = 2): string => {
  const cache = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular Reference]';
        }
        cache.add(value);
      }
      return value;
    },
    indent
  );
};

/**
 * Converts a potentially complex object to a simplified version
 * suitable for display or logging
 */
export const simplifyObject = (obj: any, maxDepth: number = 2): any => {
  if (maxDepth <= 0) {
    if (Array.isArray(obj)) {
      return `Array(${obj.length})`;
    }
    if (obj === null) {
      return null;
    }
    if (typeof obj === 'object') {
      return `Object(${Object.keys(obj).length} props)`;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => simplifyObject(item, maxDepth - 1));
  }
  
  if (obj === null) {
    return null;
  }
  
  if (typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[key] = simplifyObject(obj[key], maxDepth - 1);
    }
    return result;
  }
  
  return obj;
};
