import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import UserModel, { User } from "../src/models/User";
import { WalletCardModel } from "../src/models/WalletCards";

chai.use(chaiHttp);
const expect = chai.expect;

describe("WalletCard Endpoints", () => {
  let authToken: string;
  let userId: string;

  // Kullanıcı rolü oluştur ve giriş yap
  it("should register a new user", async () => {
    const emailVerificationRes = await chai
      .request(app)
      .post("/api/auth/sendEmailActivationCode")
      .send({
        email: "testuser@gmail.com",
      });

    expect(emailVerificationRes).to.have.status(200);

    const user = await UserModel.findOne({ email: "testuser@gmail.com" });

    const verificationCode = await chai
      .request(app)
      .post("/api/auth/verifyEmailActivationCode")
      .send({
        email: "testuser@gmail.com",
        verificationCode: user?.verificationCode,
      });

    expect(verificationCode).to.have.status(200);

    const res = await chai.request(app).post("/api/auth/signup").send({
      name: "test user",
      phoneNumber: "123-456-7890",
      photo: "user.jpg",
      email: "testuser@gmail.com",
      password: "123123",
    });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("token");
    authToken = res.body.token;
  });

  it("should get wallet card by user ID", async () => {
    const res = await chai
      .request(app)
      .get("/api/walletCards/getWalletCardByUserId")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("cardNumber");
    expect(res.body).to.have.property("balance");
    expect(res.body).to.have.property("currency");
  });

  it("should get wallet card balance", async () => {
    const res = await chai
      .request(app)
      .get("/api/walletCards/getBalance")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("balance");
  });

  it("should update wallet card balance", async () => {
    const amount = 100; // update amount
    const res = await chai
      .request(app)
      .post("/api/walletCards/updateWalletCardBalance")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        amount,
        operation: "+",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("newBalance");
  });

  it("should delete wallet card", async () => {
    const res = await chai
      .request(app)
      .delete("/api/walletCards/deleteWalletCard")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body)
      .to.have.property("message")
      .to.equal("Wallet card successfully deactivated");
  });

  // Test sonunda kullanıcıyı temizle
  after(async () => {
    console.log("deleted user");
    const user = await UserModel.findById(userId);
    if (user) await WalletCardModel.deleteMany({ user: user });
    await UserModel.deleteOne({ _id: userId });
  });
});
