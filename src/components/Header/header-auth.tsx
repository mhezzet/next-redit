"use client";

import { FC } from "react";
import { Avatar, Button, NavbarItem, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import * as actions from "@/actions";
import { useSession } from "next-auth/react";

interface IHeaderAuth {}

const HeaderAuth: FC<IHeaderAuth> = ({}) => {
  const { data, status } = useSession();
  const user = data?.user;

  if (status === "loading") return null;

  if (status === "authenticated") {
    return (
      <Popover placeholder="left">
        <PopoverTrigger>
          <Avatar className="cursor-pointer" src={user?.image || ""} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <form action={actions.signOut}>
              <Button type="submit">Sign Out</Button>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    );
  } else {
    return (
      <>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="secondary" variant="bordered">
              Sign In
            </Button>
          </form>
        </NavbarItem>
        <NavbarItem>
          <form action={actions.signIn}>
            <Button type="submit" color="primary" variant="flat">
              Sign Up
            </Button>
          </form>
        </NavbarItem>
      </>
    );
  }
};

export default HeaderAuth;
