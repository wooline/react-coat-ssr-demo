export class CustomError extends Error {
  constructor(public readonly message: string, public readonly code: string, public readonly detail?: any) {
    super(message);
  }
}

export class RedirectError extends CustomError {
  constructor(code: "301" | "302", detail: string) {
    super("redirect", code, detail);
  }
}
export class UnauthorizedError extends CustomError {
  constructor() {
    super("请登录", "401");
  }
}
