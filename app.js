import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import express from "express";
import adminRouter from "./routes/admin.routes.js"
import tenantRouter from "./routes/tenant.routes.js"
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.send("Backend running");
});
app.use("/",adminRouter)
app.use("/",tenantRouter)
app.use(productRoutes);
app.use(orderRoutes);

export default app;
