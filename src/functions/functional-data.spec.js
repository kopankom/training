import db from '../../data/data';

describe('Functional programming', () => {
	// database is defined in data/data.js file
	let employees = db.getEmployees();

	describe('Processing data simple scenario', () => {

		it('is possible using for loop, yet inconvenient', () => {
			// calculate total amount of bonus
			// given to all employees with nationality equal "DE"
			// whose salary is below 5000
			// where bonus equals 20% of the salary

			// use FOR loops
			let totalBonus = 0;
			for (let i = 0; i < employees.length; i++){
				let employee = employees[i];
				if (employee.nationality === 'DE' && employee.salary < 5000){
					totalBonus += employee.salary * 0.2;
				}
			}

			expect(totalBonus).toEqual(17964);
		});

		it('is more readable and more convenient using functional programming', () => {
			// calculate total amount of bonus
			// given to all employees with nationality equal "DE"
			// whose salary is below 5000
			// where bonus equals 20% of the salary

			// use functional programming, assign step by step
			let employeesDE = employees
				.filter(function(employee){
					return employee.nationality === 'DE';
				});
			let employeesWithSalaryLessThan5000 = employeesDE
				.filter(function(employee){
					return employee.salary < 5000;
				});
			let totalBonus = employeesWithSalaryLessThan5000
				.map(function(employee){
					return employee.salary * 0.2;
				}).reduce(function(aggr, bonus){
					return aggr + bonus;
				}, 0);

			expect(employeesDE.length).toEqual(62);
			expect(employeesWithSalaryLessThan5000.length).toEqual(29);
			expect(totalBonus).toEqual(17964);
		});

		it('is even better using chaining', () => {
			// do the same as above, but don't use intermediate variables
			// process all steps and assign to final variable

			// use functional programming
			let totalBonus = employees
				.filter(function(employee){
					return employee.nationality === 'DE';
				}).filter(function(employee){
					return employee.salary < 5000;
				}).map(function(employee){
					return employee.salary * 0.2;
				}).reduce(function(aggr, bonus){
					return aggr + bonus;
				}, 0);

			expect(totalBonus).toEqual(17964);
		});

	});

	it('makes it easy to filter data by condition', () => {
		// fetch the employee with ID 9451
		let employee9451 = employees.find(function(employee){
			return employee.id === 9451;
		});

		expect(employee9451.id).toEqual(9451);
		expect(employee9451.address.city).toEqual("Port Bentonshireland");
		expect(employee9451.phone).toEqual("1-139-794-6794");

		// fetch a employee with nationality US
		let USEmployee = employees.find(function(employee){
			return employee.nationality === "US";
		});

		expect(USEmployee.nationality).toEqual("US");
	});

	it('makes it easy to filter data by condition', () => {
		// fetch all employees with nationality DE only
		let DEEmployees = employees.filter(function(employee){
			return employee.nationality === 'DE';
		})

		expect(DEEmployees.length).toEqual(62);
		expect(DEEmployees[19].name).toEqual("Ari Raynor");
		expect(DEEmployees[38].name).toEqual("Jacey Halvorson");

		// fetch all employees with gmail.com email domain only
		function check(email, domain){
			return email.substr(email.length - domain.length, email.length) === domain;
		}
		let GmailEmployees = employees.filter(function(employee){
			return check(employee.email, "gmail.com");
		})

		expect(GmailEmployees.length).toEqual(135);
		expect(GmailEmployees[19].name).toEqual("Kallie Quigley");
		expect(GmailEmployees[39].name).toEqual("Caterina Cruickshank III");
	});

	it('makes it easy to sort data by condition', () => {
		// sort employees by descending salary
		let RichestEmployees = employees
			.slice()
			.sort(function(a, b){
				return b.salary - a.salary;
			});

		expect(RichestEmployees.length).toEqual(365);
		expect(RichestEmployees[0].salary).toEqual(9960);
		expect(RichestEmployees[2].salary).toEqual(9920);
		expect(RichestEmployees[66].salary).toEqual(8280);
		expect(RichestEmployees[116].salary).toEqual(7130);

		// sort employees by ascending salary
		let PoorestEmployees = employees
			.slice()
			.sort(function(a, b){
				return a.salary - b.salary;
			});

		expect(PoorestEmployees.length).toEqual(365);
		expect(PoorestEmployees[0].salary).toEqual(1010);
		expect(PoorestEmployees[2].salary).toEqual(1140);
		expect(PoorestEmployees[66].salary).toEqual(2770);
		expect(PoorestEmployees[116].salary).toEqual(3960);
	});

	it('makes it easy to modify entire collections', () => {
		// grab all telephone numbers of all employees without modifying the order
		let EmployeePhoneNumbers = employees
			.map(function(employee){
				return employee.phone;
			});

		expect(EmployeePhoneNumbers.length).toEqual(365);
		expect(EmployeePhoneNumbers[8]).toEqual("1-415-304-0824");
		expect(EmployeePhoneNumbers[31]).toEqual("286.336.5409 x035");
		expect(EmployeePhoneNumbers[92]).toEqual("595.794.3113 x870");
		expect(EmployeePhoneNumbers[109]).toEqual("1-727-541-7250 x26689");
	});

	it('makes it easy to search for single objects', () => {
		// fetch the phone to the richest employee who is American
		// or (gives the same result in this case)
		// fetch the phone to the richest American
		let maxSalary = Math.max.apply(null, employees.map(function(employee){
			return employee.salary;
		}));
		let RichestUSEmployeePhone = employees
			.find(function(employee){
				return employee.salary === maxSalary && employee.nationality === "US";
			}).phone;

		expect(RichestUSEmployeePhone).toEqual("794-226-3531 x810");
	});

});
