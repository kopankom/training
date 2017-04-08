export const getEmployeesSalary = (employees) =>
    employees.reduce((sum, e) => sum + e.salary, 0);
