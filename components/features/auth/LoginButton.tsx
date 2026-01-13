"use client";
import { Button } from "@/components/ui";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn()}
      text={"Iniciar sesión"}
      className="font-clash-display ml-4 py-1!"
    />
  );
}
