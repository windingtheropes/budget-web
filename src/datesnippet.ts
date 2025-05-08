import { get_month_name } from "./argent"
export enum DateFormats {
    y = 0,
    ym = 1,
    ymd = 2,
    text_ym = 3
}

type options = {
    seconds?: number,
    miliseconds?: number,
    ymd_string?: string,
    sep?: string,
    format?: DateFormats
}
/**
 * Multifunction date wrapper class
 */
export default class DateSnippet {
    timestamp: number
    format: DateFormats
    /**
     * Ensure minimum 2 digit number
     */
    private z(a: number): string {
        if(a < 10) {
            return `0${a}`
        }
        return a.toString()
    }
    private get_timestamp_from_ymd = (ymd: string, sep: string = '-'): number => {
        try {
            const parts = ymd.split(sep)
            if (parts.length < 1) {
                return 0
            }
            const year = parseInt(parts[0])
            const month = (() => {
                if(parts.length > 1) {
                    return parseInt(parts[1])
                } else {
                    return 1
                }
            })()
            const day = (() => {
                if(parts.length > 2) {
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
        seconds, miliseconds, ymd_string, sep = '-', format = DateFormats.ymd
    }: options) {
        console.log(format)
        this.format = format
        if (seconds) { this.timestamp = seconds * 1000 } 
        else if (miliseconds) { this.timestamp = miliseconds }
        else if (ymd_string) { this.timestamp = this.get_timestamp_from_ymd(ymd_string, sep)}
        else this.timestamp = 0
    }
    get seconds() {
        return this.timestamp/1000
    }
    get miliseconds() {
        return this.timestamp
    }
    get month() {
        return this.date.getMonth() + 1
    }
    get day() {
        return this.date.getDate();
    }
    get year() {
        return this.date.getFullYear();
    }
    get date() {
        return new Date(this.timestamp)
    }
    displayName(): string {
        const today: Date = new Date()
        if ((this.format == DateFormats.ym || this.format == DateFormats.text_ym) && (today.getFullYear() == this.year && this.month == today.getMonth() + 1)) {
            return 'This Month'
        } else if ((this.format == DateFormats.y) && (today.getFullYear() == this.year)) {
            return 'This Year'
        }
        switch (this.format) {
            case DateFormats.y:
                return this.year.toString()
            case DateFormats.ym:
                return [this.year, this.z(this.month)].join("/")
            case DateFormats.ymd:
                return [this.year, this.z(this.month), this.z(this.day)].join("/")
            case DateFormats.text_ym:
                return `${get_month_name(this.month)} ${this.year}`
        }
    }
}
