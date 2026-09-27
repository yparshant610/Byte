import { haversineDistanceKm } from '@repo/shared-utils';

export interface GeoPoint {
  lng: number;
  lat: number;
}

export class InMemoryRedisMock {
  private kv = new Map<string, string>();
  private ttls = new Map<string, number>();
  private hashes = new Map<string, Map<string, string>>();
  private geoSets = new Map<string, Map<string, GeoPoint>>();

  private isExpired(key: string): boolean {
    const expireAt = this.ttls.get(key);
    if (!expireAt) return false;
    if (Date.now() > expireAt) {
      this.kv.delete(key);
      this.hashes.delete(key);
      this.ttls.delete(key);
      this.geoSets.delete(key);
      return true;
    }
    return false;
  }

  async get(key: string): Promise<string | null> {
    if (this.isExpired(key)) return null;
    return this.kv.get(key) ?? null;
  }

  async set(key: string, value: string, ...args: any[]): Promise<'OK'> {
    this.kv.set(key, value);
    if (args.length >= 2 && typeof args[0] === 'string' && args[0].toUpperCase() === 'EX') {
      const seconds = Number(args[1]);
      if (!isNaN(seconds)) {
        this.ttls.set(key, Date.now() + seconds * 1000);
      }
    }
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    this.kv.set(key, value);
    this.ttls.set(key, Date.now() + seconds * 1000);
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.kv.delete(key)) count++;
      this.hashes.delete(key);
      this.ttls.delete(key);
      if (this.geoSets.delete(key)) count++;
    }
    return count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.kv.has(key) && !this.geoSets.has(key) && !this.hashes.has(key)) return 0;
    this.ttls.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const expireAt = this.ttls.get(key);
    if (!expireAt) return -1;
    const remaining = Math.round((expireAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async exists(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (!this.isExpired(key) && (this.kv.has(key) || this.geoSets.has(key) || this.hashes.has(key))) {
        count++;
      }
    }
    return count;
  }

  // --- HASH OPERATIONS ---
  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.hashes.has(key)) this.hashes.set(key, new Map());
    const hash = this.hashes.get(key)!;
    const isNew = !hash.has(field);
    hash.set(field, value);
    return isNew ? 1 : 0;
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (this.isExpired(key)) return null;
    const hash = this.hashes.get(key);
    return hash?.get(field) ?? null;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (this.isExpired(key)) return {};
    const hash = this.hashes.get(key);
    if (!hash) return {};
    const obj: Record<string, string> = {};
    for (const [k, v] of hash.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  // --- GEOSPATIAL COMMANDS ---
  async geoadd(key: string, ...args: any[]): Promise<number> {
    if (!this.geoSets.has(key)) {
      this.geoSets.set(key, new Map());
    }
    const set = this.geoSets.get(key)!;
    let added = 0;
    for (let i = 0; i < args.length; i += 3) {
      const lng = Number(args[i]);
      const lat = Number(args[i + 1]);
      const member = String(args[i + 2]);
      if (!isNaN(lng) && !isNaN(lat) && member) {
        set.set(member, { lng, lat });
        added++;
      }
    }
    return added;
  }

  async geopos(key: string, ...members: string[]): Promise<Array<[string, string] | null>> {
    const set = this.geoSets.get(key);
    if (!set) return members.map(() => null);
    return members.map(m => {
      const point = set.get(m);
      return point ? [point.lng.toString(), point.lat.toString()] : null;
    });
  }

  async geodist(key: string, member1: string, member2: string, unit = 'km'): Promise<string | null> {
    const set = this.geoSets.get(key);
    if (!set) return null;
    const p1 = set.get(member1);
    const p2 = set.get(member2);
    if (!p1 || !p2) return null;
    const dist = haversineDistanceKm({ lat: p1.lat, lng: p1.lng }, { lat: p2.lat, lng: p2.lng });
    return dist.toFixed(4);
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const set = this.geoSets.get(key);
    if (!set) return 0;
    let removed = 0;
    for (const m of members) {
      if (set.delete(m)) removed++;
    }
    return removed;
  }

  async geosearch(key: string, ...args: any[]): Promise<any[]> {
    const set = this.geoSets.get(key);
    if (!set) return [];

    let originLng = 0;
    let originLat = 0;
    let radius = 10;
    let withDist = false;
    let withCoord = false;
    let sortAsc = true;
    let count = Infinity;

    for (let i = 0; i < args.length; i++) {
      const arg = String(args[i]).toUpperCase();
      if (arg === 'FROMLONLAT' && i + 2 < args.length) {
        originLng = Number(args[i + 1]);
        originLat = Number(args[i + 2]);
        i += 2;
      } else if (arg === 'BYRADIUS' && i + 2 < args.length) {
        radius = Number(args[i + 1]);
        i += 2;
      } else if (arg === 'WITHDIST') {
        withDist = true;
      } else if (arg === 'WITHCOORD') {
        withCoord = true;
      } else if (arg === 'ASC') {
        sortAsc = true;
      } else if (arg === 'DESC') {
        sortAsc = false;
      } else if (arg === 'COUNT' && i + 1 < args.length) {
        count = Number(args[i + 1]);
        i += 1;
      }
    }

    const matches: Array<{ member: string; distKm: number; point: GeoPoint }> = [];

    for (const [member, point] of set.entries()) {
      const distKm = haversineDistanceKm({ lat: originLat, lng: originLng }, { lat: point.lat, lng: point.lng });
      if (distKm <= radius) {
        matches.push({ member, distKm, point });
      }
    }

    matches.sort((a, b) => (sortAsc ? a.distKm - b.distKm : b.distKm - a.distKm));
    const sliced = matches.slice(0, count);

    if (!withDist && !withCoord) {
      return sliced.map(m => m.member);
    }

    return sliced.map(m => {
      const item: any[] = [m.member];
      if (withDist) item.push(m.distKm.toFixed(4));
      if (withCoord) item.push([m.point.lng.toString(), m.point.lat.toString()]);
      return item;
    });
  }

  async quit(): Promise<'OK'> {
    this.kv.clear();
    this.ttls.clear();
    this.hashes.clear();
    this.geoSets.clear();
    return 'OK';
  }
}
