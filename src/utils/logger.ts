type LogParams = readonly unknown[];

function devLog(level: "info" | "warn" | "error", ...params: LogParams) {
  if (!__DEV__) return;

  if (level === "info") {
    console.info(...params);
    return;
  }

  if (level === "warn") {
    console.warn(...params);
    return;
  }

  console.error(...params);
}

export const logger = {
  info: (...params: LogParams) => devLog("info", ...params),
  warn: (...params: LogParams) => devLog("warn", ...params),
  error: (...params: LogParams) => devLog("error", ...params),
};
