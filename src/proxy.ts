import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect non-public routes
  if (!userId) {
    await auth.protect();
  }

  // Allow org selection route if user is authenticated but has not selected an org
  if (isOrgSelectionRoute(req)) {
    return NextResponse.next();
  }

  // For all protected routes, ensure the user has selected an organization
  if (userId && !orgId) {
    const orgSelectionUrl = new URL("/org-selection", req.url);
    return NextResponse.redirect(orgSelectionUrl);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
