
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import React from 'react'
import { currentUser } from "@clerk/nextjs";
import ThreadCard from '@/components/cards/ThreadCard'
 
export default async function Home() {

  const user = await currentUser()

  const result = await fetchPosts({pageNumber: 1, pageSize: 20})
  return (
    <> 
      <h1 className="head-text text-left">Homepage</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : 
        <>
          {result.posts.map(post => (
            <ThreadCard key={post._id} id={post._id} currentUserId={user?.id || ''} parentId={post.parentId} content={post.text} author={post.author} community={post.communityId} createdAt={post.createdAt} comments={post.Children} />
       
          ))}
        </>

        }

      </section>
      

      {result.isNext && (<Button>Next</Button>)}
    </>
  )
}