describe('Object Types', () => {

	describe('typeof operator', () => {

		it('defines primitive types precisely', () => {
			expect(typeof 2016).toEqual("number");
			expect(typeof '2016').toEqual("string");
			expect(typeof ('2016' + 1)).toEqual("string");
			expect(typeof ('2016' - 1)).toEqual("number");
			expect(typeof ('2016' == 2016)).toEqual("boolean");
			expect(typeof ('2016' === 2016)).toEqual("boolean");

			expect(typeof true).toEqual("boolean");
			expect(typeof (true + true)).toEqual("number");
			expect(typeof true + true).toEqual("booleantrue");

			var activity = 'training';
			expect(typeof activity).toEqual("string");
			expect(typeof activity.length).toEqual("number");
			expect(typeof activity.split).toEqual("function");
			expect(typeof activity.split()).toEqual("object");
		});

		it('defines complex types not that precisely', () => {
			expect(typeof Math).toEqual("object");
			expect(typeof Math.sqrt).toEqual("function");
			expect(typeof Math.PI).toEqual("number");

			var list = [1, 2, 3, 4, 5];
			expect(typeof list).toEqual("object");
			expect(typeof list.length).toEqual("number");
			expect(typeof list[0]).toEqual("number");

			var person = {
				first: "John",
				last: "Lennon"
			}
			expect(typeof person).toEqual("object");
			expect(typeof person.first).toEqual("string");
			expect(typeof person['last']).toEqual("string");
			expect(typeof person['last'].length).toEqual("number");
		});

		it('defines instances and constructors rather poorly', () => {
			function Person(first, last){
				this.first = first;
				this.last = last;
			}
			Person.prototype.age = 40;

			var john = new Person("John", "Lennon");
			expect(typeof john).toEqual("object");
			expect(typeof (john + '')).toEqual("string");
			expect(typeof Person).toEqual("function");
			expect(typeof john.age).toEqual("number");
			expect(typeof Person.prototype).toEqual("object");
			expect(typeof Person.prototype.age).toEqual("number");
			expect(typeof john.constructor).toEqual("function");
		});
	});

	describe('instanceof operator', () => {

		it('checks if operand 1 is a descendant of operand 2', () => {
			function Person(first, last, age){
				this.first = first;
				this.last = last;
			}
			var john = new Person("John", "Lennon");
			var paul = {
				first: "Paul",
				last: "McCartney"
			};

			expect(john instanceof Object).toEqual(true);
			expect(paul instanceof Object).toEqual(true);
			expect(Person instanceof Object).toEqual(true);
			expect(Object instanceof Object).toEqual(true);

			expect(john instanceof Person).toEqual(true);
			expect(paul instanceof Person).toEqual(false);
			expect(Person instanceof Person).toEqual(false);

			expect(Function instanceof Person).toEqual(false);
			expect(Function instanceof Object).toEqual(true);
			expect(Person instanceof Function).toEqual(true);
			expect(Object instanceof Function).toEqual(true);
		});
	});

});
