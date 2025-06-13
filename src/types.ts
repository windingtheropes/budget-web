export interface Tag {
	Id: number,
	Name: string
}
export interface TagForm {
	Name:			string
}
export interface Budget {
	Id:      number,
	Name:    string,
	Goal:   number
	Tag_Budgets: TagBudget[]
}
export interface BudgetForm {
	Name:    string,
	Goal:   number,
	Tag_Budgets: TagBudgetForm[]
}
export interface BudgetEntry {
	Id:             number,
	Transaction_Id: number,
	Budget_Id:      number,
	Amount:         number
}
export interface BudgetEntryForm {
	Budget_Id:      number,
	Amount:         number
}
export interface TagBudget {
	Id: 		number,
	Tag_Id:		number,
	Budget_Id: 	number,
	Goal:		number,
	Type_Id:    number
}
export interface TagBudgetForm {
	Tag_Id: 	number,
	Goal:		number,
	Type_Id:    number
}
interface TransactionRoot {
	Id: number,
	User_Id: number,
}
interface TransactionMeta {
	Type_Id: number,
	Vendor: string,
	Msg: string,
	Currency: string,
	Tags: Tag[],
	Unix_Timestamp: number,
}
interface TransactionData {
	Amount: number,
	Budget_Entries: BudgetEntry[]
}
export interface Transaction extends TransactionMeta, TransactionRoot, TransactionData {}
export interface MetaSignedBudgetedTransaction extends TransactionMeta, TransactionRoot { 
	Value: number;
}

export interface TransactionForm {
	type_id: number,
	msg: string,
	vendor: string,
	amount: number,
	tags: number[],
	currency: string,
	unix_timestamp: number,
	budget_entries: BudgetEntryForm[]
}
export interface SignedTransaction {
	amount: number,
	transaction: Transaction
}
export interface LoginResponse {
	code: number,
	message: string,
	token: string,
}
export interface LoginForm {
	email: string,
	password: string
}
export interface SignUpForm {
	first_name: string,
	last_name: string,
	email: string,
	password: string
}
export interface UserInfo {
	id: number,
	first_name: string,
	last_name: string,
	email: string
}
export interface SessionForm {
	token: string
}
export interface GenericResponse {
	code: number,
	message: string
}
export interface ValueResponse<T> {
	value: T
}
export interface TransactionType {
	Id: number,
	Name: string,
	Positive: boolean
}

export enum messages {
	_1000 = "Unknown Error",
	_200 = "Ok",
	_400 = "Bad Request",
	_401 = "Unauthorized",
	_403 = "Not Allowed",
	_404 = "Not Found",
	_500 = "Internal Error"
}
export enum codes {
	_1000 = 1000,
	_200 = 200,
	_400 = 400,
	_401 = 401,
	_403 = 403,
	_404 = 404,
	_500 = 500
}

export interface ResponseStatus {
	Code: codes,
	Message: string | undefined
}
export const Status = (code: codes, message?: string): ResponseStatus => {
	return { Code: code, Message: message || messages[`_${code}`] }
}

export interface ReturnsResponse {
	(...args: any[]): Promise<ResponseStatus>
}