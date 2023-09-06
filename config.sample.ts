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
    HOST: "smtp.yandex.com",
    PORT: 587,
    USERNAME: "test@idvlabs.com",
    PASSWORD: "ZRBEG6PckJVqU9A",
  },
};

export default config;
