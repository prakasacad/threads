import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"

interface props {
    currentUserId: string,
    accountId: string,
    accountType: string
}

export default async function ThreadsTab({currentUserId, accountId, accountType}: props) {
    
    let result = await fetchUserPosts(accountId)
    if(!result) redirect('/')
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread:any) => {
                return (
                <ThreadCard key={thread._id} id={thread._id} currentUserId={currentUserId} parentId={thread.parentId} content={thread.text} author={accountType ==='User' ? {name: result.name, image: result.image, id: result._id} : {name: thread.author.name, image: thread.author.image, id: thread.author._id}} community={thread.communityId} createdAt={thread.createdAt} comments={thread.Children} likedBy={JSON.parse(JSON.stringify(thread.likedBy))} />
                )
                
            })}
        </section>
        
    )
}