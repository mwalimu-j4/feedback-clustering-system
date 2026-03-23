# Convex + Better Auth + TanStack Router Template

A modern full-stack template featuring **Convex** for the backend, **Better Auth** for authentication, and **TanStack Router** for client-side routing. Built with React, TypeScript, Tailwind CSS, and Shadcn/ui components.

## 🚀 Features

- **Authentication**: Secure authentication with Better Auth supporting Google OAuth
- **Backend**: Convex for real-time database and serverless functions
- **Routing**: File-based routing with TanStack Router
- **UI**: Beautiful components with Tailwind CSS and Shadcn/ui
- **Type Safety**: Full TypeScript support with T3 Env for environment variables
- **Development**: Hot reload, ESLint, Prettier, and Vitest for testing

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, Tailwind CSS
- **Backend**: Convex (database + serverless functions)
- **Auth**: Better Auth with Google OAuth
- **UI**: Shadcn/ui components, Radix UI primitives
- **Build**: Vite, ESLint, Prettier
- **Testing**: Vitest

## 🛠️ Quick Start

### 1. Clone and Install

```bash
# Clone the template
git clone https://github.com/gerkim62/convex-better-auth-tstack-router-template
cd convex-better-auth-tstack-router-template

# Install dependencies
pnpm install
```

### 2. Set up Convex

```bash
# Initialize Convex (this will create your deployment)
npx convex init

# Start the Convex development server
npx convex dev
```

### 3. Configure Authentication

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - For production: Add your production URL

#### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Convex
VITE_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment_name

# Auth
VITE_SITE_URL=http://localhost:3000
VITE_CONVEX_SITE_URL=your_convex_site_url

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Set the environment variables in Convex:

```bash
# Set site URL
npx convex env set SITE_URL http://localhost:3000

# Set Google OAuth credentials
npx convex env set GOOGLE_CLIENT_ID "your_google_client_id"
npx convex env set GOOGLE_CLIENT_SECRET "your_google_client_secret"
```

### 4. Start Development

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

## 🔐 Authentication

This template includes a complete authentication system:

### Features
- Google OAuth sign-in
- Session management
- Protected routes
- User profile display
- Secure logout

### Usage

The authentication is already set up and ready to use. Visit `/demo/auth` to see the authentication flow in action.

Key files:
- `src/lib/auth-client.ts` - Client-side auth configuration
- `convex/auth.ts` - Server-side auth setup (using T3 Env)
- `convex/env.ts` - Server environment variables with validation
- `convex/auth.config.ts` - Auth configuration
- `src/features/auth/signin-modal.tsx` - Sign-in modal component
- `src/routes/demo/auth.tsx` - Demo authentication page

### Adding Authentication to New Routes

```tsx
import { authClient } from '@/lib/auth-client'

function ProtectedComponent() {
  const session = authClient.useSession()

  if (session.isPending) return <div>Loading...</div>
  if (!session.data) return <div>Please sign in</div>

  return <div>Welcome, {session.data.user.name}!</div>
}
```

## 📁 Project Structure

```
├── convex/                 # Backend functions and schema
│   ├── auth.config.ts     # Auth configuration
│   ├── auth.ts           # Auth setup with Better Auth
│   ├── env.ts            # Server environment variables (T3 Env)
│   ├── schema.ts         # Database schema
│   └── todos.ts          # Example functions
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/          # Shadcn/ui components
│   ├── features/         # Feature-specific components
│   │   └── auth/        # Authentication components
│   ├── integrations/     # Third-party integrations
│   │   └── convex/      # Convex client setup
│   ├── lib/             # Utilities and configurations
│   │   ├── auth-client.ts  # Better Auth client
│   │   └── utils.ts        # Helper functions
│   ├── routes/          # File-based routes
│   │   ├── __root.tsx   # Root layout
│   │   ├── index.tsx    # Home page
│   │   └── demo/        # Demo pages
│   └── env.ts           # Client environment variables (T3 Env)
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch
```

## 🎨 Styling

This template uses Tailwind CSS with Shadcn/ui components:

```bash
# Add new Shadcn components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add dialog
```

## 🚀 Deployment

### Deploy to Convex

```bash
# Deploy your Convex functions
npx convex deploy
```

### Build for Production

```bash
# Build the application
pnpm build

# Preview the production build
pnpm preview
```

## 📚 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm check        # Format and lint
```

## 🔧 Development

### Adding New Routes

Create files in the `src/routes/` directory. TanStack Router will automatically generate the route tree.

### Adding Convex Functions

Add new functions in the `convex/` directory with type-safe environment variables:

```typescript
// convex/myFunction.ts
import { query } from "./_generated/server";
import { env } from "./env"; // Import validated env vars

export const myQuery = query({
  args: {},
  handler: async (ctx) => {
    // Access environment variables with full type safety
    const siteUrl = env.SITE_URL;
    
    // Your function logic here
    return { message: "Hello World!", siteUrl };
  },
});
```

To add new environment variables to Convex:

1. Update `convex/env.ts`:
```typescript
export const env = createEnv({
  server: {
    SITE_URL: z.string().url(),
    MY_NEW_API_KEY: z.string().min(1), // Add here
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
```

2. Set the value:
```bash
npx convex env set MY_NEW_API_KEY "your-api-key"
```

3. Use it in your functions:
```typescript
import { env } from "./env";
const apiKey = env.MY_NEW_API_KEY; // ✅ Fully typed!
```

### Environment Variables

This template uses **T3 Env** for type-safe environment variables in both frontend and backend.

#### Frontend Environment Variables (src/env.ts)

Used in your React application:

```typescript
// src/env.ts
import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    CONVEX_DEPLOYMENT: z.string(),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_CONVEX_URL: z.url(),
    VITE_SITE_URL: z.url(),
    VITE_CONVEX_SITE_URL: z.url(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})

// Usage in React components
import { env } from "@/env";
console.log(env.VITE_CONVEX_URL);
```

#### Backend Environment Variables (convex/env.ts)

Used in your Convex functions with full type safety and validation:

```typescript
// convex/env.ts
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

// Usage in Convex functions
import { env } from "./env";

export const myQuery = query({
  handler: async (ctx) => {
    const apiKey = env.GOOGLE_CLIENT_ID; // ✅ Fully typed!
    // ...
  }
});
```

**Benefits:**
- ✅ Full TypeScript autocomplete
- ✅ Runtime validation with Zod
- ✅ Clear error messages if variables are missing
- ✅ No need for `!` or `as string` type assertions

**Setting Convex Environment Variables:**

```bash
# Set via CLI
npx convex env set SITE_URL "http://localhost:3000"
npx convex env set GOOGLE_CLIENT_ID "your_client_id"

# List all variables
npx convex env list

# Or set via Dashboard
# https://dashboard.convex.dev -> Your Project -> Settings -> Environment Variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
