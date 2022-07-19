/** Simple waitable timeout to sleep the process */
export default async function sleep(time: number): Promise<void> {
  return new Promise((resolve): NodeJS.Timeout => setTimeout((): void => resolve(), time))
}
