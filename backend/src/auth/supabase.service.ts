import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type User, createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { type AuthenticatedUser } from './types';

type SupabaseGetUserResponse = {
  data: {
    user: User | null;
  };
  error: { message: string } | null;
};

type SupabaseAuthClient = {
  auth: {
    getUser(token: string): Promise<SupabaseGetUserResponse>;
  };
};

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseAuthClient;

  constructor(private readonly prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase service credentials');
    }

    this.client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async getSupabaseUser(token: string): Promise<User> {
    const { data, error } = await this.client.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid Supabase access token');
    }

    return data.user;
  }

  async syncUser(user: User): Promise<AuthenticatedUser> {
    const authId = user.id;
    const email = user.email?.trim().toLowerCase();

    if (!email) {
      throw new UnauthorizedException('Authenticated user is missing an email');
    }

    const metadata = user.user_metadata ?? {};
    const fullName =
      typeof metadata.full_name === 'string' && metadata.full_name.trim()
        ? metadata.full_name.trim()
        : email.split('@')[0];
    const avatar = this.readAvatarUrl(metadata);

    const syncedUser = await this.prisma.$transaction(async (transaction) => {
      const byAuthId = await transaction.user.findUnique({
        where: { authId },
      });

      if (byAuthId) {
        return byAuthId;
      }

      const byEmail = await transaction.user.findUnique({
        where: { email },
      });

      if (byEmail) {
        return transaction.user.update({
          where: { id: byEmail.id },
          data: {
            authId,
            email,
            name: byEmail.name || fullName,
            avatar: avatar ?? byEmail.avatar,
          },
        });
      }

      return transaction.user.create({
        data: {
          authId,
          email,
          name: fullName,
          avatar,
        },
      });
    });

    return {
      id: syncedUser.id,
      authId: syncedUser.authId ?? authId,
      email: syncedUser.email,
    };
  }

  private readAvatarUrl(metadata: Record<string, unknown>): string | null {
    if (typeof metadata.avatar_url === 'string' && metadata.avatar_url.trim()) {
      return metadata.avatar_url.trim();
    }

    if (typeof metadata.picture === 'string' && metadata.picture.trim()) {
      return metadata.picture.trim();
    }

    return null;
  }
}
