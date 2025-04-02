export interface Tag {
	Id: number,
	Name: string,
	User_Id: number
}
export interface TransactionEntry {
	Id:             number,
	User_Id:        number,
	Amount:         number,
	Tags: Tag[],
	Currency:       string,
	Unix_Timestamp: number
}

