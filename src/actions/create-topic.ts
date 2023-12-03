"use server";
import { auth } from "@/auth";
import { z } from "zod";
import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { db } from "@/db";
import paths from "@/paths";
import { revalidatePath } from "next/cache";

const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, { message: "Must be lowercase letters or dashes without spaces" }),
  description: z.string().min(10),
});

interface ICreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: ICreateTopicFormState,
  formData: FormData
): Promise<ICreateTopicFormState> {
  const session = await auth();

  if (!session?.user) return { errors: { _form: ["Not Authorized"] } };

  const validation = await createTopicSchema.safeParseAsync({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  let topic: Topic;

  try {
    topic = await db.topic.create({
      data: {
        description: validation.data.description,
        slug: validation.data.name,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { errors: { _form: [error.message] } };
    } else {
      return { errors: { _form: ["Something went wrong"] } };
    }
  }
  revalidatePath(paths.home());

  redirect(paths.topicShow(topic.slug));
}
