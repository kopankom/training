import { customMatchers } from '../matchers';

describe('Functional programming', () => {

	let list3 = [3, 6, 12, 24, 36, 39, 51, 63];
	let list5 = [5, 15, 30, 40, 45, 55, 105];

	it('simple operations on primitives collection', () => {
		let multiplyBy3 = el => el * 3;
		let multiplyBy5 = el => el * 5;
		let list3times3 = list3.map(multiplyBy3);
		let list5times5 = list5.map(multiplyBy5);

		expect(typeof multiplyBy3).toEqual("function");
		expect(multiplyBy3.length).toEqual(1);
		expect(multiplyBy3(3)).toEqual(9);
		expect(typeof multiplyBy5).toEqual("function");
		expect(multiplyBy5.length).toEqual(1);
		expect(multiplyBy5(5)).toEqual(25);
		expect(list3times3).toEqual([9, 18, 36, 72, 108, 117, 153, 189]);
		expect(list5times5).toEqual([25, 75, 150, 200, 225, 275, 525]);

		let isEven = el => el % 2 == 0;
		let list3times3filteredEven = list3
			.map(multiplyBy3)
			.filter(isEven);
		let list5times5filteredEven = list5
			.map(multiplyBy5)
			.filter(isEven);

		expect(typeof isEven).toEqual("function");
		expect(isEven.length).toEqual(1);
		expect(isEven(2016)).toEqual(true);
		expect(isEven(2017)).toEqual(false);
		expect(list3times3filteredEven).toEqual([18, 36, 72, 108]);
		expect(list5times5filteredEven).toEqual([150, 200]);

		let sum = (aggr, el) => aggr + el;
		let list3times3filteredEvenSum = list3
			.map(multiplyBy3)
			.filter(isEven)
			.reduce(sum);
		let list5times5filteredEvenSum = list5
			.map(multiplyBy5)
			.filter(isEven)
			.reduce(sum);

		expect(typeof sum).toEqual("function");
		expect(sum.length).toEqual(2);
		expect(sum(2016, 2017)).toEqual(4033);
		expect(list3times3filteredEvenSum).toEqual(234);
		expect(list5times5filteredEvenSum).toEqual(350);
	});

	it('reverses lists', () => {
		let list3reversed = list3.slice().reverse();
		let list5reversed = list5.slice().reverse();

		expect(list3reversed).toEqual([63, 51, 39, 36, 24, 12, 6, 3]);
		expect(list3).toEqual([3, 6, 12, 24, 36, 39, 51, 63]);
		expect(list5reversed).toEqual([105, 55, 45, 40, 30, 15, 5]);
		expect(list5).toEqual([5, 15, 30, 40, 45, 55, 105]);
	});

	it('sequentially processes calculations', () => {
		let numbers = [2, 3, 8, 1, 33, 76, 13, 32, 13];

		let result = numbers
			.map(el => Math.pow(el, 3))
			.filter(el => el % 2)
			.reduce((sum, item) => sum + item);

		expect(result).toEqual(40359);
	});

	it('picks a single element (where .find does not apply)', () => {
		let numbers = [{"val":2},{"val":3},{"val":8},{"val":1},{"val":33},{"val":76},{"val":13},{"val":32},{"val":13}];

		let maxValue = numbers.reduce((maxSoFar, item) => {
			return item.val > maxSoFar.val ? item : maxSoFar
		}, numbers[0]);
		let minValue = numbers.reduce((minSoFar, item) => {
			return item.val < minSoFar.val ? item : minSoFar
		}, numbers[0]);

		expect(maxValue).toEqual({val: 76});
		expect(minValue).toEqual({val: 1});
	});

	describe('algorithms', () => {
		beforeEach(() => {
			jasmine.addMatchers(customMatchers);
		});

		it('gimmePairs function', () => {
			let gimmePairs = function(...elements){
				let result = [];
				elements.forEach((elem1, idx, rest) => {
				rest
					.slice(idx + 1)
					.forEach(elem2 => result.push([elem1, elem2]) );
				});
				return result;
			}

			// or
			gimmePairs = (...elements) =>
				elements.map((elem1, idx, rest) =>
				rest
					.slice(idx + 1)
					.map(elem2 => [elem1, elem2])
				).reduce((aggr, elem) => aggr.concat(elem), []);

			expect(gimmePairs(1)).toEqualJSON([]);
			expect(gimmePairs(1, 2)).toEqualJSON([[1, 2]]);
			expect(gimmePairs(1, 2, 3)).toEqualJSON([[1, 2], [2, 3], [1, 3]]);
			expect(gimmePairs(1, 2, 3, 4)).toEqualJSON([[1, 2], [2, 3], [3, 4], [1, 3], [2, 4], [1, 4]]);
		});
	});
});
