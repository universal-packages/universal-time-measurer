# Time Measurer

[![npm version](https://badge.fury.io/js/@universal-packages%2Ftime-measurer.svg)](https://www.npmjs.com/package/@universal-packages/time-measurer)
[![Testing](https://github.com/universal-packages/universal-time-measurer/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-time-measurer/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-time-measurer/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-time-measurer)

Time Measurer is a simple wrap for `process.hrtime.bigint` to measure time with procession and express that time easily through formatted representations, anytime you want to express how much a query or a request took at code level you may want to give this a try.

# Getting Started

```shell
npm install @universal-packages/time-measurer
```

# Usage

## TimeMeasurer `class`

The `TimeMeasurer` class is a simple utility for measuring time with precision. It wraps `process.hrtime.bigint()` for Node.js environments and falls back to `performance.now()` in browser environments.

```ts
import { TimeMeasurer } from '@universal-packages/time-measurer'

const measurer = TimeMeasurer.start()
// ... some operation
const measurement = measurer.finish()

console.log(measurement.toString()) // "123.456ms"
```

### Constructor <small><small>`constructor`</small></small>

```ts
new TimeMeasurer()
```

Creates a new TimeMeasurer instance. The measurer is not started automatically.

### Instance Methods

#### start

```ts
start(): void
```

Starts the time measurement. This method will throw an error if the measurer has already been started.

```ts
const measurer = new TimeMeasurer()
measurer.start()
// ... some operation
const measurement = measurer.finish()
```

#### finish

```ts
finish(): Measurement
```

Finishes the time measurement and returns a `Measurement` instance containing the elapsed time.

```ts
const measurer = new TimeMeasurer()
measurer.start()
// ... some operation
const measurement = measurer.finish()
```

### Static Methods

#### start

```ts
static start(): TimeMeasurer
```

Creates a new TimeMeasurer instance and immediately starts it. This is a convenience method for quick measurements.

```ts
const measurer = TimeMeasurer.start()
// ... some operation
const measurement = measurer.finish()
```

## Measurement `class`

The `Measurement` class represents a measured time duration with various formatting options, convenient accessors for different time units, arithmetic operations, and comparison capabilities.

```ts
import { Measurement, TimeMeasurer } from '@universal-packages/time-measurer'

const measurer = TimeMeasurer.start()
// ... some operation
const measurement = measurer.finish()

console.log(measurement.hours) // 0
console.log(measurement.minutes) // 0
console.log(measurement.seconds) // 1
console.log(measurement.milliseconds) // 234.567

// Arithmetic operations
const measurement1 = new Measurement(1000000000n) // 1 second
const measurement2 = new Measurement(2000000000n) // 2 seconds

const sum = measurement1.add(measurement2)
console.log(sum.toString()) // "3.000sec"

// Comparison operations
console.log(measurement1 < measurement2) // true
console.log(measurement1.lessThan(measurement2)) // true
```

### Constructor <small><small>`constructor`</small></small>

```ts
new Measurement(nanoseconds: bigint)
```

Creates a new Measurement instance from nanoseconds. This is typically called internally by TimeMeasurer.

### Properties

- **`hours`**: `number` - The hours component of the measurement
- **`minutes`**: `number` - The minutes component of the measurement
- **`seconds`**: `number` - The seconds component of the measurement
- **`milliseconds`**: `number` - The milliseconds component (including fractional part)
- **`nanoseconds`**: `bigint` - The total nanoseconds of the measurement

### Instance Methods

#### Arithmetic Operations

##### add

```ts
add(other: Measurement): Measurement
```

Adds another measurement to this one and returns a new measurement with the sum of both times.

```ts
const measurement1 = new Measurement(1000000000n) // 1 second
const measurement2 = new Measurement(500000000n)  // 0.5 seconds
const sum = measurement1.add(measurement2)
console.log(sum.toString()) // "1.500sec"
```

##### subtract

```ts
subtract(other: Measurement): Measurement
```

Subtracts another measurement from this one and returns a new measurement with the difference. If the result would be negative, returns a zero measurement.

```ts
const measurement1 = new Measurement(2000000000n) // 2 seconds
const measurement2 = new Measurement(500000000n)  // 0.5 seconds
const difference = measurement1.subtract(measurement2)
console.log(difference.toString()) // "1.500sec"

// Negative results are clamped to zero
const negative = measurement2.subtract(measurement1)
console.log(negative.toString()) // "0.00ms"
```

#### Comparison Methods

##### equals

```ts
equals(other: Measurement): boolean
```

Checks if this measurement is equal to another measurement.

```ts
const measurement1 = new Measurement(1000000000n)
const measurement2 = new Measurement(1000000000n)
console.log(measurement1.equals(measurement2)) // true
```

##### lessThan

```ts
lessThan(other: Measurement): boolean
```

Checks if this measurement is less than another measurement.

```ts
const measurement1 = new Measurement(500000000n)  // 0.5 seconds
const measurement2 = new Measurement(1000000000n) // 1 second
console.log(measurement1.lessThan(measurement2)) // true
```

##### greaterThan

```ts
greaterThan(other: Measurement): boolean
```

Checks if this measurement is greater than another measurement.

```ts
console.log(measurement2.greaterThan(measurement1)) // true
```

##### lessThanOrEqual

```ts
lessThanOrEqual(other: Measurement): boolean
```

Checks if this measurement is less than or equal to another measurement.

##### greaterThanOrEqual

```ts
greaterThanOrEqual(other: Measurement): boolean
```

Checks if this measurement is greater than or equal to another measurement.

#### Operator Overloading

The `Measurement` class supports JavaScript's native comparison and arithmetic operators through `Symbol.toPrimitive`:

```ts
const measurement1 = new Measurement(1000000000n) // 1 second
const measurement2 = new Measurement(2000000000n) // 2 seconds

// Comparison operators (recommended)
console.log(measurement1 < measurement2)  // true
console.log(measurement1 > measurement2)  // false
console.log(measurement1 <= measurement2) // true
console.log(measurement1 >= measurement2) // false
console.log(measurement1 == measurement2) // false
console.log(measurement1 != measurement2) // true

// Arithmetic operators (returns numbers in nanoseconds)
console.log(measurement1 + measurement2) // 3000000000 (nanoseconds)
console.log(measurement2 - measurement1) // 1000000000 (nanoseconds)

// For arithmetic operations that return Measurement objects, use methods:
const sum = measurement1.add(measurement2)     // Returns Measurement
const diff = measurement2.subtract(measurement1) // Returns Measurement
```

#### Method Chaining

All arithmetic methods return new `Measurement` instances, allowing for method chaining:

```ts
const base = new Measurement(1000000000n)    // 1 second
const half = new Measurement(500000000n)     // 0.5 seconds
const quarter = new Measurement(250000000n)  // 0.25 seconds

const result = base.add(half).subtract(quarter)
console.log(result.toString()) // "1.250sec"
```

#### toString

```ts
toString(format?: TimeFormat): string
```

Converts the measurement to a formatted string representation.

```ts
const measurement = new Measurement(1234567890n)

console.log(measurement.toString('Human')) // "1.234sec"
console.log(measurement.toString('Condensed')) // "1.234"
console.log(measurement.toString('Expressive')) // "1.234 Seconds"
```

##### TimeFormat

- **`'Human'`** (default): User-friendly format like "1.234sec", "2min 30.500sec", "1hrs 15min 30.250sec"
- **`'Condensed'`**: Compact format like "1.234", "02:30.500", "01:15:30.250"
- **`'Expressive'`**: Verbose format like "1.234 Seconds", "2 Minutes, and 30.500 Seconds"

#### toDate

```ts
toDate(): Date
```

Converts the measurement to a JavaScript Date object with the time components.

```ts
const measurement = new Measurement(3661000000000n) // 1 hour, 1 minute, 1 second
const date = measurement.toDate()
console.log(date.getHours()) // 1
console.log(date.getMinutes()) // 1
console.log(date.getSeconds()) // 1
```

## Benchmark `class`

The `Benchmark` class provides functionality for running performance benchmarks with support for multiple iterations, warmup runs, and statistical analysis.

```ts
import { Benchmark } from '@universal-packages/time-measurer'

const benchmark = new Benchmark({
  iterations: 1000,
  warmupIterations: 100,
  name: 'Array sorting benchmark'
})

const result = benchmark.run(() => {
  const arr = Array.from({ length: 1000 }, () => Math.random())
  arr.sort()
})

console.log(`Average: ${result.average.toString()}`)
console.log(`Min: ${result.min.toString()}`)
console.log(`Max: ${result.max.toString()}`)
```

### Constructor <small><small>`constructor`</small></small>

```ts
new Benchmark(options?: BenchmarkOptions)
```

Creates a new Benchmark instance with the specified options.

#### BenchmarkOptions

- **`iterations`**: `number` (default: `1`)
  Number of iterations to run for the actual benchmark measurement.
- **`warmupIterations`**: `number` (default: `0`)
  Number of warmup iterations to run before the actual measurement to stabilize performance.
- **`name`**: `string` (default: `'Unnamed Benchmark'`)
  A descriptive name for the benchmark.

### Instance Methods

#### run

```ts
run(fn: () => void): BenchmarkResult
```

Runs a synchronous function benchmark and returns detailed results including statistics.

```ts
const benchmark = new Benchmark({ iterations: 100 })

const result = benchmark.run(() => {
  // Your code to benchmark
  heavyComputation()
})

console.log(`Completed ${result.iterations} iterations`)
console.log(`Average time: ${result.average.toString()}`)
```

#### runAsync

```ts
runAsync(fn: () => Promise<void>): Promise<BenchmarkResult>
```

Runs an asynchronous function benchmark and returns detailed results including statistics.

```ts
const benchmark = new Benchmark({ iterations: 50 })

const result = await benchmark.runAsync(async () => {
  // Your async code to benchmark
  await asyncOperation()
})

console.log(`Average time: ${result.average.toString()}`)
```

#### BenchmarkResult

The result object returned by `run()` and `runAsync()` contains:

- **`name`**: `string` - Name of the benchmark
- **`iterations`**: `number` - Number of iterations performed
- **`warmupIterations`**: `number` - Number of warmup iterations performed
- **`measurements`**: `Measurement[]` - Array of all individual measurements
- **`min`**: `Measurement` - Fastest measurement
- **`max`**: `Measurement` - Slowest measurement
- **`average`**: `Measurement` - Average of all measurements
- **`total`**: `Measurement` - Total time for all iterations

## TimeProfiler `class`

The `TimeProfiler` class provides advanced profiling capabilities with named checkpoints, memory tracking, and session management for detailed performance analysis.

```ts
import { TimeProfiler } from '@universal-packages/time-measurer'

const profiler = TimeProfiler.start('Database Operations')

// Start some operation
const users = await db.users.findMany()
profiler.checkpoint('Users loaded')

// Another operation
const posts = await db.posts.findMany()
profiler.checkpoint('Posts loaded')

// Finish profiling
const checkpoints = profiler.stop('Complete')

checkpoints.forEach((cp) => {
  console.log(`${cp.name}: ${cp.measurement.toString()}`)
})
```

### Constructor <small><small>`constructor`</small></small>

```ts
new TimeProfiler(options?: ProfilerOptions)
```

Creates a new TimeProfiler instance with the specified options.

#### ProfilerOptions

- **`name`**: `string` (default: `'Profiler Session'`)
  A descriptive name for the profiling session.
- **`trackMemory`**: `boolean` (default: `false`)
  Whether to track memory usage and deltas between checkpoints.

### Properties

#### checkpoints

```ts
readonly checkpoints: ProfilerCheckpoint[]
```

Returns a copy of all checkpoints recorded so far.

#### lastCheckpoint

```ts
readonly lastCheckpoint: ProfilerCheckpoint | undefined
```

Returns the most recently recorded checkpoint, or undefined if none exist.

#### isRunning

```ts
readonly isRunning: boolean
```

Returns true if the profiler is currently active and measuring time.

#### elapsed

```ts
readonly elapsed: Measurement | undefined
```

Returns the current elapsed time since the profiler was started, or undefined if not started.

### Instance Methods

#### start

```ts
start(): void
```

Starts the profiling session. Throws an error if already started.

```ts
const profiler = new TimeProfiler()
profiler.start()
```

#### checkpoint

```ts
checkpoint(name: string): Measurement
```

Creates a named checkpoint and returns the measurement from the start time. Throws an error if not started.

```ts
profiler.checkpoint('Database connected')
// ... more operations
profiler.checkpoint('Data processed')
```

#### getCheckpoint

```ts
getCheckpoint(name: string): ProfilerCheckpoint | undefined
```

Retrieves a specific checkpoint by name.

```ts
const dbCheckpoint = profiler.getCheckpoint('Database connected')
if (dbCheckpoint) {
  console.log(`DB connection took: ${dbCheckpoint.measurement.toString()}`)
}
```

#### stop

```ts
stop(finalCheckpointName?: string): ProfilerCheckpoint[]
```

Stops the profiler, creates a final checkpoint, and returns all checkpoints.

```ts
const allCheckpoints = profiler.stop('Session Complete')
```

#### reset

```ts
reset(): void
```

Resets the profiler state to start a new session.

```ts
profiler.reset()
profiler.start() // Ready for a new session
```

### Static Methods

#### start

```ts
static start(name?: string): TimeProfiler
```

Creates and immediately starts a new TimeProfiler instance.

```ts
const profiler = TimeProfiler.start('API Request Processing')
```

#### ProfilerCheckpoint

Each checkpoint contains:

- **`name`**: `string` - Name/label for the checkpoint
- **`measurement`**: `Measurement` - Time elapsed from start to this checkpoint
- **`timestamp`**: `Date` - When the checkpoint was created
- **`memoryUsage`**: `number` (optional) - Memory usage in bytes (if tracking enabled)
- **`memoryDelta`**: `number` (optional) - Memory change from previous checkpoint (if tracking enabled)

### Memory Tracking Example

```ts
const profiler = new TimeProfiler({ trackMemory: true })
profiler.start()

// Create some data
const largeArray = new Array(1000000).fill('data')
const checkpoint1 = profiler.checkpoint('Array created')

// Process data
largeArray.forEach((item) => item.toUpperCase())
const checkpoint2 = profiler.checkpoint('Array processed')

console.log(`Memory at checkpoint 1: ${checkpoint1.memoryUsage} bytes`)
console.log(`Memory delta: ${checkpoint2.memoryDelta} bytes`)
```

## Sleep `class`

The `Sleep` class provides a simple utility for creating delays in asynchronous code using human-readable time strings. It leverages the `ms` library for flexible time string parsing.

```ts
import { Sleep } from '@universal-packages/time-measurer'

// Wait for 2 seconds
await Sleep.for('2s')

// Wait for 1.5 seconds
await Sleep.for('1500ms')

// Wait for 2 minutes
await Sleep.for('2m')

// Wait for 1 hour
await Sleep.for('1h')
```

### Static Methods

#### for

```ts
static for(timeString: StringValue): Promise<void>
```

Creates a delay for the specified duration using a human-readable time string. Returns a Promise that resolves after the specified time has elapsed.

The `timeString` parameter accepts the same format as the `ms` library

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
