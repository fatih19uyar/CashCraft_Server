import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import UserModel from "../src/models/User";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Authentication Endpoints", () => {
  // Kullanıcı kaydı testi

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

  // Test sonunda kullanıcıyı temizle
  after(async () => {
    console.log("deleted user");
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
  });
});
