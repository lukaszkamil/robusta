const testData = {
  env: "prod",
  existedUser: {
    firstName: "John",
    lastName: "What",
    email: "john.what@wasthat.com",
    password: process.env.ALREADY_EXISTS_PASSOWRD,
  },
};

export default testData;
