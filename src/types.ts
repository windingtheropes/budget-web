import type { StringMappingType } from "typescript"

export interface Tag {
	Id: number,
	Name: string,
	User_Id: number
}
export interface TransactionEntry {
	Id:             number,
	User_Id:        number,
	Msg: 			string,
	Amount:         number,
	Tags: Tag[],
	Currency:       string,
	Unix_Timestamp: number
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
export interface SessionForm {
	token: string
}
export interface GenericResponse {
	code: number,
	message: string
}
