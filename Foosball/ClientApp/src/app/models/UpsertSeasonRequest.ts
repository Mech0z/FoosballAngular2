export class UpsertSeasonRequest {
    constructor(name: string, startDate: Date) {
        this.name = name;
        this.startDate = startDate;
    }
    name: string;
    startDate: Date;
}
