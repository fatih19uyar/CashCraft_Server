import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index"; // app'inizin doğru yolunu kontrol edin
import UserModel from "../src/models/User";
import { TransactionModel } from "../src/models/Transaction";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Transaction Endpoints", () => {
  let authToken: string;
  let createdTransactionId: string;

  // Kullanıcı oluştur ve giriş yap
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

  it("should create a new transaction", async () => {
    const res = await chai
      .request(app)
      .post("/api/transactions/createTransaction")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "test",
        subtitle: "demo",
        price: "120",
        user: "6507717bc16df61df6f0eb82",
        currency: "651c31f65a3ed89a6e0ce802",
        card: "651c306d5e973c998426783d",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");

    // Eklenen işlemin ID'sini sakla
    createdTransactionId = res.body._id;
  });

  it("should get all transactions", async () => {
    const res = await chai
      .request(app)
      .get("/api/transactions/getAllTransactions")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should get a transaction by ID", async () => {
    const res = await chai
      .request(app)
      .get(`/api/transactions/${createdTransactionId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
  });

  it("should update a transaction", async () => {
    const res = await chai
      .request(app)
      .put(`/api/transactions/${createdTransactionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        subtitle: "demotest",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
    expect(res.body.subtitle).to.equal("demotest");
  });

  it("should delete a transaction", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/transactions/${createdTransactionId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(204);
  });

  after(async () => {
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
    await TransactionModel.findByIdAndDelete(createdTransactionId);
  });
});
