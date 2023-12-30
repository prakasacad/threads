
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from '@/components/cards/ThreadCard'
 
export default async function Home() {

  const user = await currentUser()

  const result = await fetchPosts({pageNumber: 1, pageSize: 20})
  
  return (
    <section> 
      <h1 className="head-text text-left">Homepage</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : 
        <>
          {result.posts.map(post => (
            <ThreadCard key={post.id} id={post._id} currentUserId={user?.id || ''} parentId={post.parentId} content={post.text} author={post.author} community={post.community} createdAt={post.createdAt} comments={post.Children} likedBy={JSON.parse(JSON.stringify(post.likedBy))} />
       
          ))}
        </>

        }

      </section>
      

      {result.isNext && (<Button>Next</Button>)}
    </section>
  )
}