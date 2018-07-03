import test from 'tape'
import { createStore, applyMiddleware } from 'redux'
import sagaMiddleware from '../../src'
import { cancel } from '../../src/effects'
import { createMockTask } from '../../src/utils'

test.only('it should allow to "clone" the generator', assert => {
  assert.plan(2)

  const middleware = sagaMiddleware()
  applyMiddleware(middleware)(createStore)(() => {})
  const task = createMockTask()
  function* saga() {
    yield cancel(task)
  }

  assert.equal(task.isRunning(), true)
  middleware
    .run(saga)
    .toPromise()
    .then(() => {
      assert.equal(
        task.isRunning(),
        false,
        'Sagas must take consecutive actions dispatched synchronously on an action channel even if it performs blocking calls',
      )
      assert.end()
    })
    .catch(err => assert.fail(err))

  // const generator = saga()
  // const mock = createMockTask()

  // generator.next() // fork(1)

  // assert.equal(mock.isRunning(), true)

  // generator.next(mock) // cancel(mock)
  // assert.equal(mock.isCancelled(), false)

  // assert.end()

  // saga
})

// it('waits for stop action and then cancels the service', () => {
//     const mockTask = createMockTask();

//     const expectedTakeYield = take(STOP_BACKGROUND_SYNC);
//     expect(generator.next(mockTask).value).to.deep.equal(expectedTakeYield);

//     const expectedCancelYield = cancel(mockTask);
//     expect(generator.next().value).to.deep.equal(expectedCancelYield);
//   });
//   const stub = () => null
//   function* saga(){
//     const task = yield fork(stub)
//     yield cancel(task)
//   }
