# Time Measurer

[![npm version](https://badge.fury.io/js/@universal-packages%2Ftime-measurer.svg)](https://www.npmjs.com/package/@universal-packages/time-measurer)
[![Testing](https://github.com/universal-packages/universal-time-measurer/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-time-measurer/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-time-measurer/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-time-measurer)

Time Measurer is a simple wrap for `process.hrtime.bigint` to measure time with procession and express that time easily through formatted representations, anytime you want to express how much a query or a request took at code level you may want to give this a try.

## Install

```shell
npm install @universal-packages/time-measurer
```

## startMeasurement()

Creates a new TimeMeasurer instance to start a measurement.

```ts
import { startMeasurement } from '@universal-packages/time-measurer'

async function getAll() {
  const measurer = startMeasurement()
  const data = await myDB.getAllRecords()
  const measurement = measurer.finish()

  console.log('All records - ', measurement.toString())
}

getAll()
// > All records - 2.23ms
```

## TimeMeasurer

Class `TimeMeasurer` provides an instantiable interface to start measuring time from any part of your code. The measurement starts at instancing time.

```js
import { TimeMeasurer } from '@universal-packages/time-measurer'

async function getAll() {
  const measurer = new TimeMeasurer()

  measurer.start()

  const data = await myDB.getAllRecords()
  const measurement = measurer.finish()

  console.log('All records - ', measurement.toString())
}

getAll()
// > All records - 2.23ms
```

## Measurement

A `Measurement` object is the time representation after a measure, it provides the interface to express time as a formatted string or even as a date object.

### .toString()

Get the time representation as a string, this function takes one param `TimeFormat`, that can be one of `Condensed`, `Human`, `Expressive`, default: `Human`.

```js
measurement.toString()
measurement.toString('Condensed')
measurement.toString('Human')
measurement.toString('Expressive')
```

You will get something like

```
2hrs 35min 51.235sec
2:35:51.235
2hrs 35min 51.235sec
2 Hours, 35 Minutes, and 51.235 Seconds
```

It will take into account parts of the representation that are not contributing to the time, like if the measurement only took seconds, minutes and hours will not be included.

```
51.235sec
51.235
51.235sec
51.235 Seconds
```

### .toString()

Get the time representation as a date object this can be helpful if you want to use the `Date` api to format or do whatever with the date.

```js
measurement.toDate()
```

## Sleep

Time measurer ships with a convenient sleep function that takes a single parameter `time` in milliseconds, internally it is just a promise with a timeout that resolves it.

```js
import { sleep } from '@universal-packages/time-measurer'

async function awaitable() {
  await sleep(2000)
}
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
