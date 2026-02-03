
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { App } from "./App"
import { store } from "./app/store"
import { HeroUIProvider } from '@heroui/react'
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { Auth } from "./pages/auth"
import { Layout } from "./components/layout"
import { UserProfile } from "./pages/user-profile"
import { CurrentPost } from "./pages/current-post"
import { Posts } from "./pages/posts"
import { Followers } from "./pages/followers"
import { Following } from "./pages/following"
import { AuthGuard } from "./features/user/authGuard"

const container = document.getElementById("root")

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Posts />
      },
      {
        path: 'posts/:id',
        element: <CurrentPost />
      },
      {
        path: 'users/:id',
        element: <UserProfile />
      },
      {
        path: 'followers',
        element: <Followers />
      },
      {
        path: 'following',
        element: <Following />
      },
    ]
  }
])

if (container) {
  const root = createRoot(container)

  root.render(
    <HeroUIProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AuthGuard>
            <RouterProvider router={router} />
          </AuthGuard>
        </ThemeProvider>
      </Provider>
    </HeroUIProvider>

  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
