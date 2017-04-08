describe('Prototypes', () => {

	describe('constructors', () => {

		it('can be used to produce objects', () => {
			function Person(first, last, age){
				this.first = first;
				this.last = last;
				if (age){
					this.age = age;
				}
			}
			Person.prototype.age = 18;

			var paul = new Person("Paul", "McCartney");
			var john = new Person("John", "Lennon", 40);

			expect(paul.age).toEqual(18);
			expect(john.age).toEqual(40);

			Person.prototype.age = 23;

			expect(paul.age).toEqual(23);
			expect(john.age).toEqual(40);
		});
	});

	describe('extensions', () => {
		it('can provide additional features', () => {
			Array.prototype.min = function(){
				return Math.min.apply(null, this); // ES5
				// return Math.min(...this); // ES6+
			};

			Array.prototype.max = function(){
				return Math.max.apply(null, this); // ES5
				// return Math.max(...this); // ES6+
			};

			expect([3,6,9].map(e => e * 2).min()).toEqual(6);
			expect([3,6,9].map(e => e * 2).max()).toEqual(18);
			expect([4, 5, 6, 7, 8, 9].map(e => Math.sqrt(e)).min()).toEqual(2);
			expect([4, 5, 6, 7, 8, 9].map(e => Math.sqrt(e)).max()).toEqual(3);

			// IMPORTANT (!)
			// you should not extend prototypes in your project
			// this exercise only checks your understanding of prototypal inheritance in JS
		});
	});
});
