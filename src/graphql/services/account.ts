import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { Context } from "../../types/context";
import { hash, genSalt, compare } from "bcrypt";
import { UpdatePasswordInput } from "../resolvers/account";

export const AccountService = {
  // Account management
  deactivateAccount: async ({ sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const seller = await prisma.seller.update({
        where: { id: sellerId },
        data: { isActive: false },
      });

      return seller;
    } catch (error) {
      console.error("Error al desactivar cuenta:", error);
      throw new ErrorService.InternalServerError("Error al desactivar cuenta");
    }
  },

  reactivateAccount: async ({ sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const seller = await prisma.seller.update({
        where: { id: sellerId },
        data: { isActive: true },
      });

      return seller;
    } catch (error) {
      console.error("Error reactivating account:", error);
      throw new ErrorService.InternalServerError("Error al activar cuenta");
    }
  },

  // Points management
  addPoints: async ({ sellerId, points, id }: { id: string; points: number } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const seller = await prisma.seller.update({
        where: { id },
        data: { points: { increment: points } },
      });

      return seller;
    } catch (error) {
      console.error("Error adding points:", error);
      throw new ErrorService.InternalServerError("Error al incrementar puntos");
    }
  },

  deductPoints: async ({ sellerId, points, id }: { id: string; points: number } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const seller = await prisma.seller.update({
        where: { id },
        data: { points: { decrement: points } },
      });

      return seller;
    } catch (error) {
      console.error("Error deducting points:", error);
      throw new ErrorService.InternalServerError("Error al reducir puntos");
    }
  },

  updateSellerCategory: async ({ id, categoryId, sellerId }: { id: string; categoryId: number } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const parsedCategoryId = Number(categoryId);
      const seller = await prisma.seller.update({
        where: { id },
        data: { sellerCategoryId: parsedCategoryId },
      });

      return seller;
    } catch (error) {
      console.error("Error updating user category:", error);
      throw new ErrorService.InternalServerError("Error updating user category");
    }
  },

  // Password management
  updatePassword: async ({ sellerId, currentPassword, newPassword }: UpdatePasswordInput & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const seller = await prisma.seller.findUnique({
        where: { id: sellerId },
      });

      if (!seller || !(await compare(currentPassword, seller.password))) {
        throw new ErrorService.BadRequestError("La contraseña actual es incorrecta");
      }

      const salt = await genSalt(12);
      const hashedNewPassword = await hash(newPassword, salt);

      await prisma.seller.update({
        where: { id: sellerId },
        data: { password: hashedNewPassword },
      });

      return seller;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      if (error instanceof ErrorService.BadRequestError) throw error;
      throw new ErrorService.InternalServerError("Error al actualizar contraseña");
    }
  },

  requestPasswordReset: async ({ email }: { email: string }) => {},
};
