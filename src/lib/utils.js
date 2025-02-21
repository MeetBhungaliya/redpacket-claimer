import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getURL(fetchString) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof fetchString !== "string") {
        reject(new Error("Invalid input: fetchString must be a string."));
        return;
      }

      const urlPattern = /"(https:\/\/[^\s]+)"/;
      const urlMatch = fetchString.match(urlPattern);

      if (!urlMatch) {
        reject(new Error("URL not found in the provided fetch string."));
        return;
      }

      resolve(urlMatch[1]);
    } catch (error) {
      reject(new Error("Error in getURL function: " + error.message));
    }
  });
}

export function getHeaders(fetchString) {
  return new Promise((resolve, reject) => {
    try {
      const headersPattern = /"headers":\s*({.*?})\s*,\s*"body":/s;
      const headersMatch = fetchString.match(headersPattern);

      if (!headersMatch) {
        throw new Error("No headers found in the fetch string");
      }

      const arr = headersMatch[1].split(/\r?\n/);

      function split_at_index(string, index, isLast) {
        const removeQuote = (str, isValue = false) => {
          const removeFromLastIndex = isValue ? (isLast ? 1 : 2) : 1;

          const removeSpaces = str.trim();

          return removeSpaces
            .substring(1, removeSpaces.length - removeFromLastIndex)
            .trim();
        };

        const key = string.substring(0, index);
        const value = string.substring(index + 1);

        return [removeQuote(key), removeQuote(value, true)];
      }

      const header = arr
        .slice(1, arr.length - 1)
        .reduce((acc, curr, index, array) => {
          const [key, value] = split_at_index(
            curr,
            curr.indexOf(":"),
            array.length - 1 === index
          );

          if (key && value) {
            acc[key] = value.trim();
          }

          return acc;
        }, {});

      resolve(header);
    } catch (error) {
      reject(`Error extracting headers: ${error.message}`);
    }
  });
}
