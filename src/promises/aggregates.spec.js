// IMPORTANT NOTE: for the sake of these tests, Promise.prototype.finally has been added

describe('promise aggregates', () => {

	let logMemory;
	function log(...args){
		logMemory = logMemory.concat(args);
	}

	beforeEach(() => {
		logMemory = [];
	});

	const rejectDelay = (value, delay) => {
		log(`start:${value}`);
		let p = new Promise((resolve, reject) => {
			setTimeout(() => reject(value), delay);
		});
		p.catch(v => log(`reject:${v}`));
		return p;
	}

	const resolveDelay = (value, delay) => {
		log(`start:${value}`);
		let p = new Promise((resolve, reject) => {
			setTimeout(() => resolve(value), delay);
		});
		p.then(v => log(`fulfill:${v}`));
		return p;
	}

	const TrainingPromise = {};

	describe('TrainingPromise.sequential', () => {

		TrainingPromise.sequential = (promiseFns) =>
			promiseFns.reduce((pAggr, pFn) =>
				pAggr.then(result => pFn().then(v => result.concat(v))),
				Promise.resolve([]))

		it('executes promises sequentially', (done) => {
			TrainingPromise.sequential([
				() => resolveDelay('f1', 300),
				() => resolveDelay('f2', 200),
				() => resolveDelay('f3', 100),
			]).then(value => {
				expect(value).toEqual(['f1', 'f2', 'f3'])
				expect(logMemory).toEqual(['start:f1', 'fulfill:f1', 'start:f2', 'fulfill:f2', 'start:f3', 'fulfill:f3'])
			}).catch(fail)
			.finally(done)
		})

		it('rejects when first item is rejected', (done) => {
			TrainingPromise.sequential([
				() => resolveDelay('f1', 300),
				() => rejectDelay('s2', 200),
				() => resolveDelay('f3', 100),
			]).then(fail)
			.catch(reason => {
				expect(reason).toEqual('s2')
				expect(logMemory).toEqual(['start:f1', 'fulfill:f1', 'start:s2', 'reject:s2'])
			}).finally(done)
		})
	})

	describe('TrainingPromise.race', () => {

		TrainingPromise.race = (promises) =>
			new Promise((resolve, reject) => {
				promises.forEach(p => p.then(resolve).catch(reject))
			})

		it('is resolved, if the first settled promise is resolved', (done) => {
			TrainingPromise.race([
				resolveDelay('s1', 100),
				rejectDelay('f1', 200)
			]).then(value => {
				expect(value).toEqual('s1')
			}).catch(fail)
			.finally(done)
		})

		it('is rejected, if the first settled promise is rejected', (done) => {
			TrainingPromise.race([
				rejectDelay('f1', 100),
				resolveDelay('s1', 200)
			]).then(fail)
			.catch(reason => {
				expect(reason).toEqual('f1')
			}).finally(done)
		})

		it('resolves with the value of the first promise that resolves', (done) => {
			TrainingPromise.race([
				resolveDelay('s1', 300),
				resolveDelay('s2', 100),
				resolveDelay('s3', 200),
			]).then(value => {
				expect(value).toEqual('s2')
			}).catch(fail)
			.finally(done)
		})

		it('rejects with the reason of the first promise that rejects', (done) => {
			TrainingPromise.race([
				rejectDelay('f1', 300),
				rejectDelay('f2', 100),
				rejectDelay('f3', 200),
			]).then(fail)
			.catch(reason => {
				expect(reason).toEqual('f2')
			}).finally(done)
		})
	})

	describe('TrainingPromise.all', () => {

		TrainingPromise.all = (promises) => {
			const values = [];
			return promises .reduce((aggr, p) => {
				return aggr.then(_ => p).then(v => values.push(v) )
			}, Promise.resolve())
			.then(_ => values);
		}

		it('is resolved after all promises get resolved', (done) => {
			TrainingPromise.all([
				resolveDelay('s1', 100),
				resolveDelay('s2', 300),
				resolveDelay('s3', 200)
			]).then(([v1, v2, v3]) => {
				expect(v1).toEqual('s1')
				expect(v2).toEqual('s2')
				expect(v3).toEqual('s3')
			}).catch(fail)
			.finally(done)
		})

		it('is rejected if at least one gets rejected', (done) => {
			TrainingPromise.all([
				resolveDelay('s1', 100),
				rejectDelay('f2', 300),
				resolveDelay('s3', 200)
			]).then(fail)
			.catch(reason => {
				expect(reason).toEqual(f2)
			}).finally(done)
		})

	})

	describe('TrainingPromise.any', () => {

		TrainingPromise.any = function(promises){
			var rejections = [];

			return new Promise((resolve, reject) => {
				promises.reduce((aggr, p) => {
					return aggr.then(_ => p).catch(r => {
						rejections.push(r)
						if (rejections.length === promises.length){
							reject(rejections)
						}
					})
				}, Promise.resolve(null))

				promises.forEach(item => {
					item.then(resolve)
				})
			})
		}

		it('resolves with the value of the first promise that resolves', (done) => {
			TrainingPromise.any([
				resolveDelay('s1', 300),
				rejectDelay('f1', 100),
				rejectDelay('f2', 200),
			]).then(value => {
				expect(value).toEqual('s1')
			}).catch(fail)
			.finally(done)
		})

		it('rejects if all promises reject', (done) => {
			TrainingPromise.any([
				rejectDelay('f1', 300),
				rejectDelay('f2', 100),
				rejectDelay('f3', 200),
			]).then(fail)
			.catch(([r1, r2, r3]) => {
				expect(r1).toEqual('f1')
				expect(r2).toEqual('f2')
				expect(r3).toEqual('f3')
			}).finally(done)
		})
	})
})
