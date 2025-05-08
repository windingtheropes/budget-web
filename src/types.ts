import type { StringMappingType } from "typescript"
import { get_month_name } from "./argent"

export interface Tag {
	Id: number,
	Name: string,
	User_Id: number
}
export interface TransactionEntry {
	Id: number,
	User_Id: number,
	Type_Id: number,
	Vendor: string,
	Msg: string,
	Amount: number,
	Tags: Tag[],
	Currency: string,
	Unix_Timestamp: number
}
export interface TransactionEntryForm {
	type_id: number,
	msg: string,
	vendor: string,
	amount: number,
	tags: number[],
	currency: string,
	unix_timestamp: number
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
	name: string,
	email: string,
	password: string
}
export interface UserInfo {
	id: number,
	name: string,
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
	Name: string
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
	return { Code: code, Message: messages[`_${code}`] }
}

export interface ReturnsResponse {
	(...args: any[]): Promise<ResponseStatus>
}