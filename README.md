# Process Measurer
[![npm version](https://badge.fury.io/js/@universal-packages%2Fprocess-measurer.svg)](https://www.npmjs.com/package/@universal-packages/process-measurer)
[![Testing](https://github.com/Universal-Packages/universal-process-measurer/actions/workflows/testing.yml/badge.svg)](https://github.com/Universal-Packages/universal-process-measurer/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/Universal-Packages/process-measurer/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/Universal-Packages/universal-process-measurer)

Process Measurer is a simple wrap for `process.hrtime` to measure time with procession and express that time easily through formatted representations, anytime you want to express how much a query or a request took at code level you may want to give this a try.

## Install

```shell
npm install @universal-packages/process-measurer
```

## ProcessMeasurer

Class `Process Measurer` provides an instantiable interface to start measuring time from any part of your code.

```js
import ProcessMeasurer from '@universal-packages/process-measurer'

async function getAll() {
  const measurer = new ProcessMeasurer()

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

You will get someting like

```
02hrs 35min 51.235sec
02:35:51.235
02hrs 35min 51.235sec
02 Hours, 35 Minutes, and 51.235 Seconds
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

## Functional

A more simple way to use the process measurer API is by importing just the `start` and `finish` functions, the only disadvantage here is that you can only measure one thing at a time, unlike `ProcessMeasurer` that can be instantiated multiple times and measurer several things useful when you have a lot of async tasks running.

```ts
import { start, finish } from '@universal-packages/process-measurer'

async function getAll() {
  start()
  const data = await myDB.getAllRecords()
  const measurement = finish()

  console.log('All records - ', measurement.toString())
}


getAll()
// > All records - 2.23ms
```

## Sleep

Process measurer ships with a convenient sleep function that takes a single parameter `time` in milliseconds, internally it is just a promise with a timeout that resolves it.


```js
import ProcessMeasurer, { sleep } from '@universal-packages/process-measurer'

async function waitable() {
  ProcessMeasurer.sleep(1000)

  sleep(2000)
}

```

## Typescript

Process Measurer is developed in TypeScript and shipped fully typed.

## Contributing

Development of Process Measurer happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Recoil.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).

