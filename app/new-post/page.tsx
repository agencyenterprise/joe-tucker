'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { newPost, generateDraft } from './actions'
import { useEffect, useState } from 'react'
import prisma from '@/prisma/client'

export default function NewPost() {
  const [authors, setAuthors] = useState<{id: number, name: string}[]>([])
  const [keywords, setKeywords] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<{
    authorId: number
    title: string
    content?: string
  }>()

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await fetch('/api/authors')
      const data = await response.json()
      setAuthors(data)
    }
    fetchAuthors()
  }, [])

  const router = useRouter()

  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">New Post</h1>
      <form
        className="flex flex-col gap-4 max-w-lg mx-auto"
        onSubmit={handleSubmit(async data => {
          await newPost(data)
          router.push('/')
        })}
      >
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="author">
            Author
          </label>
          <select className="p-2 border border-gray-400 rounded-sm" id="author" {...register('authorId')}>
            {authors.map(author => (
              <option key={author.id} value={author.id}>{author.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="p-2 border border-gray-400 rounded-sm"
            placeholder="An eye-catching blog post"
            {...register('title', { required: true })}
          />
          {errors.title && <p className="text-red-500 font-bold">Title is required.</p>}
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="keywords">
            Content draft keywords
          </label>
          <div className="flex items-center gap-2">
            <input
              name="keywords"
              id="keywords"
              className="p-2 border border-gray-400 rounded-sm flex-1"
              placeholder="software development, AI, ChatGPT"
              onChange={(e) => setKeywords(e.target.value)}
            />
            <button 
              type="button" 
              className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold"
              onClick={async () => {
                if (!keywords) return;
                const draft = await generateDraft(keywords);
                setValue('content', draft);
              }}
            >
              Generate
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="content">
            Content
          </label>
          <textarea id="content" className="p-2 border border-gray-400 rounded-sm" rows={3} {...register('content')} />
        </div>
        <button type="submit" className="border border-orange-600 rounded-sm p-2 bg-orange-400 text-white font-bold">
          Submit
        </button>
      </form>
    </>
  )
}
