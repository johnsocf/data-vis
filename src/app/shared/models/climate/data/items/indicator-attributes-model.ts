export interface IndicatorAttributesModel {
  countryName: string;
  countryCode: string;
  indicatorName: string;
  indicatorCode: string;
  data: {year: number, value: number}[];
}

export const initialIndicatorAttributes = {
  countryName: "Aruba",
  countryCode: "ABW",
  indicatorName: "Primary completion rate, total (% of relevant age group)",
  indicatorCode: "SE.PRM.CMPT.ZS",
  data: [{year: 1960, value: 0}]
};
