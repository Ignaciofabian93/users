import { SellerService } from "../services/sellers";
import { AccountType, BusinessFormalizationStatus, BusinessType, ContactMethod, type SellerType } from "../../types/enums";
import { Context } from "../../types/context";

export type SellerArgs = {
  sellerType?: SellerType;
  isActive?: boolean;
  isVerified?: boolean;
  limit?: number;
  offset?: number;
};

export type RegisterPersonInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type RegisterBusinessInput = {
  email: string;
  password: string;
  businessName: string;
  displayName?: string;
  businessType: BusinessType;
  sellerType: SellerType;
};

export type UpdateSellerInput = {
  email: string;
  address: string;
  phone: string;
  website: string;
  preferredContactMethod: ContactMethod;
  socialMediaLinks: string;
  accountType: AccountType;
  countyId: number;
  cityId: number;
  regionId: number;
  countryId: number;
};

export type UpdatePersonProfileInput = {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  birthday: Date;
  profileImage: string;
  coverImage: string;
  allowExchanges: boolean;
};

export type UpdateBusinessProfileInput = {
  businessName: string;
  description: string;
  logo: string;
  coverImage: string;
  businessType: BusinessType;
  legalBusinessName: string;
  taxId: string;
  businessStartDate: Date;
  legalRepresentative: string;
  legalRepresentativeTaxId: string;
  shippingPolicy: string;
  returnPolicy: string;
  serviceArea: string;
  yearsOfExperience: number;
  certifications: string[];
  travelRadius: number;
  businessHours: string;
};

export const SellerResolver = {
  Query: {
    sellers: (_parent: unknown, _args: SellerArgs, context: Context) => SellerService.getSellers({ ..._args, ...context }),
    seller: (_parent: unknown, _args: { id: string }, context: Context) => SellerService.getSellerById({ ..._args, ...context }),
    me: (_parent: unknown, _args: unknown, context: Context) => SellerService.getMe({ ...context }),

    // Categories
    sellerCategories: () => SellerService.getUserCategories(),
    sellerCategory: (_parent: unknown, _args: { id: string }) => SellerService.getUserCategory(_args),
  },

  Mutation: {
    registerPerson: (_parent: unknown, _args: { input: RegisterPersonInput }) => SellerService.registerPerson(_args.input),
    registerBusiness: (_parent: unknown, _args: { input: RegisterBusinessInput }) => SellerService.registerBusiness(_args.input),

    updateSeller: (_parent: unknown, _args: { input: UpdateSellerInput }, context: Context) =>
      SellerService.updateSeller({ ..._args, ...context }),
    updatePersonProfile: (_parent: unknown, _args: { input: UpdatePersonProfileInput }, context: Context) =>
      SellerService.updatePersonProfile({ ..._args, ...context }),
    updateBusinessProfile: (_parent: unknown, _args: { input: UpdateBusinessProfileInput }, context: Context) =>
      SellerService.updateBusinessProfile({ ..._args, ...context }),
  },
};
