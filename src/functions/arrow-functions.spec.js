import { shoppingData } from '../../data/data-shopping';

describe('arrow functions', () => {

	it('can replace simple traditional functions', () => {
		let fnAdd = function (a, b) {
			return a + b;
		};
		let arrowAdd = (a, b) => a + b;

		expect(fnAdd.length).toBe(2)
		expect(arrowAdd.length).toBe(2)
		expect(fnAdd(3, 3)).toBe(arrowAdd(3, 3))
	})

	describe('are great for defining simple calculations', () => {
		let arrowSub = (a, b) => a - b;
		let arrowMul = (a, b) => a * b;
		let arrowDiv = (a, b) => a / b;

		it('subtracts numbers correctly', () => {
			expect(arrowSub(20, -15)).toEqual(35)
			expect(arrowSub.length).toBe(2);
		})

		it('multiplies numbers correctly', () => {
			expect(arrowMul(10.2, 5)).toEqual(51)
			expect(arrowMul.length).toBe(2);
		})

		it('divides numbers correctly', () => {
			expect(arrowDiv(546, 39)).toEqual(14)
			expect(arrowDiv.length).toBe(2);
		})
	})

	it('can replace complex traditional functions', () => {
		let fnFib = function (x) {
			if (x === 0 || x === 1) {
				return x;
			} else {
				return fnFib(x - 1) + fnFib(x - 2);
			}
		};

		let arrowFib = x => (x === 0 || x === 1) ? x : arrowFib(x - 1) + arrowFib(x - 2);

		[fnFib, arrowFib].forEach(function (fn) {
			expect(fn(0)).toBe(0);
			expect(fn(1)).toBe(1);
			expect(fn(5)).toBe(5);
			expect(fn(10)).toBe(55);
			expect(fn(15)).toBe(610);
		});
		expect(fnFib.length).toBe(1);
		expect(arrowFib.length).toBe(1);
	})

	it('binds `this` to the eval scope, not the runtime scope', () => {
		// console.log is being spied not to pollute output for other tests
		spyOn(console, 'log');

		const person = {
			name: 'Jarosław',
			greetFriends: function (friends) {
				friends.forEach((friend) => {
					console.log(this.name + ' greets to ' + friend)
				})
			},
		}

		const friendsArray = ['Antoni', 'Andrzej', 'Krystyna', 'Wiktor']

		expect(() => person.greetFriends(friendsArray)).not.toThrow()
		expect(console.log).toHaveBeenCalledWith('Jarosław greets to Antoni');
		expect(console.log).toHaveBeenCalledWith('Jarosław greets to Andrzej');
		expect(console.log).toHaveBeenCalledWith('Jarosław greets to Krystyna');
		expect(console.log).toHaveBeenCalledWith('Jarosław greets to Wiktor');
	})

	it('can return objects', () => {
		let makePerson = (first, last) => ({ first, last })

		expect(makePerson('John', 'Lennon')).toEqual({ first: 'John', last: 'Lennon' })
		expect(makePerson('Paul', 'McCartney')).toEqual({ first: 'Paul', last: 'McCartney' })
	})

	it('are great for currying', () => {
		let adder = a =>
			b => a + b
		let add5 = adder(5)
		let minus10 = adder(-10)

		expect(add5(4)).toBe(9)
		expect(add5(-4)).toBe(1)
		expect(add5(3.5)).toBe(8.5)
		expect(add5(400)).toBe(405)
		expect(minus10(4)).toBe(-6)
		expect(minus10(-4)).toBe(-14)
		expect(minus10(3.5)).toBe(-6.5)
		expect(minus10(400)).toBe(390)

		expect(typeof adder).toBe("function");
		expect(adder.length).toBe(1);
		expect(typeof add5).toBe("function");
		expect(add5.length).toBe(1);
		expect(typeof minus10).toBe("function");
		expect(minus10.length).toBe(1);
	})

	it('can make array filter chains more managable', () => {
		const shoppingList = shoppingData
			.filter(d => d.type != 'Clothes') // Filter out Clothes
			.filter(d => d.price < 5) // Find only remaining items with price < 5
			.sort((a, b) => b.price * b.qty - a.price * a.qty) // Sort by total price, desc
			.map(d => d.name) // Pull just the name from each item

		expect(shoppingList.shift()).toBe('Beer')
		expect(shoppingList.shift()).toBe('Chips')
	})
})
