const get_month_name = (m: number): string | undefined => {
    switch (m) {
        case 1:
            return 'January'
        case 2:
            return 'February'
        case 3:
            return 'March'
        case 4:
            return 'April'
        case 5:
            return 'May'
        case 6:
            return 'June'
        case 7:
            return 'July'
        case 8:
            return 'August'
        case 9:
            return 'September'
        case 10:
            return 'October'
        case 11:
            return 'November'
        case 12:
            return 'December'
    }
    return
}
export enum DateFormat {
    text, // June 16 2025
    text_or_this, // 2025 -> This Year, June 2025 -> This Month
    ymd, // 2025-06-16
    dmy, // 16-06-2025
    mdy, // 06-16-2025
}
export enum DateDetail {
    y = 1,
    ym = 2,
    ymd = 3
}
type options = {
    seconds?: number,
    miliseconds?: number,
    ymd_string?: string,
    sep?: string,
    detail?: DateDetail,
    format?: DateFormat
}
/**
 * Multifunction date wrapper class
 */
export default class DateSnippet {
    timestamp: number
    format: DateFormat
    detail: DateDetail
    sep: string
    /**
     * Ensure minimum 2 digit number
     */
    private f2d(a: number): string {
        if (a < 10) {
            return `0${a}`
        }
        return a.toString()
    }
    // function allowing datesnippets to generate a date based on a ymd string, at the minimum by just the year
    private get_timestamp_from_ymd = (ymd: string): number => {
        try {
            const parts = ymd.split(this.sep)
            if (parts.length < 1) {
                return 0
            }
            // defaults 1 , so a 2025 date snippet would be 2025-01-01, a march 2025 snippet would be 2025-03-01, such that the javascript date and timestamp can exist
            const year = parseInt(parts[0])
            const month = (() => {
                if (parts.length > 1) {
                    return parseInt(parts[1])
                } else {
                    return 1
                }
            })()
            const day = (() => {
                if (parts.length > 2) {
                    return parseInt(parts[2])
                } else {
                    return 1
                }
            })()

            const date = new Date(year, month - 1, day)
            date.setTime(0)
            date.setFullYear(year)
            // Month index, not month
            date.setMonth(month - 1)
            date.setDate(day)

            return date.getTime()
        } catch {
            return 0
        }
    }
    constructor({
        seconds, miliseconds, ymd_string, sep = '-', format = DateFormat.ymd, detail = DateDetail.ymd
    }: options) {
        this.format = format
        this.detail = detail
        this.sep = sep
        if (seconds) { this.timestamp = seconds * 1000 }
        else if (miliseconds) { this.timestamp = miliseconds }
        else if (ymd_string) { this.timestamp = this.get_timestamp_from_ymd(ymd_string) }
        else this.timestamp = new Date().getTime()

    }
    // get the text formatting of a date
    private fmt_text(): string {
        if (this.detail == DateDetail.y) {
            return this.year.toString()
        } else if (this.detail == DateDetail.ym) {
            return `${get_month_name(this.month)} ${this.year}`
        } else {
            return `${get_month_name(this.month)} ${this.day} ${this.year}`
        }
    }
    // format a date in a purely numerical format
    private fmt_numdate(format: DateFormat.dmy | DateFormat.ymd | DateFormat.mdy = DateFormat.ymd): string {
        const dmy = [this.f2d(this.day), this.f2d(this.month), this.f2d(this.year)]
        const ymd = [this.f2d(this.year), this.f2d(this.month), this.f2d(this.day)]
        const mdy = [this.f2d(this.month), this.f2d(this.day), this.f2d(this.year)]

        if(format == DateFormat.dmy) {
            return dmy.slice(0,this.detail).join(this.sep)
        } else if(format == DateFormat.ymd) {
            return ymd.slice(0,this.detail).join(this.sep)
        } else if(format == DateFormat.mdy) {
            return mdy.slice(0,this.detail).join(this.sep)
        } else return ymd.join(this.sep)
    }
    // format the date to a string based on a specified format
    get_formatted(format: DateFormat): string {
        const today: DateSnippet = new DateSnippet({})
        if (format == DateFormat.text_or_this) {
            // text or this will specify whether the date is present, based on detail
            if(this.detail == DateDetail.y && this.year == today.year) return `This Year`
            else if(this.detail == DateDetail.ym && this.year == today.year && this.month == today.month) return `This Month`
            else if(this.detail == DateDetail.ymd && this.year == today.year && this.month == today.month && this.day == today.day) return `Today`
            else return this.fmt_text()
        } else if (format == DateFormat.text) { return this.fmt_text() }
        // all of these are numerical formats, pass them to the numerical formatter
        else if (format == DateFormat.dmy || format == DateFormat.mdy || format == DateFormat.ymd) { return this.fmt_numdate(format) }
        return this.fmt_numdate()
    }
    get seconds(): number {
        return this.timestamp / 1000
    }
    get miliseconds(): number {
        return this.timestamp
    }
    get month(): number {
        return this.date.getMonth() + 1
    }
    get day(): number {
        return this.date.getDate();
    }
    get year(): number {
        return this.date.getFullYear();
    }
    get date(): Date {
        return new Date(this.timestamp)
    }
    get displayName(): string {
        return this.get_formatted(this.format)
    }
}
