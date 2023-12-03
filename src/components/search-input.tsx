"use client";
import { Input } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { FC } from "react";
import * as actions from "@/actions";

interface ISearchInput {}

const SearchInput: FC<ISearchInput> = ({}) => {
  const params = useSearchParams();

  return (
    <form action={actions.search}>
      <Input placeholder="search" size="sm" height="1.5rem" name="term" defaultValue={params.get("term") || ""} />
    </form>
  );
};

export default SearchInput;
