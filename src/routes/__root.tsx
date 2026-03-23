import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import ConvexProvider from '../integrations/convex/provider'
import { Toaster } from '@/components/ui/sonner'
import z from 'zod'

export const Route = createRootRoute({
  validateSearch:z.object({
    "sign-in-modal":z.literal('open').optional(),
    "redirect-url":z.string().optional(),
  }),
  component: () => (
    <>
      <ConvexProvider>
        <Header />
        <Outlet />
        <Toaster/>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </ConvexProvider>
    </>
  ),
})
