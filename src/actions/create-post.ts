"use server";
import { auth } from "@/auth";
import { z } from "zod";
import type { Post, Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

interface ICreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: ICreatePostFormState,
  formData: FormData
): Promise<ICreatePostFormState> {
  const session = await auth();

  if (!session?.user) return { errors: { _form: ["Not Authorized"] } };

  const validation = await createPostSchema.safeParseAsync({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const topic = await db.topic.findFirst({
    where: { slug },
  });

  if (!topic) {
    return { errors: { _form: ["Cannot find topic"] } };
  }

  let post: Post;

  try {
    post = await db.post.create({
      data: {
        title: validation.data.title,
        content: validation.data.content,
        topicId: topic.id,
        userId: session.user.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    } else {
      return { errors: { _form: ["Something went wrong"] } };
    }
  }

  revalidatePath(paths.topicShow(slug));

  redirect(paths.postShow(slug, post.id));
}
