export interface Project {
    classType: string,
    status: string
}

export interface Volume extends Project {
    calendarName: string,
    tags: Array<string>
}

export interface Edition extends Volume {
    calendarCategory: string,
    calendarDate: Date,
    publishDate: Date,
    scheduled: boolean,
    draftLink: string,
    header: string,
    advertisement: string
}