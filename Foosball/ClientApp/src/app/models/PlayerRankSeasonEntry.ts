import { PlayerRankPlot } from './PlayerRankPlot';

export interface PlayerRankSeasonEntry {
    email: string;
    seasonName: string;
    rankPlots: PlayerRankPlot[];
}
