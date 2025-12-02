# MM Server

A Node.js Express API built with TypeScript, Prisma, and PostgreSQL.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:

   ```env
   NODE_ENV=development
   PORT=5001
   DATABASE_URL=postgresql://username:password@localhost:5432/fibre52
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

3. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Seed the database:**

   ```bash
   npx prisma db seed
   ```

5. **Start development server:**

   ```bash
   npm run dev

   or

   yarn dev
   ```

The server will start at `http://localhost:5000`

## API Endpoints

### Products

- `GET /api/products?limit=10` - Get all products (optional limit)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/category/:category?limit=10` - Get products by category
- `GET /api/products/:id` - Get single product

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npx prisma studio    # Open Prisma Studio (database GUI)
```

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT
- **Validation:** Zod

## Project Structure

```
src/
├── app/
│   ├── Modules/
│   │
│   │   ├── products/       # Products module
│   │
│   └── middleware/         # Express middlewares
├── config/                 # Configuration files
├── shared/                 # Shared utilities
└── server.ts              # Entry point

prisma/
├── schema.prisma          # Database schema
├── seed.ts               # Database seeding
└── config.ts             # Seed data
```

## License

MIT
