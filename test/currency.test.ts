import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index"; // app'inizin doğru yolunu kontrol edin
import UserModel from "../src/models/User";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Currency Endpoints", () => {
  let authToken: string;
  let createdCurrencyId: string;

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

  // Kullanıcı girişi testi
  it("should authenticate an existing user", async () => {
    const res = await chai.request(app).post("/api/auth/signin").send({
      email: "testuser@gmail.com",
      password: "123123",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });

  it("should create a new currency", async () => {
    const res = await chai
      .request(app)
      .post("/api/currencies/createCurrency")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "test",
        symbol: "$£",
        code: "demo",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");

    // Eklenen para biriminin ID'sini sakla
    createdCurrencyId = res.body._id;
  });

  it("should get all currencies", async () => {
    const res = await chai
      .request(app)
      .get("/api/currencies/getAllCurrencies")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should get currency by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/currencies/${createdCurrencyId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
  });

  it("should update a currency", async () => {
    const res = await chai
      .request(app)
      .put(`/api/currencies/${createdCurrencyId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "demo",
        code: "test",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
  });

  it("should delete a currency", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/currencies/${createdCurrencyId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(204);
  });
});
