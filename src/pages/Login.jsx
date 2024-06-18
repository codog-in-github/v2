import { request } from "@/apis/requestBuilder";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    request("/api/login")
  }, [])
  return (
    <div>
      <h1>Login</h1>
    </div>
  );
}