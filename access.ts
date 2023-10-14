import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs) => {
    return !!session;
};

export const permissions = {
    isAdmin: ({ session }: ListAccessArgs) => {
      return !!session?.data.isAdmin},
    isDM: ({ session }: ListAccessArgs) => { 
      return !!session?.data.isDM},
    isUser: ({ session }: ListAccessArgs) => {
      return !!session?.data.isUser}
};

export const rules = {
    hideCreateButton: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (!!session?.data.isAdmin) {
        // Can create everyone
        return false; //hidden
      } else {
        // cannot create
        return true; //hidden
      }
    },
    canRead: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else {
          return true;
        }
    },
    canUpdate: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else if (!!session?.data.isAdmin || !!session?.data.isDM) {
          return true;
        } else {
          return false;
        }
    },
    hideDeleteButton: ({ session }: ListAccessArgs) => {
      if (!session) {
        return false;
      } else if (!!session?.data.isAdmin) {
        return false; //hidden
      } else {
        return true; //hidden
      }
    }
}