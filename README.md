git clone https://github.com/ogbeniore/theaolovestory-ai.git
cd theaolovestory-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/wedding_db
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## First-Time Setup

1. Create an admin user:
   - Visit `http://localhost:5000/auth`
   - Click "Register" and create your admin account
   - The first user created will automatically have admin access

2. Access the admin dashboard:
   - Log in with your credentials
   - Click the "Admin" link in the top navigation
   - You can now manage guests, track RSVPs, and handle seating arrangements

## Deployment

### Deploying on Replit

1. Create a new Repl and import the GitHub repository
2. In the Repl's Secrets tab, add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL
3. Install Node.js packages:
   ```bash
   npm install
   ```
4. Initialize the database:
   ```bash
   npm run db:push
   ```
5. Start the application:
   ```bash
   npm run dev
   ```

### Other Deployment Options

You can also deploy this application on platforms like:
- Vercel
- Railway
- Render
- Heroku

For these platforms, make sure to:
1. Connect your GitHub repository
2. Set up the environment variables
3. Configure the build command: `npm run build`
4. Configure the start command: `npm start`

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Backend Express application
│   ├── routes.ts        # API routes
│   └── storage.ts       # Database operations
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema and types