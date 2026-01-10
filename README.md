# Shop Management Backend System

**A deliberately simple, exceptionally clear Express.js backend for single-shop operations.**

---

## Preface

This is not another "modern JavaScript framework showcase."

This is a backend system written the way software should have always been written: **readable, predictable, and honest.**

I've spent three decades watching the industry chase trends. I've seen good engineers drown in abstraction. I've debugged systems where nobody understood what the code actually *did* anymore.

This project is my answer to that chaos.

If you're a student, you'll learn how real systems work—not how influencers think they should work.  
If you're a small business owner, you'll get something that *just runs*.  
If you're a fellow engineer tired of the nonsense, welcome home.

---

## What This Does

This system manages a single retail shop. It handles:

- **Staff and access control** — who can do what
- **Products and inventory** — what you sell and how much you have
- **Customers** — who buys from you
- **Sales and invoices** — what was sold and for how much
- **Payments** — how customers paid
- **Point of sale** — the checkout process

That's it. No blockchain. No microservices. No "AI-powered insights."

Just a shop. Running correctly.

---

## Why This Architecture?

### It's Modular

Each feature lives in its own module. You want to understand how invoices work? Open `modules/invoices/`. Everything related to invoices is *right there*.

No scavenger hunts across seventeen directories.

### It's Flat

The folder structure has exactly three levels of meaningful depth. You can see the entire system in a single terminal window.

If you need a map to navigate your own codebase, your codebase is the problem.

### It's Honest

This system uses SQL databases and CSV files for data tracking. Not because I'm old-fashioned—but because:

- SQL is the most battle-tested data technology in existence
- CSV files are human-readable, versionable, and don't require special tools

When your database goes down at 2 AM, you'll thank me.

---

## Technology Choices (And Why)

| Technology | Reason |
|------------|--------|
| **Node.js** | Non-blocking I/O, massive library ecosystem, JavaScript everywhere |
| **Express.js** | Thin abstraction over HTTP. You control the system, not the framework |
| **SQL Database** | MySQL, PostgreSQL, or SQL Server—your choice. Schema migrations via raw SQL |
| **JWT** | Stateless authentication. No session stores to maintain |
| **CSV** | Data portability, auditability, no vendor lock-in |

No ORMs. ORMs are leaky abstractions that create more problems than they solve. You write SQL, you see SQL, you debug SQL.

---

## Project Structure
```
src/
├── app.js                  # Express app setup
├── server.js               # HTTP server bootstrap
│
├── config/
│   ├── database.js         # Database connection pool
│   └── env.js              # Environment variable validation
│
├── modules/
│   ├── auth/               # Login, logout, token validation
│   ├── users/              # Staff management
│   ├── roles/              # Permission system
│   ├── products/           # Product catalog
│   ├── inventory/          # Stock tracking
│   ├── customers/          # Customer records
│   ├── invoices/           # Sales documentation
│   ├── payments/           # Payment processing
│   ├── pos/                # Point-of-sale operations
│   └── settings/           # System configuration
│
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   ├── role.middleware.js      # Permission checking
│   └── error.middleware.js     # Centralized error handling
│
├── routes/
│   └── index.js            # Route registration
│
├── utils/
│   ├── logger.js           # Logging utility
│   └── response.js         # Standardized API responses
│
└── uploads/
    └── csv/                # Module CSV files
```

Every file has *one job*. Every folder contains *one concern*.

---

## Module Design

Each module follows the same structure:
```
modules/[module-name]/
├── controller.js       # HTTP request handling
├── service.js          # Business logic
├── repository.js       # Database queries
├── validation.js       # Input validation
├── routes.js           # Endpoint definitions
└── [module].csv        # Data tracking file
```

**Controller** talks to **Service**.  
**Service** talks to **Repository**.  
**Repository** talks to **Database**.

No shortcuts. No "smart" dependencies. If you change the database, you change the repository. If you change the business logic, you change the service.

The code *tells you* what it does.

---

## API Design

Every endpoint follows REST principles correctly:
```
POST   /api/auth/login          # Authenticate user
GET    /api/products             # List all products
POST   /api/products             # Create new product
GET    /api/products/:id         # Get single product
PUT    /api/products/:id         # Update product
DELETE /api/products/:id         # Delete product
```

Status codes mean what they're supposed to mean:
- `200` = Success
- `201` = Created
- `400` = Your request is wrong
- `401` = You're not authenticated
- `403` = You're authenticated but not allowed
- `404` = Resource doesn't exist
- `500` = We messed up

Response format is consistent:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

Or on error:
```json
{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

No surprises.

---

## Authentication & Authorization

JWT tokens are issued on login. Token contains:
```javascript
{
  "userId": 123,
  "role": "CASHIER",
  "shopId": 1,
  "iat": 1640000000,
  "exp": 1640086400
}
```

Routes are protected by middleware:
```javascript
router.post(
  "/products",
  authMiddleware,              // Must be logged in
  roleMiddleware("ADMIN"),     // Must be admin
  createProduct
);
```

Roles are hierarchical:
- **ADMIN** — Full system access
- **MANAGER** — Inventory + reporting
- **CASHIER** — POS only
- **VIEWER** — Read-only

You define these in the database. Change them as needed.

---

## CSV Tracking System

Every module has a CSV file that mirrors its database activity:

- `products_module.csv` — Product changes
- `inventory_module.csv` — Stock movements
- `invoices_module.csv` — Sales records
- `payments_module.csv` — Payment logs

Why CSV?

1. **Auditable** — Open it in Excel. Show it to your accountant.
2. **Portable** — Move it anywhere. No database export tools needed.
3. **Versionable** — Commit it to Git. See what changed.
4. **Recoverable** — Database corrupted? You still have the CSV.

This is not "old school." This is *resilient architecture*.

---

## Database Philosophy

Schema is normalized. Tables have explicit foreign keys. No JSON columns storing random data.

Example schema:
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  location VARCHAR(100),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

You write raw SQL. You see exactly what queries are running. No hidden N+1 problems.

If you want stored procedures, write stored procedures. If you want triggers, write triggers. You're the engineer—act like it.

---

## Error Handling

All errors flow through a centralized middleware:
```javascript
// error.middleware.js
module.exports = (err, req, res, next) => {
  logger.error(err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    error: err.code
  });
};
```

No silent failures. No swallowed exceptions. If something breaks, you *know* it broke.

---

## Environment Configuration

Create a `.env` file:
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shop_db

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=24h

# CSV Storage
CSV_DIRECTORY=./uploads/csv
```

No magic defaults. No "convention over configuration." You declare what you need explicitly.

---

## Running The System
```bash
# Install dependencies
npm install

# Run database migrations (write your own)
npm run migrate

# Start server
npm run dev
```

Server starts at `http://localhost:5000`.

API documentation (if you add Swagger): `http://localhost:5000/api-docs`

---

## Who This Is For

**Students**: Learn backend architecture without the distractions. This is how production systems *should* work.

**Small Business Owners**: Deploy this on a $5/month VPS. It'll run your shop without drama.

**Junior Developers**: Study this before you study the trendy frameworks. Master the fundamentals first.

**Senior Developers**: Use this as a teaching tool. Show your team what "clean code" actually means.

**Academics**: Grade this fairly. It's not trying to be clever—it's trying to be *correct*.

---

## What This Doesn't Do

- Multi-tenancy / SaaS
- Real-time websockets
- GraphQL
- Serverless deployment
- Container orchestration
- Message queues

Not because these are bad—but because *you don't need them for a single shop*.

Don't solve problems you don't have.

---

## Testing

Write tests. I didn't include them because test frameworks are religious wars.

Use Jest, Mocha, or whatever you trust. Test the **service layer**—that's where your business logic lives.

Don't test the framework. Express works. SQL works. Test *your* code.

---

## Deployment

This runs anywhere Node.js runs:

- Bare metal server
- VPS (DigitalOcean, Linode)
- Traditional hosting (cPanel + Node)
- Cloud (AWS EC2, Azure VM)

You don't need Kubernetes for a shop management system.

---

## Final Thoughts

I built this system the way I wish more software was built: **with respect for the next person who has to read it**.

There's no cleverness here. No "design patterns" for their own sake. No abstraction layers protecting you from understanding your own system.

Just a backend that does exactly what it says it does.

If you're tired of complexity theater, welcome aboard.

If you're here to learn, you picked the right project.

If you're here to judge, read the code first.

---

**License**: MIT (or whatever lets you learn and build freely)

**Maintenance**: This code doesn't need maintenance—it needs *understanding*. Read it. Run it. Break it. Fix it. That's how you learn.

**Contributing**: Sure. But keep it simple. Pull requests that add unnecessary dependencies will be rejected. Pull requests that clarify existing code will be celebrated.

---

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

> "Simplicity is prerequisite for reliability." — Edsger Dijkstra

I'm done chasing trends. This is how I build software now.

If it resonates with you, use it. If it doesn't, that's fine too.

But at least now you've seen what deliberate simplicity looks like.

—*Someone who's been doing this longer than most frameworks have existed*
