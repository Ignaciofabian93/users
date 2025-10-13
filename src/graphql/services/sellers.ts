import prisma from "../../client/prisma";
import { ErrorService } from "../../errors/errors";
import { hash, genSalt, compare } from "bcrypt";
import { sendWelcomeEmail } from "../../mail/register";
import {
  RegisterBusinessInput,
  RegisterPersonInput,
  SellerArgs,
  UpdateBusinessProfileInput,
  UpdatePersonProfileInput,
  UpdateSellerInput,
} from "../resolvers/sellers";
import { Context } from "../../types/context";
import { Prisma } from "@prisma/client";
import { Seller } from "../../types/user";

export const SellerService = {
  // User queries
  getSellers: async ({ sellerType, isActive, isVerified, limit, offset, sellerId }: SellerArgs & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const where: Record<string, any> = {};
      if (sellerType) where.sellerType = sellerType;
      if (isActive !== undefined) where.isActive = isActive;
      if (isVerified !== undefined) where.isVerified = isVerified;

      const sellers = await prisma.seller.findMany({
        where,
        include: {
          personProfile: true,
          businessProfile: true,
          country: true,
          region: true,
          city: true,
          county: true,
          sellerCategory: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit || undefined,
        skip: offset || undefined,
      });
      return sellers;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw new ErrorService.InternalServerError("Error al obtener usuarios");
    }
  },

  getSellerById: async ({ id, sellerId }: { id: string } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const user = await prisma.seller.findUnique({
        where: { id },
        include: {
          personProfile: true,
          businessProfile: true,
          country: true,
          region: true,
          city: true,
          county: true,
          sellerCategory: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw new ErrorService.InternalServerError("Error al obtener usuario por ID");
    }
  },

  getMe: async ({ sellerId }: Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const sellerType = await prisma.seller.findUnique({
        where: { id: sellerId },
        select: { sellerType: true },
      });

      if (sellerType?.sellerType === "PERSON") {
        const userProfile = await prisma.seller.findUnique({
          where: { id: sellerId },
          include: {
            personProfile: true,
            country: true,
            region: true,
            city: true,
            county: true,
            sellerCategory: true,
          },
        });

        return userProfile;
      } else if (sellerType?.sellerType === "STARTUP" || sellerType?.sellerType === "COMPANY") {
        const businessProfile = await prisma.seller.findUnique({
          where: { id: sellerId },
          include: {
            businessProfile: true,
            country: true,
            region: true,
            city: true,
            county: true,
            sellerCategory: true,
          },
        });
        return businessProfile;
      }
    } catch (error) {
      console.error("Error al obtener usuario actual:", error);
      throw new ErrorService.InternalServerError("Error al obtener usuario actual");
    }
  },

  getStores: async ({ isActive, isVerified, limit, offset, sellerId }: SellerArgs & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const stores = await prisma.seller.findMany({
        where: {
          sellerType: { in: ["STARTUP", "COMPANY"] },
          isActive: isActive !== undefined ? isActive : true,
          isVerified: isVerified !== undefined ? isVerified : true,
        },
        include: {
          businessProfile: {
            where: {
              businessActivity: { in: ["RETAIL", "MIXED"] },
            },
          },
          country: true,
          region: true,
          city: true,
          county: true,
          sellerCategory: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit || undefined,
        skip: offset || undefined,
      });
      return stores;
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
      throw new ErrorService.InternalServerError("Error al obtener tiendas");
    }
  },

  getStoreCatalog: async () => {
    try {
      const stores = await prisma.seller.findMany({
        where: {
          sellerType: { in: ["STARTUP", "COMPANY"] },
        },
        include: {
          businessProfile: {
            where: {
              businessActivity: { in: ["RETAIL", "MIXED"] },
            },
          },
        },
      });
      return stores;
    } catch (error) {
      console.error("Error al obtener catálogo de tiendas:", error);
      throw new ErrorService.InternalServerError("Error al obtener catálogo de tiendas");
    }
  },

  // User categories
  getUserCategories: async () => {
    try {
      const categories = await prisma.sellerCategory.findMany({
        orderBy: { level: "asc" },
      });
      return categories;
    } catch (error) {
      console.error("Error al obtener categorías de usuario:", error);
      throw new ErrorService.InternalServerError("Error al obtener categorías de usuario");
    }
  },

  getUserCategory: async ({ id }: { id: string }) => {
    try {
      const category = await prisma.sellerCategory.findUnique({
        where: { id: Number(id) },
      });
      return category;
    } catch (error) {
      console.error("Error al obtener categoría de usuario:", error);
      throw new ErrorService.InternalServerError("Error al obtener categoría de usuario");
    }
  },

  // Registration
  registerPerson: async (input: RegisterPersonInput) => {
    try {
      const { email, password, firstName, lastName } = input;

      // Check if user already exists
      const existingUser = await prisma.seller.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new ErrorService.BadRequestError("Ya existe un usuario con este email");
      }

      // Hash password
      const salt = await genSalt(12);
      const hashedPassword = await hash(password, salt);

      // Create user and profile in transaction
      const result: Seller = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.seller.create({
          data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            sellerType: "PERSON",
            updatedAt: new Date(),
          },
        });

        await tx.personProfile.create({
          data: {
            sellerId: user.id,
            firstName,
            lastName,
          },
        });

        return user;
      });

      // Send welcome email
      await sendWelcomeEmail(email.toLowerCase(), firstName, "");

      return result;
    } catch (error) {
      console.error("Error al registrar persona:", error);
      if (error instanceof ErrorService.BadRequestError) throw error;
      throw new ErrorService.InternalServerError("Error al registrar persona");
    }
  },

  registerBusiness: async (input: RegisterBusinessInput) => {
    try {
      const { email, password, businessName, displayName, businessType, sellerType } = input;

      // Check if user already exists
      const existingUser = await prisma.seller.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        throw new ErrorService.BadRequestError("Ya existe un usuario con este email");
      }

      // Hash password
      const salt = await genSalt(12);
      const hashedPassword = await hash(password, salt);

      // Create user and profile in transaction
      const result: Seller = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.seller.create({
          data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            sellerType,
            updatedAt: new Date(),
          },
        });

        await tx.businessProfile.create({
          data: {
            sellerId: user.id,
            businessName,
            displayName,
            updatedAt: new Date(),
            businessType,
          },
        });

        return user;
      });

      // Send welcome email
      await sendWelcomeEmail(email.toLowerCase(), "", businessName);

      return result;
    } catch (error) {
      console.error("Error al registrar negocio:", error);
      if (error instanceof ErrorService.BadRequestError) throw error;
      throw new ErrorService.InternalServerError("Error al registrar negocio");
    }
  },

  // Profile updates
  updateSeller: async ({ sellerId, input }: { input: UpdateSellerInput } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }

      const result: Seller = await prisma.seller.update({
        where: { id: sellerId },
        data: input,
      });

      return result;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      if (error instanceof ErrorService.BadRequestError) {
        throw error;
      }
      throw new ErrorService.InternalServerError("Error al actualizar usuario");
    }
  },

  updatePersonProfile: async ({ sellerId, input }: { input: UpdatePersonProfileInput } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      // Handle birthday field conversion from date string to DateTime
      const processedInput = { ...input };
      if (processedInput.birthday && typeof processedInput.birthday === "string") {
        // Parse date string and create a proper DateTime with current timezone
        const date = new Date(processedInput.birthday);
        // Set time to current time instead of midnight UTC to match creation pattern
        const now = new Date();
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        processedInput.birthday = date;
      }

      const person = await prisma.personProfile.update({
        where: { sellerId },
        data: processedInput,
      });

      return person;
    } catch (error) {
      console.error("Error al actualizar perfil de persona:", error);
      throw new ErrorService.InternalServerError("Error al actualizar perfil de persona");
    }
  },

  updateBusinessProfile: async ({ sellerId, input }: { input: UpdateBusinessProfileInput } & Context) => {
    try {
      if (!sellerId) {
        throw new ErrorService.UnAuthorizedError("No autorizado");
      }
      const business = await prisma.businessProfile.update({
        where: { sellerId },
        data: input,
      });

      return business;
    } catch (error) {
      console.error("Error al actualizar perfil de tienda:", error);
      throw new ErrorService.InternalServerError("Error al actualizar perfil de tienda");
    }
  },
};
