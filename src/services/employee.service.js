import http from 'http-common';
const prefix = '/employee';
import authHeader from './auth-header';

const getEmployeeList = () => {
  return http.get(prefix + '/getEmployeeList', {
    headers: authHeader(),
  });
};
const getAdminManagerList = () => {
  return http.get(prefix + '/getAdminManagerList', {
    headers: authHeader(),
  });
};

const createNewEmployee = data => {
  return http.post(prefix + '/createNewEmployee', data, {
    headers: authHeader(),
  });
};

const updateEmp = (empId, data) => {
  return http.put(prefix + `/updateEmp`, data, {
    headers: authHeader(),
    params: { empId: empId },
  });
};

const deleteEmp = empId => {
  return http.delete(`${prefix}/deleteEmp/${empId}`, {
    headers: authHeader(),
  });
};
const getEmpById = empId => {
  return http.get(prefix + '/getEmpById', {
    headers: authHeader(),
    params: { empId: empId },
  });
};
const getEmployeeByIdForUserCreate = empId => {
  return http.get(prefix + '/getEmployeeByIdForUserCreate', {
    headers: authHeader(),
    params: { empId: empId },
  });
};
const getEmployeeBranch = branchId => {
  return http.get(prefix + '/getEmployeeBranch', {
    params: { branchId: branchId },
  });
};
export default {
  getEmployeeList,
  createNewEmployee,
  updateEmp,
  deleteEmp,
  getEmployeeByIdForUserCreate,
  getEmpById,
  getAdminManagerList,
  getEmployeeBranch,
};
