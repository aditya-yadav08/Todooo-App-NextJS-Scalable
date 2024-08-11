"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOutAction } from "@/actions/auth-action";

export default function UserProfile() {
  const session = useSession();
  const imageURL = session?.data?.user?.image;
  const name = session?.data?.user?.name;
  const email = session?.data?.user?.email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <Button
          variant={"secondary"}
          className="flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white"
        >
          {imageURL && (
            <Image
              src={imageURL}
              width={24}
              height={24}
              alt={`${name} profile picture`}
              className="rounded-full"
            />
          )}
          <p className="truncate">{email}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="lg:w-full px-28 flex items-center justify-center">
          <form action={signOutAction}>
            <Button
              variant={"ghost"}
              type="submit"
              className="hover:text-primary text-center"
            >
              Sign out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
