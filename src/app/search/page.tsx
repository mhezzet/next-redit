import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/posts";
import { redirect } from "next/navigation";
import { FC } from "react";

interface ISearch {
  searchParams: {
    term: string;
  };
}

const Search: FC<ISearch> = async ({ searchParams }) => {
  const { term } = searchParams;

  if (!term) redirect("/");

  return (
    <div>
      <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
  );
};

export default Search;
