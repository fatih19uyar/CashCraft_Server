import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import UserModel from "../src/models/User";
import { CardModel } from "../src/models/Card";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Card Endpoints", () => {
  let authToken: string;
  let createdCardId: string;

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

  it("should create a new card", async () => {
    const user: any = await UserModel.find({ email: "testuser@gmail.com" });
    const res = await chai
      .request(app)
      .post("/api/cards/createCard")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        cardName: "Test Demo",
        cardNumber: "3311 1111 1111 1111",
        cardExpiration: "12/23",
        cardType: "VISA",
        cardStyle: "bank",
        cardNickName: "Test Visa Card",
        user: user?._id,
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");

    // Eklenen kartın ID'sini sakla
    createdCardId = res.body._id;
  });

  it("should get cards by user ID", async () => {
    const res = await chai
      .request(app)
      .get("/api/cards/getCardsByUser")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should get cards by user ID and card type", async () => {
    const cardType = "VISA"; // Test için uygun bir kart tipi belirtin
    const res = await chai
      .request(app)
      .get(`/api/cards/getCardsByUserIdAndCardType/${cardType}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should update a card", async () => {
    console.log("cre", createdCardId);
    const res = await chai
      .request(app)
      .put(`/api/cards/${createdCardId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        cardName: "Demo Demo",
        cardNickName: "Demo Visa Card",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
  });

  it("should delete a card", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/cards/${createdCardId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(204);
  });

  after(async () => {
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
    await CardModel.findByIdAndDelete(createdCardId);
  });
});
