import React, { Suspense } from 'react'
import ThreadCard from '@/components/cards/ThreadCard'
import { currentUser } from '@clerk/nextjs'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import Comment from '@/components/forms/Comment'
const Page = async ({params}: {params: {id: string}})  => {
    const user = await currentUser()
    const userInfo = await fetchUser(user?.id)
    if(!userInfo?.onboarded) redirect('/')

    const post = await fetchThreadById(params.id)

    return (
    
        <section className="relative">
            <div>
            <ThreadCard key={post._id} id={post._id} currentUserId={user?.id || ''} parentId={post.parentId} content={post.text} author={post.author} community={post.communityId} createdAt={post.createdAt} comments={post.Children} />
            </div>
            <div className='mt-7'>
                <Comment postId={post._id} currentUserImg={userInfo?.image} currentUserId={userInfo._id} />
            </div>

            <div className='mt-10'>
            {post.Children.map((comment:any) => (
                <ThreadCard key={comment._id} id={comment._id} currentUserId={user?.id || ''} parentId={comment.parentId} content={comment.text} author={comment.author} community={comment.communityId} createdAt={comment.createdAt} comments={comment.Children} isComment/>
            ) )}

            </div>
            
        </section>
    )
}

export default Page;