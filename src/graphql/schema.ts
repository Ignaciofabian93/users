import gql from "graphql-tag";

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  enum AdminRole {
    SUPER_ADMIN
    MODERATOR
    CONTENT_MANAGER
    SUPPORT
    BUSINESS_OWNER
    BUSINESS_MANAGER
    BUSINESS_ANALYST
    BUSINESS_SUPPORT
  }

  enum AdminPermission {
    MANAGE_PRODUCTS
    APPROVE_PRODUCTS
    DELETE_PRODUCTS
    WRITE_BLOG
    PUBLISH_BLOG
    DELETE_BLOG
    MODERATE_CONTENT
    MANAGE_USERS
    BAN_USERS
    VIEW_USER_DATA
    MANAGE_ORDERS
    PROCESS_REFUNDS
    VIEW_TRANSACTIONS
    VIEW_ANALYTICS
    EXPORT_DATA
    MANAGE_ADMINS
    MANAGE_CATEGORIES
    MANAGE_SETTINGS
    VIEW_SYSTEM_LOGS
    MANAGE_BUSINESS_PROFILE
    MANAGE_BUSINESS_TEAM
    VIEW_BUSINESS_ANALYTICS
    MANAGE_BUSINESS_PRODUCTS
    MANAGE_BUSINESS_ORDERS
  }

  enum AdminType {
    PLATFORM
    BUSINESS
  }

  enum AccountType {
    FREE
    PLUS
    PREMIUM
  }

  enum ContactMethod {
    EMAIL
    WHATSAPP
    PHONE
    INSTAGRAM
    FACEBOOK
    WEBSITE
    TIKTOK
  }

  enum SellerType {
    PERSON
    STARTUP
    COMPANY
  }

  enum BusinessType {
    RETAIL
    SERVICES
    MIXED
  }

  enum BusinessFormalizationStatus {
    NOT_REQUIRED
    PENDING
    IN_PROGRESS
    FORMALIZED
  }

  type Admin @key(fields: "id") {
    id: ID!
    email: String!
    password: String!
    name: String!
    lastName: String
    adminType: AdminType!
    role: AdminRole!
    permissions: [AdminPermission!]!
    sellerId: String
    isActive: Boolean!
    isEmailVerified: Boolean!
    accountLocked: Boolean!
    loginAttempts: Int!
    lastLoginAt: DateTime
    lastLoginIp: String
    createdAt: DateTime!
    updatedAt: DateTime!
    cityId: Int
    countryId: Int
    countyId: Int
    regionId: Int
    # Relations
    city: City
    country: Country
    county: County
    region: Region
    seller: Seller
    activityLogs: [AdminActivityLog!]!
  }

  type AdminActivityLog {
    id: ID!
    adminId: String!
    action: String!
    entityType: String
    entityId: String
    changes: JSON
    ipAddress: String
    userAgent: String
    metadata: JSON
    createdAt: DateTime!
  }

  type SellerCategory {
    id: ID!
    name: String!
    categoryDiscountAmount: Int!
    pointsThreshold: Int!
    level: Int!
  }

  type SellerPreferences {
    id: ID!
    sellerId: String!
    preferredLanguage: String
    currency: String
    emailNotifications: Boolean!
    pushNotifications: Boolean!
    orderUpdates: Boolean!
    communityUpdates: Boolean!
    securityAlerts: Boolean!
    weeklySummary: Boolean!
    twoFactorAuth: Boolean!
  }

  type County {
    id: ID!
    county: String!
  }

  type City {
    id: ID!
    city: String!
  }

  type Region {
    id: ID!
    region: String!
  }

  type Country {
    id: ID!
    country: String!
  }

  type PersonProfile {
    id: ID!
    sellerId: String!
    firstName: String!
    lastName: String
    displayName: String
    bio: String
    birthday: DateTime
    profileImage: String
    coverImage: String
    allowExchanges: Boolean!
  }

  type BusinessProfile {
    id: ID!
    sellerId: String!
    businessName: String!
    description: String
    logo: String
    coverImage: String
    businessType: BusinessType!
    legalBusinessName: String
    taxId: String
    businessStartDate: DateTime
    legalRepresentative: String
    legalRepresentativeTaxId: String
    shippingPolicy: String
    returnPolicy: String
    serviceArea: String
    yearsOfExperience: Int
    certifications: [String!]!
    travelRadius: Int
    businessHours: JSON
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Session {
    id: ID!
    token: String!
    createdAt: DateTime!
    expiresAt: DateTime!
    sellerId: String!
  }

  scalar DateTime
  scalar JSON

  union Profile = PersonProfile | BusinessProfile

  type Seller @key(fields: "id") {
    id: ID!
    email: String!
    sellerType: SellerType!
    isActive: Boolean!
    isVerified: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    address: String
    phone: String
    website: String
    preferredContactMethod: ContactMethod
    socialMediaLinks: JSON
    points: Int!
    county: County
    city: City
    region: Region
    country: Country
    sellerCategory: SellerCategory
    preferences: SellerPreferences
    profile: Profile
  }

  input RegisterPersonInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  input RegisterBusinessInput {
    email: String!
    password: String!
    businessName: String!
    displayName: String
    sellerType: SellerType!
    businessType: BusinessType!
  }

  input UpdatePersonProfileInput {
    firstName: String
    lastName: String
    displayName: String
    bio: String
    birthday: DateTime
    profileImage: String
    coverImage: String
    allowExchanges: Boolean
  }

  input UpdateBusinessProfileInput {
    businessName: String
    description: String
    logo: String
    coverImage: String
    businessType: BusinessType
    legalBusinessName: String
    taxId: String
    businessStartDate: DateTime
    legalRepresentative: String
    legalRepresentativeTaxId: String
    shippingPolicy: String
    returnPolicy: String
    serviceArea: String
    yearsOfExperience: Int
    certifications: [String!]
    travelRadius: Int
    businessHours: JSON
  }

  input UpdateSellerPreferencesInput {
    preferredLanguage: String
    currency: String
    emailNotifications: Boolean
    pushNotifications: Boolean
    orderUpdates: Boolean
    communityUpdates: Boolean
    securityAlerts: Boolean
    weeklySummary: Boolean
    twoFactorAuth: Boolean
  }

  input UpdateSellerInput {
    email: String
    address: String
    cityId: Int
    countyId: Int
    regionId: Int
    countryId: Int
    phone: String
    website: String
    preferredContactMethod: ContactMethod
    socialMediaLinks: JSON
    accountType: AccountType
  }

  extend type Query {
    # Location queries
    countries: [Country!]!
    regionsByCountryId(countryId: ID!): [Region!]!
    citiesByRegionId(regionId: ID!): [City!]!
    countiesByCityId(cityId: ID!): [County!]!

    # Seller queries
    sellers(sellerType: SellerType, isActive: Boolean, isVerified: Boolean, limit: Int, offset: Int): [Seller!]!
    seller(id: ID!): Seller
    me: Seller

    # Categories
    sellerCategories: [SellerCategory!]!
    sellerCategory(id: ID!): SellerCategory
  }

  extend type Mutation {
    # Registration
    registerPerson(input: RegisterPersonInput!): Seller!
    registerBusiness(input: RegisterBusinessInput!): Seller!

    # Password management
    updatePassword(currentPassword: String!, newPassword: String!): Seller!
    requestPasswordReset(email: String!): Boolean!

    # Profile updates
    updateSeller(input: UpdateSellerInput!): Seller!
    updatePersonProfile(input: UpdatePersonProfileInput!): PersonProfile!
    updateBusinessProfile(input: UpdateBusinessProfileInput!): BusinessProfile!
    updateSellerPreferences(input: UpdateSellerPreferencesInput!): SellerPreferences!

    # Account management
    deactivateAccount: Seller!
    reactivateAccount: Seller!

    # Points and category management
    addPoints(id: ID!, points: Int!): Seller!
    deductPoints(id: ID!, points: Int!): Seller!
    updateSellerCategory(id: ID!, categoryId: ID!): Seller!
  }
`;
