const app = require("./app");
const { env, connectDB } = require("./config");

connectDB();

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
