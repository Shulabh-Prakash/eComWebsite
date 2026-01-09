import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authenticate } from "./middlewares/auth.js";
import adminRoutes from "./routes/admin.routes.js";
import tenantRoutes from "./routes/tenant.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});
app.use("/", adminRoutes);
app.use("/", tenantRoutes);
app.use("/products", userRoutes);

app.get("/health", (req, res) => {
  res.send("Backend running");
});

app.get("/secure", authenticate, (req, res) => {
  res.json({
    message: "Secure data",
    user: req.user,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
