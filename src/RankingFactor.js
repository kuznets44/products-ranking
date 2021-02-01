export default class RankingFactor {
  id = 0;
  name = '';
  weight = 100;
  paramsComponent = '';
  active = true;
  getValue = new Function();
  params = [];
  shortName = '';

  constructor(id,name,shortName,weight,paramsComponent,getValue,params = [],active = true) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.weight = weight;
    this.getValue = getValue;
    this.active = active;
    this.paramsComponent = paramsComponent;
    this.params = [];
    params.forEach(param => this.params.push(parseFloat(param)));
  }
}
