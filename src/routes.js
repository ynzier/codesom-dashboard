export const Routes = {
  // pages
  Lock: { path: '/dashboard/examples/lock' },
  NotFound: { path: '/404' },
  ServerError: { path: '/500' },

  // deployment
  Signin: { path: '/' },
  AddAdmin: { path: '/dashboard/addadmin' },
  CustomerList: { path: '/dashboard/allItem' },
  Setting: { path: '/dashboard/setting' },
  Receipts: { path: '/dashboard/Receipts' },

  // People
  Home: { path: '/dashboard' },
  EmployeeList: { path: '/dashboard/employee' },
  GetEmployee: { path: '/dashboard/employee/getEmployee/:empId' },
  CreateNewEmployee: { path: '/dashboard/employee/create' },

  // Dashboard User
  UserList: { path: '/dashboard/users' },
  AddPermission: { path: '/dashboard/users/addPermission' },

  // Branch
  BranchLists: { path: '/dashboard/branch' },
  AddBranch: { path: '/dashboard/branch/create' },
  GetBranch: { path: '/dashboard/branch/getBranch/:brId' },

  // Ingredient
  CreateRequisition: { path: '/dashboard/warehouse/createRequisition' },
  RequisitionList: { path: '/dashboard/warehouse/RequisitionList' },
  GetRequisition: { path: '/dashboard/warehouse/getRequisition/:reqId' },

  // Products
  ProductList: { path: '/dashboard/product' },
  IngrAndStuffList: { path: '/dashboard/product/ingredient' },
  AddProduct: { path: '/dashboard/product/create' },
  GetProduct: { path: '/dashboard/product/getProduct/:prId' },
  // Promotion
  PromotionList: { path: '/dashboard/promotion' },
  AddPromotion: { path: '/dashboard/promotion/create' },
  GetPromotion: { path: '/dashboard/promotion/getPromotion/:promoId' },
};
