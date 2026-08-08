import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(username: string, pass: string): Promise<{ token: string; user: any }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(pass, user.password!);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = {
      sub: String(user._id),
      username: user.username,
      role: user.role,
      store: user.store ? String(user.store._id || user.store) : null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'veggie_secret_key_123', {
      expiresIn: '7d',
    });

    const userObj = user.toJSON();
    delete userObj.password;

    return {
      token,
      user: userObj,
    };
  }
}
