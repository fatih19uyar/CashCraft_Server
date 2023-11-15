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
        email: "fatihuyar39@gmail.com",
      });

    expect(emailVerificationRes).to.have.status(200);

    const user = await UserModel.findOne({ email: "fatihuyar39@gmail.com" });

    const verificationCode = await chai
      .request(app)
      .post("/api/auth/verifyEmailActivationCode")
      .send({
        email: "fatihuyar39@gmail.com",
        verificationCode: user?.verificationCode,
      });

    expect(verificationCode).to.have.status(200);

    const res = await chai.request(app).post("/api/auth/signup").send({
      name: "fatih uyar",
      phoneNumber: "123-456-7890",
      photo: "user.jpg",
      email: "fatihuyar39@gmail.com",
      password: "123123",
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("token");
  });

  // Kullanıcı girişi testi
  it("should authenticate an existing user", async () => {
    const res = await chai.request(app).post("/api/auth/signin").send({
      email: "fatihuyar39@gmail.com",
      password: "123123",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });

  // Test sonunda kullanıcıyı temizle
  after(async () => {
    console.log("deleted user");
    // Örnek olarak, test için oluşturulan kullanıcıyı silebilirsiniz
    await UserModel.deleteOne({ email: "fatihuyar39@gmail.com" });
  });
});
