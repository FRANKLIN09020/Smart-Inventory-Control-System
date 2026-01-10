import { Router } from "express";

/* Auth & User */
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";

/* RBAC */
import roleRoutes from "./modules/roles/roles.routes";
import permissionRoutes from "./modules/permissions/permissions.routes";

/* Masters */
import categoryRoutes from "./modules/categories/categories.routes";
import unitRoutes from "./modules/units/units.routes";
import productRoutes from "./modules/products/products.routes";

/* Inventory */
import inventoryRoutes from "./modules/inventory/inventory.routes";

/* Customers & Sales */
import customerRoutes from "./modules/customers/customers.routes";
import invoiceRoutes from "./modules/invoices/invoices.routes";
import paymentRoutes from "./modules/payments/payments.routes";

/* POS */
import posRoutes from "./modules/pos/pos.routes";

/* Dashboard & Reports */
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import reportRoutes from "./modules/reports/reports.routes";

/* Settings */
// import settingsRoutes from "./modules/settings/settings.routes";

const router = Router();

/* ============================
   AUTHENTICATION
============================ */
router.use("/api/auth", authRoutes);

/* ============================
   USERS & RBAC
============================ */
router.use("/api/users", userRoutes);
router.use("/api/roles", roleRoutes);
router.use("/api/permissions", permissionRoutes);

/* ============================
   PRODUCT MASTERS
============================ */
router.use("/api/categories", categoryRoutes);
router.use("/api/units", unitRoutes);
router.use("/api/products", productRoutes);

/* ============================
   INVENTORY
============================ */
router.use("/api/inventory", inventoryRoutes);

/* ============================
   CUSTOMERS & BILLING
============================ */
router.use("/api/customers", customerRoutes);
router.use("/api/invoices", invoiceRoutes);
router.use("/api/payments", paymentRoutes);

/* ============================
   POS
============================ */
router.use("/api/pos", posRoutes);

/* ============================
   DASHBOARD & REPORTS
============================ */
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/reports", reportRoutes);

/* ============================
   SETTINGS
============================ */
// router.use("/api/settings", settingsRoutes);

export default router;
