// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request} from '@loopback/rest';
import {Entity} from '@loopback/repository';

/**
 * interface definition of a function which accepts a request
 * and returns an authenticated user
 */
export interface AuthenticateFn {
  (request: Request): Promise<UserProfile | undefined>;
}

/**
 * interface definition of a user profile
 * http://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
}

export type Credentials = {
  email: string;
  password: string;
};

export type AuthenticatedUser<U extends Entity> = {
  authenticated: boolean;
  userInfo?: U;
};
