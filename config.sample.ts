const config = {
  httpPort: 4000,
  secretKey: "12345-67890-09876-54321",
  mongoUrl:
    "mongodb://ontime:ontime123!@c.idvlabs.com:27017/wallet?authSource=wallet",
  mongo: {
    username: "ontime",
    password: "ontime123!",
    host: "c.idvlabs.com",
    database: "wallet",
    port: 27017,
  },
  email: {
    userID: "0427f74e-4fb9-4983-9efe-8aafb9c9e3df",
    clientId: "b94f73c8-26b3-4877-806b-f0eb01786eb4",
    clientSecret: "vWG8Q~XBQg.22fZauGM7znog9LodkPACDmxjVcin",
    tenantId: "e8493e19-028e-46d4-8c37-5189d1df3292",
  },
};

export default config;
