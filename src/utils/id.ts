export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return prefix ? `${prefix}_${time}${random}` : `${time}${random}`;
}

export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
