import { Nav } from "@sat/components/nav/Nav"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function map() {
  const session = useSession();
  const router = useRouter();
  const { data: sessionData } = useSession();
  // Navigating to Home is not authenticated 
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/");
    }
  }, [session, router]);

  return (
    session.status === "authenticated" && (
    <>
    <Nav position="relative" />
    <div className="text-2xl pt-5 text-center">This is where the map page will go!</div>
    </>
  ))
}
export default map