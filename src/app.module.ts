import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as dotenv from 'dotenv';
import { join } from 'path';
import './common/ensure-uploads';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { SettingsModule } from './settings/settings.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';

dotenv.config();

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ProductsModule,
    OrdersModule,
    CategoriesModule,
    SettingsModule,
    SubcategoriesModule,
  ],
})
export class AppModule {}
