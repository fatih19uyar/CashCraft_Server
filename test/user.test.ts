import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import UserModel from "../src/models/User";

chai.use(chaiHttp);
const expect = chai.expect;

describe("User Endpoints", () => {
  let authToken: string;
  let userId: string;
  let confirmationCode: string | undefined;
  // Kullanıcı oluştur ve giriş yap
  before(async () => {
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

    const signup = await chai.request(app).post("/api/auth/signup").send({
      name: "test user",
      phoneNumber: "123-456-7890",
      photo: "user.jpg",
      email: "testuser@gmail.com",
      password: "123123",
    });

    expect(signup).to.have.status(201);

    const loginRes = await chai.request(app).post("/api/auth/signin").send({
      email: "testuser@gmail.com",
      password: "123123",
    });

    expect(loginRes).to.have.status(200);
    expect(loginRes.body).to.have.property("token");

    authToken = loginRes.body.token;
    userId = user?._id;
  });

  it("should list users", async () => {
    const res = await chai
      .request(app)
      .get("/api/users/listUser")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
  });

  it("should find the authenticated user", async () => {
    const res = await chai
      .request(app)
      .get("/api/users/findUser")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
  });

  it("should update the authenticated user", async () => {
    const res = await chai
      .request(app)
      .put("/api/users/updateUser")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Test User",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
    expect(res.body.name).to.equal("Updated Test User");
  });
  it("should create the confirmation code", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/confirmationCode")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: userId,
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Conformation added.");
    const user = await UserModel.findOne({ email: "testuser@gmail.com" });
    confirmationCode = user?.confirmationCode;
  });
  it("should create the confirmation code", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/confirmationCode")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: userId,
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Conformation added.");
    const user = await UserModel.findOne({ email: "testuser@gmail.com" });
    confirmationCode = user?.confirmationCode;
  });
  it("should verify the authenticated user", async () => {
    const res = await chai
      .request(app)
      .post("/api/auth/verifyConfirmationCode")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: userId,
        confirmationCode: confirmationCode,
      });

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Confirmation Success.");
  });

  it("should delete the authenticated user", async () => {
    const res = await chai
      .request(app)
      .delete("/api/users/deleteUser")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(200);
    expect(res.body)
      .to.have.property("message")
      .to.equal("Kullanıcı başarıyla silindi");
  });

  // Test sonunda kullanıcıyı temizle
  after(async () => {
    console.log("deleted user");
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
  });
});
