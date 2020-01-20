import { GraphModelPlot } from './GraphModelPlot';

export class GraphModel {
    constructor(name: string) {
        this.name = name;
    }

    name: string;
    series: GraphModelPlot[];
}
