'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { getOpenAI } from '@/lib/openai'

interface NewPostParams {
  authorId: number
  title: string
  content?: string | undefined
}

export const generateDraft = async (keywords: string) => {
  console.log('Starting draft generation with keywords:', keywords);
  try {
    console.log('Creating OpenAI client');
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates blog post drafts based on keywords.'
        },
        {
          role: 'user',
          content: `Generate a blog post draft about: ${keywords}`
        }
      ],
      model: 'gpt-3.5-turbo',
    });
    console.log('Successfully generated draft');
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating draft:', error);
    throw new Error('Failed to generate draft: ' + error.message);
  }
};

export const newPost = async ({ title, content, authorId }: NewPostParams) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id: Number(authorId),
        },
      },
    },
  })

  revalidatePath('/', 'page')

  return post
}
