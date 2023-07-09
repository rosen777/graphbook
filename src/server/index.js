import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import compress from "compression";
import services from "./services";

const app = express();
const root = path.join(__dirname, "../../");
app.use(cors());

const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === "graphql") {
    (async () => {
      await services[name].start();
      services[name].applyMiddleware({ app });
    })();
  } else {
    app.use("/${name}", services[name]);
  }
}

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "*.amazonaws.com"],
    },
  })
);
app.use(compress());

app.listen(8000, () => console.log("Listening on port 8000"));
app.use("/", express.static(path.join(root, "dist/client")));
app.use("/uploads", express.static(path.join(root, "uploads")));
app.get(
  "/",
  (req, res) => {
    const random = Math.random() * (10 - 1) + 1;
    if (random > 5) next("route");
    else next();
  },
  function (req, res, next) {
    res.send("first");
  }
);

app.get("/", function (req, res, next) {
  res.send("second");
});
