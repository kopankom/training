import API from '../../data/api';
import { async } from '../../data/async';

describe('coroutines', () => {

	it('should perform asynchronous calls sequentially', (done) => {
		function* fetchEmployees(){
			let e0 = yield API.getEmployee(4074);
			let e1 = yield API.getEmployee(8066);
			let e2 = yield API.getEmployee(2029);
			let e3 = yield API.getEmployee(6054);
			return [e0, e1, e2, e3];
		}

		async(fetchEmployees)()
			.then(result => {
				expect(result[0].name).toBe("Ms. Melisa Dooley")
				expect(result[1].address.city).toBe("West East Adelinefurt")
				expect(result[2].name).toBe("Maxie Windler")
				expect(result[3].phone).toBe("(073) 255-0190")
				done();
			});
	})

	it('should perform asynchronous calls sequentially using for..of loop', (done) => {
		function* fetchEmployees(...ids){
			let result = [];
			for (let id of ids) {
				result.push(yield API.getEmployee(id))
			}
			return result;
		}

		async(fetchEmployees)(4074, 8066, 2029, 6054)
			.then(result => {
				expect(result[0].name).toBe("Ms. Melisa Dooley")
				expect(result[1].address.city).toBe("West East Adelinefurt")
				expect(result[2].name).toBe("Maxie Windler")
				expect(result[3].phone).toBe("(073) 255-0190")
				done();
			});
	})

	it('should perform asynchronous calls simultaneously', (done) => {
		function* fetchEmployees(){
			let p0 = API.getEmployee(4074);
			let p1 = API.getEmployee(8066);
			let p2 = API.getEmployee(2029);
			let p3 = API.getEmployee(6054);
			return Promise.all([p0, p1, p2, p3]);
		}

		async(fetchEmployees)()
			.then(result => {
				expect(result[0].name).toBe("Ms. Melisa Dooley")
				expect(result[1].address.city).toBe("West East Adelinefurt")
				expect(result[2].name).toBe("Maxie Windler")
				expect(result[3].phone).toBe("(073) 255-0190")
				done();
			});
	})

	it('should perform a simple business domain scenario', (done) => {
		function* getTotalNationalSalary(nationality){
			let employees = yield API.getEmployeesByNationality(nationality)
			return employees
				.reduce((acc, employee) => acc += employee.salary, 0)
		}

		let asyncGetNationalSalary = async(getTotalNationalSalary)
		Promise.all([
			asyncGetNationalSalary("UK"),
			asyncGetNationalSalary("US"),
			asyncGetNationalSalary("FR"),
			asyncGetNationalSalary("DE")
		]).then(salaries => {
			let [UK, US, FR, DE] = salaries
			expect(UK).toBe(213080)
			expect(US).toBe(335580)
			expect(FR).toBe(267800)
			expect(DE).toBe(334910)
			done();
		});
	})

	it('should perform a complex business domain scenario', (done) => {
		function* getTotalSalariesByNationality(){
			let nationalities = yield API.getNationalities()
			let promises = nationalities.map(nationality => API.getEmployeesByNationality(nationality))
			let employeesByNation = yield Promise.all(promises)
			let result = {}
			nationalities.forEach((nation, idx) => {
				result[nation] = employeesByNation[idx]
					.reduce((acc, employee) => acc += employee.salary, 0)
			})
			return result;
		}

		async(getTotalSalariesByNationality)()
			.then(salaries => {
				let { US, UK, DE, FR } = salaries
				expect(UK).toBe(213080)
				expect(US).toBe(335580)
				expect(FR).toBe(267800)
				expect(DE).toBe(334910)
				done();
			});
	})
})
