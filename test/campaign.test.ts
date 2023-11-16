import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import UserModel from "../src/models/User";
import { CampaignModel } from "../src/models/Campaign";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Campaign Endpoints", () => {
  let authToken: string;
  let createdCampaignId: string; // Yeni eklenen kampanyanın ID'sini saklamak için

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
  it("should create a new campaign", async () => {
    const res = await chai
      .request(app)
      .post("/api/campaigns/createCampaign")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        campName: "TestDemo",
        campImg: "Test.Demo",
        campDetails: "test.base64",
        campTitle: "test",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.campTitle).to.equal("test");

    // Eklenen kampanyanın ID'sini sakla
    createdCampaignId = res.body._id;
  });

  it("should get all campaigns", async () => {
    const res = await chai
      .request(app)
      .get("/api/campaigns/getAllCampaigns")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  // Test sonunda kullanıcıyı ve eklenen kampanyayı temizle
  after(async () => {
    console.log("deleted user and campaign");
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
    await CampaignModel.findByIdAndDelete(createdCampaignId);
  });
});
