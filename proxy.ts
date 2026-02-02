import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  // Define which routes to protect
  // This regex protects everything EXCEPT:
  // - api/auth routes
  // - login page
  // - static files (images, icons)
  matcher: [
    "/((?!api/auth|login|register|_next/static|_next/image|favicon.ico|images).*)",
  ],
}