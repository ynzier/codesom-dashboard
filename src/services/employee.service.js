import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));
const prefix = '/employee';

const getEmployeeList = () => {
  return http.get(prefix + '/getEmployeeList', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const createNewEmployee = data => {
  return http.post(prefix + '/createNewEmployee', data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const updateEmp = (empId, data) => {
  return http.put(prefix + `/updateEmp`, data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
    params: { empId: empId },
  });
};

const deleteEmp = empId => {
  return http.delete(`${prefix}/deleteEmp/${empId}`, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const getEmpById = empId => {
  return http.get(prefix + '/getEmpById', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
    params: { empId: empId },
  });
};
const getEmployeeByIdForUserCreate = empId => {
  return http.get(prefix + '/getEmployeeByIdForUserCreate', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
    params: { empId: empId },
  });
};
export default {
  getEmployeeList,
  createNewEmployee,
  updateEmp,
  deleteEmp,
  getEmployeeByIdForUserCreate,
  getEmpById,
};
