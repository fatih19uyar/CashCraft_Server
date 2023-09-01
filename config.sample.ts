const config_sample = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl:
    "mongodb://ontime:ontime123!@c.idvlabs.com:27017/wallet?authSource=admin",
  mongo: {
    username: "ontime",
    password: "ontime123!",
    host: "c.idvlabs.com",
    database: "wallet",
    backupPath: "/home/ubuntu/Backups",
    port: 4000,
  },
};

export default config_sample;
