import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument } from './store.schema';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<StoreDocument>,
  ) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const store = new this.storeModel(dto);
    return store.save();
  }

  async findAll(onlyActive = false): Promise<Store[]> {
    const filter = onlyActive ? { isActive: true } : {};
    return this.storeModel.find(filter).sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeModel.findById(id).exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async update(id: string, dto: Partial<CreateStoreDto>): Promise<Store> {
    const store = await this.storeModel
      .findByIdAndUpdate(id, dto, { new: true, returnDocument: 'after' })
      .exec();
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async remove(id: string): Promise<void> {
    const res = await this.storeModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException('Store not found');
    }
  }

  // Calculate distance between two coordinates using the Haversine formula
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Find the nearest active store
  async findNearest(latitude: number, longitude: number): Promise<{ store: Store | null; distance: number; isServiceable: boolean }> {
    const activeStores = await this.findAll(true);
    if (activeStores.length === 0) {
      return { store: null, distance: 0, isServiceable: false };
    }

    let nearestStore: Store | null = null;
    let minDistance = Infinity;

    for (const store of activeStores) {
      const distance = this.getDistance(latitude, longitude, store.latitude, store.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStore = store;
      }
    }

    const isServiceable = nearestStore ? minDistance <= nearestStore.deliveryRadius : false;

    return {
      store: nearestStore,
      distance: Number(minDistance.toFixed(2)),
      isServiceable,
    };
  }
}
