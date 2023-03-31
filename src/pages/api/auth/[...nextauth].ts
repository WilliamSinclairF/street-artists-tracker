import NextAuth from "next-auth";
import { authOptions } from "@sat/server/auth";

export default NextAuth(authOptions);
