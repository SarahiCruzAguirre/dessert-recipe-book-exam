/**
 * SIDE: Server-side (Type Definitions)
 * Description: Extension of NextAuth typings. Adds user ID and user role to JWT and session object types.
 */

import "next-auth";
import "next-auth/jwt";


declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
