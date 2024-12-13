import { Injectable } from '@nestjs/common';
import * as geoip from 'geoip-lite';

interface IpLocationResponse {
  country: string;
  city: string;
  timezone: string;
}

@Injectable()
export class IpLocationService {
  constructor() {}

  async getIpLocation(ip: string): Promise<string> {
    const locationData = await this.fetchLocation(ip);

    return `${locationData?.country} ${locationData?.timezone} ${locationData?.city}`;
  }

  private async fetchLocation(ip: string): Promise<IpLocationResponse | null> {
    try {
      const response = geoip.lookup(ip);
      return response;
    } catch (error) {
      console.error('Error fetching IP location', error);
      return null;
    }
  }
}
