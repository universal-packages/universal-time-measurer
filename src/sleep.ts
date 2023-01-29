/** Simple awaitable timeout to sleep the process */
export default async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve): NodeJS.Timeout => setTimeout((): void => resolve(), milliseconds))
}
