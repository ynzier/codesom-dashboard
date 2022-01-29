export const Routes = {
  // pages
  Lock: { path: '/dashboard/examples/lock' },
  NotFound: { path: '/404' },
  ServerError: { path: '/500' },

  // deployment
  Signin: { path: '/' },
  AddAdmin: { path: '/dashboard/addadmin' },
  CustomerList: { path: '/dashboard/allItem' },
  AddItem: { path: '/dashboard/additem' },
  Setting: { path: '/dashboard/setting' },
  Receipts: { path: '/dashboard/Receipts' },

  // People
  Home: { path: '/dashboard' },
  EmployeeList: { path: '/dashboard/employee' },
  CreateNewEmployee: { path: '/dashboard/employee/create' },

  // Dashboard User
  UserList: { path: '/dashboard/users' },
  AddPermission: { path: '/dashboard/users/addPermission' },

  // Branch
  Branch: { path: '/dashboard/branch' },
  AddBranch: { path: '/dashboard/branch/create' },
  getBranch: { path: '/dashboard/branch/getBranch/:brId' },
};
