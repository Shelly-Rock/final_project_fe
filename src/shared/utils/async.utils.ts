// Tạm dừng thực thi trong khoảng thời gian chỉ định.
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Chia mảng thành các mảng con theo kích thước xác định.
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
// Giới hạn thời gian thực thi của một Promise.
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = "Operation timed out",
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs),
    ),
  ]);
}
// Tùy chọn cấu hình cho cơ chế retry.
export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: "linear" | "exponential";
  factor?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}
// Thực hiện gọi lại hàm khi xảy ra lỗi theo số lần cấu hình.
export async function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = "exponential",
    factor = 2,
    maxDelayMs = 30000,
    shouldRetry = () => true,
  } = options ?? {};
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }
      if (!shouldRetry(error, attempt)) {
        break;
      }
      const calculatedDelay = calculateDelay(
        attempt,
        delayMs,
        backoff,
        factor,
        maxDelayMs,
      );
      await sleep(calculatedDelay);
    }
  }
  throw lastError;
}
// Tính thời gian chờ giữa các lần retry.
function calculateDelay(
  attempt: number,
  baseDelayMs: number,
  backoff: "linear" | "exponential",
  factor: number,
  maxDelayMs: number,
): number {
  let delay: number;
  if (backoff === "exponential") {
    delay = baseDelayMs * Math.pow(factor, attempt);
  } else {
    delay = baseDelayMs * (attempt + 1);
  }
  return Math.min(delay, maxDelayMs);
}
// Thực thi các tác vụ bất đồng bộ theo thứ tự tuần tự.
export async function sequential<T>(
  tasks: Array<() => Promise<T>>,
): Promise<T[]> {
  const results: T[] = [];
  for (const task of tasks) {
    results.push(await task());
  }
  return results;
}
// Thực thi nhiều tác vụ song song với giới hạn số lượng đồng thời.
export async function parallel<T>(
  tasks: Array<() => Promise<T>>,
  concurrency = 5,
  stopOnError = true,
): Promise<T[]> {
  if (concurrency <= 0) concurrency = tasks.length;
  const results: T[] = new Array(tasks.length);
  let currentIndex = 0;
  let hasError = false;
  let firstError: unknown = null;

  async function runNext(): Promise<void> {
    while (true) {
      if (stopOnError && hasError) break;

      const index = currentIndex++;
      if (index >= tasks.length) break;

      try {
        results[index] = await tasks[index]();
      } catch (error) {
        if (stopOnError) {
          hasError = true;
          firstError = error;
          break;
        }
        // Nếu không stop on error, throw lỗi nhưng vẫn tiếp tục các task khác
        results[index] = undefined as T;
        console.error(`Task ${index} failed:`, error);
      }
    }
  }

  const workers: Promise<void>[] = [];
  const workerCount = Math.min(concurrency, tasks.length);

  for (let i = 0; i < workerCount; i++) {
    workers.push(runNext());
  }

  await Promise.all(workers);

  if (stopOnError && hasError) {
    throw firstError;
  }

  return results;
}
// Xử lý dữ liệu theo từng lô (batch).
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options?: { batchSize?: number; delayMs?: number },
): Promise<R[]> {
  const { batchSize = 10, delayMs = 0 } = options ?? {};
  const results: R[] = [];
  const batches = chunk(items, batchSize);
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    if (delayMs > 0 && batches.indexOf(batch) < batches.length - 1) {
      await sleep(delayMs);
    }
  }
  return results;
}
// Tùy chọn cấu hình cho cơ chế polling.
export interface PollOptions {
  intervalMs?: number;
  maxAttempts?: number;
  timeoutMs?: number;
  onPoll?: (attempt: number) => void;
}
// Kiểm tra định kỳ cho đến khi nhận được kết quả hợp lệ.
export async function poll<T>(
  fn: () => Promise<T>,
  options?: PollOptions,
): Promise<T> {
  const {
    intervalMs = 1000,
    maxAttempts = Infinity,
    timeoutMs,
    onPoll,
  } = options ?? {};
  const startTime = Date.now();
  let attempts = 0;
  while (attempts < maxAttempts) {
    if (timeoutMs && Date.now() - startTime > timeoutMs) {
      throw new Error("Polling timed out");
    }
    const result = await fn();
    attempts++;
    onPoll?.(attempts);
    if (result) {
      return result;
    }
    await sleep(intervalMs);
  }
  throw new Error(`Polling stopped after ${attempts} attempts`);
}
// Tùy chọn cấu hình cho hàng đợi bất đồng bộ.
export interface QueueOptions<T> {
  concurrency?: number;
  retry?: boolean;
  onItemComplete?: (item: T, result: unknown) => void;
  onItemError?: (item: T, error: Error) => void;
}
// Tùy chọn cấu hình cho hàm waitFor.
export interface WaitForOptions {
  timeoutMs?: number;
  intervalMs?: number;
  throwOnTimeout?: boolean;
  timeoutMessage?: string;
}
// Chờ đến khi điều kiện thỏa mãn hoặc hết thời gian chờ.
export async function waitFor<T>(
  condition: () => T | Promise<T>,
  options?: WaitForOptions,
): Promise<T> {
  const {
    timeoutMs = 5000,
    intervalMs = 100,
    throwOnTimeout = true,
    timeoutMessage,
  } = options ?? {};
  const startTime = Date.now();
  while (true) {
    const result = await condition();
    if (result) {
      return result as T;
    }
    if (Date.now() - startTime > timeoutMs) {
      if (throwOnTimeout) {
        throw new Error(timeoutMessage ?? "Condition not met within timeout");
      }
      return undefined as T;
    }
    await sleep(intervalMs);
  }
}
