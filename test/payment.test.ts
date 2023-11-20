import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index"; // Uygulamanızın doğru yolunu kontrol edin
import UserModel from "../src/models/User";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Payment Endpoints", () => {
  let authToken: string;
  let userId: string;

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
    userId = user?._id;
    authToken = res.body.token;
  });

  // Kullanıcı girişi testi
  it("should authenticate an existing user", async () => {
    const res = await chai.request(app).post("/api/auth/signin").send({
      email: "testuser@gmail.com",
      password: "123123",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });

  it("should make a credit card payment", async () => {
    const res = await chai
      .request(app)
      .post("/api/payments/creditCardPayment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        creditCardNumber: "1000100010001000",
        cvv: "123",
        amount: "100",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").to.be.true;
  });

  it("should make a debit card payment", async () => {
    const res = await chai
      .request(app)
      .post("/api/payments/debitCardPayment")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        creditCardNumber: "1000100010001000",
        cvv: "123",
        amount: "100",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").to.be.true;
  });

  it("should deposit to account", async () => {
    const res = await chai
      .request(app)
      .put("/api/payments/deposit/" + userId) // user ID'sini değiştirin
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        amount: "200", // Örnek olarak yatırılacak miktarı ekleyin
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").to.be.true;
  });

  it("should get account info", async () => {
    const res = await chai
      .request(app)
      .get("/api/payments/getAccountInfo/" + userId) // user ID'sini değiştirin
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").to.be.true;
  });

  it("should withdraw from account", async () => {
    const res = await chai
      .request(app)
      .put("/api/payments/withdraw/" + userId) // user ID'sini değiştirin
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        amount: "50", // Örnek olarak çekilecek miktarı ekleyin
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("success").to.be.true;
  });

  after(async () => {
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
  });
});
