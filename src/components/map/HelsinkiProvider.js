// @flow
import {BaseProvider} from 'leaflet-geosearch';
console.log(BaseProvider);

export default class Provider {
  options: Object

  constructor(options: Object = {}) {
    this.options = options;
  }

  getParamString(params: Object) {
    return Object.keys(params).map(key =>
      `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    ).join('&');
  }

  async search({query}: Object) {
    // eslint-disable-next-line no-bitwise
    const protocol = ~location.protocol.indexOf('http') ? location.protocol : 'https:';
    const url = this.endpoint({query, protocol});

    const request = await fetch(url);
    const json = await request.json();
    return this.parse({data: json});
  }

  endpoint({query}:any = {}) {
    const {params} = this.options;

    const paramString = this.getParamString({
      ...params,
      name: query,
    });

    const proto = 'https:';
    return `${proto}//dev.hel.fi/geocoder/v1/address/?${paramString}&municipality=91`;
  }

  parse({data}: any) {
    return data.objects.map(r => {
      return {
        x: r.location.coordinates[0],
        y: r.location.coordinates[1],
        label: r.name,
      };
    });
  }
}
