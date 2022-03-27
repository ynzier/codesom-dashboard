export { default as Login } from './auth';
export { default as NotFound } from './errors/NotFound';
export { default as ServerError } from './errors/ServerError';
export { default as CustomerList } from './customer/CustomerList';
export { default as Receipts } from './history/OrderHistory';
export { default as Record } from './history/Record';
export { default as Setting } from './setting/Setting';

// Home
export { default as Home } from './dashboard/Home';
//Employee
export { default as EmployeeList } from './employee/EmployeeList';
export { default as CreateNewEmployee } from './employee/CreateNewEmployee';
export { default as GetEmployee } from './employee/GetEmployee';

//User
export { default as UserList } from './users/UserList';
export { default as AddPermission } from './users/AddPermission';

// Branch
export { default as BranchLists } from './branch/BranchLists';
export { default as AddBranch } from './branch/AddBranch';
export { default as GetBranch } from './branch/GetBranch';

// Ingredient
export { default as CreateRequisition } from './warehouse/CreateRequisition';
export { default as RequisitionList } from './warehouse/RequisitionList';
export { default as GetRequisition } from './warehouse/GetRequisition';

// Product
export { default as ProductList } from './product/ProductList';
export { default as IngrAndStuffList } from './product/IngrAndStuffList';
export { default as AddProduct } from './product/AddProduct';
export { default as GetProduct } from './product/GetProduct';

// Promotion
export { default as AddPromotion } from './promotion/AddPromotion';
export { default as GetPromotion } from './promotion/GetPromotion';
export { default as PromotionList } from './promotion/PromotionList';

// History

export { default as OrderHistory } from './history/OrderHistory';