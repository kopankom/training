import API from '../../data/api';

import { zip } from '../util';
import { getEmployeesSalary } from '../employee';

describe('REST API promises', () => {

	it('handles API.getNationalities call', (done) => {
		API.getNationalities().then(nationalities => {
			expect(nationalities).toEqual(["US", "UK", "DE", "FR", "PL", "IT", "ES"])
			done()
		})
	})

	it('handles API.getEmployee call', (done) => {
		API.getEmployee(7344).then(employee => {
			expect(employee.name).toBe("Tiara Will")
			done()
		})
	})

	it('handles API.getEmployeesByNationality call', (done) => {
		Promise.all([
			API.getEmployeesByNationality("UK").then(employeesUK => {
				expect(employeesUK.length).toBe(40)
			}),
			API.getEmployeesByNationality("US").then(employeesUS => {
				expect(employeesUS.length).toBe(58)
			}),
			API.getEmployeesByNationality("FR").then(employeesFR => {
				expect(employeesFR.length).toBe(49)
			}),
			API.getEmployeesByNationality("DE").then(employeesDE => {
				expect(employeesDE.length).toBe(62)
			})
		]).then(done)
	})

	it('should perform a simple business domain scenario', (done) => {
		function getTotalNationalSalary(nationality) {
			return API.getEmployeesByNationality(nationality)
				.then(getEmployeesSalary)
		}

		Promise.all([
			getTotalNationalSalary("UK"),
			getTotalNationalSalary("US"),
			getTotalNationalSalary("FR"),
			getTotalNationalSalary("DE")
		]).then(([UK, US, FR, DE]) => {
			expect(UK).toBe(213080)
			expect(US).toBe(335580)
			expect(FR).toBe(267800)
			expect(DE).toBe(334910)
			done();
		});
	})

	it('should perform a complex business domain scenario', (done) => {
		function getTotalSalariesByNationality() {
			return API.getNationalities().then(nationalities => {
				let employeesPromises = nationalities.map(API.getEmployeesByNationality);
				return Promise.all(employeesPromises)
					.then(employeesLists => employeesLists.map(getEmployeesSalary))
					.then(salaries => zip(nationalities, salaries))
			})
		}

		getTotalSalariesByNationality()
			.then(({ US, UK, DE, FR }) => {
				expect(UK).toBe(213080)
				expect(US).toBe(335580)
				expect(FR).toBe(267800)
				expect(DE).toBe(334910)
				done();
			});
	})
})
