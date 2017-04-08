describe('Asynchronous Tests', () => {

	let GracefulClosingSpy;

	beforeEach(() => {
		GracefulClosingSpy = jasmine.createSpy('GracefulClosingSpy');
	})

	afterEach(() => {
		expect(GracefulClosingSpy).toHaveBeenCalled();
	})

	// All tests below have correct assertions. However, they're set as async tests
	// (note the `done` parameter of `it` callback). The test runner injects a function
	// into the `done` param, calling it finishes the current `it` test. If `done` is
	// present (test is async), but doesn't get called, the test runner doesn't know
	// when to consider the test finished. That's a bug!

	it('finish gracefully if setTimeout callback calls `done` explicitly', (done) => {
		let ok = false;
		setTimeout(() => {
			ok = true;
			expect(ok).toBe(true);
			GracefulClosingSpy();
			done();
		}, 1000);
	})

	const resolveDelay = (value, delay) => new Promise((res, rej) => {
		setTimeout(() => res(value), delay);
	});

	it('finish gracefully if Promise callback calls `done` explicitly', (done) => {
		resolveDelay(false, 1000)
			.then(value => true)
			.then(value => {
				expect(value).toBe(true);
				GracefulClosingSpy();
			})
			.then(done)
	})
})
