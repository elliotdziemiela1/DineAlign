//Don't really need this actually
export enum DayOfTheWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

export function getEnumFromDate(date: Date): DayOfTheWeek {
    switch (date.getDay()) {
        case 0:
                return DayOfTheWeek.SUNDAY;
            case 1:
                return DayOfTheWeek.MONDAY;
            case 2:
                return DayOfTheWeek.TUESDAY;
            case 3:
                return DayOfTheWeek.WEDNESDAY;
            case 4:
                return DayOfTheWeek.THURSDAY;
            case 5:
                return DayOfTheWeek.FRIDAY;
            default:
                return DayOfTheWeek.SATURDAY;
    }
}

export function getDayOfWeek(date: Date | DayOfTheWeek): string {
    if (date instanceof Date) {
        switch (date.getDay()) {
            case 0:
                return "Sunday";
            case 1:
                return "Monday";
            case 2:
                return "Tuesday";
            case 3:
                return "Wednesday";
            case 4:
                return "Thursday";
            case 5:
                return "Friday";
            default:
                return "Saturday";
        }
    } else {
        switch (date) {
            case DayOfTheWeek.SUNDAY:
                return "Sunday";
            case DayOfTheWeek.MONDAY:
                return "Monday";
            case DayOfTheWeek.TUESDAY:
                return "Tuesday";
            case DayOfTheWeek.WEDNESDAY:
                return "Wednesday";
            case DayOfTheWeek.THURSDAY:
                return "Thursday";
            case DayOfTheWeek.FRIDAY:
                return "Friday";
            default:
                return "Saturday";
        }
    }
}