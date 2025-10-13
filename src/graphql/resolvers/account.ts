import { Context } from "../../types/context";
import { AccountService } from "../services/account";

export type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export const AccountResolver = {
  Mutation: {
    updatePassword: (_parent: unknown, _args: UpdatePasswordInput, context: Context) =>
      AccountService.updatePassword({ ..._args, ...context }),
    requestPasswordReset: (_parent: unknown, _args: { email: string }) => AccountService.requestPasswordReset({ ..._args }),

    deactivateAccount: (_parent: unknown, _args: unknown, context: Context) => AccountService.deactivateAccount({ ...context }),
    reactivateAccount: (_parent: unknown, _args: unknown, context: Context) => AccountService.reactivateAccount({ ...context }),

    addPoints: (_parent: unknown, _args: { id: string; points: number }, context: Context) =>
      AccountService.addPoints({ ..._args, ...context }),
    deductPoints: (_parent: unknown, _args: { id: string; points: number }, context: Context) =>
      AccountService.deductPoints({ ..._args, ...context }),
    updateSellerCategory: (_parent: unknown, _args: { id: string; categoryId: number }, context: Context) =>
      AccountService.updateSellerCategory({ ..._args, ...context }),
  },
};
