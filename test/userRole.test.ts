import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/index";
import { UserRoleModel as UserRole } from "../src/models/UserRole";
import UserModel from "../src/models/User";

chai.use(chaiHttp);
const expect = chai.expect;

describe("UserRole Endpoints", () => {
  let authToken: string;
  let createdUserRole: any;

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

  // Kullanıcı girişi testi
  it("should authenticate an existing user", async () => {
    const res = await chai.request(app).post("/api/auth/signin").send({
      email: "testuser@gmail.com",
      password: "123123",
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });
  it("should create a new user role", async () => {
    const res = await chai
      .request(app)
      .post("/api/userRoles/createUserRole")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "TestRole",
        description: "Test Role Description",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
    createdUserRole = res.body;
  });

  it("should update the created user role by ID", async () => {
    const res = await chai
      .request(app)
      .put(`/api/userRoles/${createdUserRole._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        description: "Updated Test Role Description",
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("_id");
    expect(res.body.description).to.equal("Updated Test Role Description");
  });

  it("should delete the created user role", async () => {
    const res = await chai
      .request(app)
      .delete(`/api/userRoles/${createdUserRole._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res).to.have.status(204);
  });

  // Test sonunda kullanıcıyı temizle
  after(async () => {
    await UserModel.deleteOne({ email: "testuser@gmail.com" });
    await UserRole.deleteOne({ _id: createdUserRole._id });
  });
});
