import { Injectable } from '@nestjs/common';
import IP2Region from 'ip2region';

@Injectable()
export class IpLocationService {
  query: IP2Region = new IP2Region();

  constructor() {}

  async getIpLocation(ip: string): Promise<string> {
    const address = this.query.search(ip);

    return JSON.stringify(address);
  }
}
