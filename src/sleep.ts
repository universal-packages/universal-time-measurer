import ms, { StringValue } from 'ms'

export class Sleep {
  public static async for(timeString: StringValue): Promise<void> {
    const duration = ms(timeString)
    return new Promise((resolve) => setTimeout(resolve, duration))
  }
}
