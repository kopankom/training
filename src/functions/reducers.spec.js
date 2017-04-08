import { shoppingData } from '../../data/data-shopping';
import { groupBy } from './group-by';
import { roundTo2 } from './math'

const getPrice = item => roundTo2(item.price * item.qty)

describe('Reducers', () => {

	it('can accumulate a collection down to a single value', () => {
		let totalPrice = shoppingData.reduce((total, item) => {
			return total += item.qty * item.price;
		}, 0);

		expect(totalPrice).toEqual(159.45);
	});

	it('can split one big collection into smaller grouped collections', () => {
		// let groupedAggregate = shoppingData.reduce((aggr, item) => {
		// 	if (!(item.type in aggr)){
		// 		aggr[item.type] = [];
		// 	}
		// 	aggr[item.type].push(item);
		// 	return aggr;
		// }, {});

		// const pushReducer = (list, item) => [ item, ...list]
		const pushReducer = (list, item) => { list.push(item); return list }

		const groupLists = groupBy(pushReducer, () => [])
		let groupedAggregate = groupLists(shoppingData, 'type');

		expect(groupedAggregate.Clothes.length).toEqual(4);
		expect(groupedAggregate.Music.length).toEqual(3);
		expect(groupedAggregate.Food.length).toEqual(3);
	});

	it('can also apply calculations to grouped items', () => {
		// let sumAggregate = shoppingData.reduce((aggr, item) => {
		// 	if (!(item.type in aggr)){
		// 		aggr[item.type] = 0;
		// 	}
		// 	aggr[item.type] += item.price * item.qty;
		// 	return aggr;
		// }, {});

		const sumReducer = (sum, item) => roundTo2(sum + getPrice(item))

		const groupSums = groupBy(sumReducer, () => 0)
		let sumAggregate = groupSums(shoppingData, 'type')

		expect(sumAggregate.Clothes).toEqual(63.6);
		expect(sumAggregate.Music).toEqual(30.75);
		expect(sumAggregate.Food).toEqual(65.1);
	});

	it('can perform further operations on grouped items', () => {
		// const to2 = v => Math.round(v * 100) / 100;
		// let maxPriceAggregate = shoppingData.reduce((aggr, item) => {
		// 	if (!(item.type in aggr)){
		// 		aggr[item.type] = 0;
		// 	}
		// 	let price = to2(item.qty * item.price);
		// 	aggr[item.type] = price > aggr[item.type] ? price : aggr[item.type];
		// 	return aggr;
		// }, {});

		const maxPriceReducer = (maxPrice, item) => maxPrice < getPrice(item) ? getPrice(item) : maxPrice

		const groupMaxPrices = groupBy(maxPriceReducer, () => 0)
		let maxPriceAggregate = groupMaxPrices(shoppingData, 'type')

		expect(maxPriceAggregate).toEqual({Clothes: 46.0, Music: 11.90, Food: 33.6});
	});

	describe('logical reducers', () => {
		let isEven = n => n % 2 === 0;
		let isOdd = n => n % 2 === 1;
		let isGT10 = n => n > 10;
		let isLT1000 = n => n < 1000;
		let isBetween20And50 = n => n >= 20 && n <= 50;
		let isPositive = n => n > 0;
		let isNegative = n => n < 0;

		it('can check if all predicates are truthy', () => {
			// const allTruthy = (value, predicates) =>
			// 	!predicates.find((predFn) => !predFn(value))

			const allTruthy = (value, predicates) =>
				predicates.reduce((aggr, predicate) => aggr && predicate(value), true);

			expect(allTruthy(0, [isEven, isLT1000])).toBe(true);
			expect(allTruthy(25, [isOdd, isGT10, isNegative])).toBe(false);
			expect(allTruthy(32, [isOdd, isBetween20And50, isLT1000])).toBe(false);
			expect(allTruthy(-1, [isEven, isOdd, isNegative])).toBe(false);
			expect(allTruthy(-1, [isNegative])).toBe(true);
		});

		it('can check if any predicate is truthy', () => {
			// const anyTruthy = (value, predicates) =>
			// 	!!predicates.find((predFn) => predFn(value))

			const anyTruthy = (value, predicates) =>
				predicates.reduce((aggr, predicate) => aggr || predicate(value), false);

			expect(anyTruthy(0, [isOdd, isNegative])).toBe(false);
			expect(anyTruthy(25, [isEven, isBetween20And50, isNegative])).toBe(true);
			expect(anyTruthy(32, [isEven, isBetween20And50, isLT1000])).toBe(true);
			expect(anyTruthy(-1, [isEven, isBetween20And50, isPositive])).toBe(false);
			expect(anyTruthy(-1, [isNegative])).toBe(true);
		});
	});

	it('sequential processing via function pipe', () => {
		const execute = (fnSequence, init) =>
			fnSequence.reduce((value, fn) => fn(value), init);

		let start, operations, result;

		start = 2;
		operations = [
			function(a){ return 8 * a - 10; },
			function(a){ return (a - 3) * (a - 3) * (a - 3); },
			function(a){ return a * a + 4; },
			function(a){ return a % 5; }
		];
		result = execute(operations, start);
		expect(result).toEqual(3);

		start = 5;
		operations = [
			function(a){ return (a - 3) * (a - 3) * (a - 3); },
			function(a){ return 8 * a - 10; },
			function(a){ return a * a + 4; }
		];
		result = execute(operations, start);
		expect(result).toEqual(2920);
	});
});
