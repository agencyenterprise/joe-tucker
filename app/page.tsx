'use server'
import prisma from '@/prisma/client'
import { cache } from 'react'
import HomePage from './home-page'

const getPosts = cache(async () => {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true
        }
      }
    }
  })
})

export default async function Page() {
  const posts = await getPosts()
  return <HomePage posts={posts} />
}
