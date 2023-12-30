'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { fetchLike, likeThisThread } from '@/lib/actions/thread.actions'

const ThreadStat = ({ id, currentUserId, likedBy }: { id: string, currentUserId: string, likedBy: any }) => {

    const [likeData, setLikeData] = useState({ isLiked: likedBy.find((item: any) => item.id === currentUserId) ? true : false, numberOfLikes: likedBy.length });


    

 

    const interactLike = () => {
        likeThisThread(id, currentUserId)
        if(likeData.isLiked) {
            setLikeData({isLiked: false,  numberOfLikes: likeData.numberOfLikes-1})
        } else {
            setLikeData({isLiked: true,  numberOfLikes: likeData.numberOfLikes+1})
        }
        
    }


    




    return (
        <div className="flex gap-3.5">
            <div className='text-light-2' onClick={() => console.log('haha')}>{likeData.numberOfLikes}</div>

            <div onClick={interactLike}>
                {likeData.isLiked ? (
                    <Image src='/assets/heart-filled.svg' alt="heart-filled" width={24} height={24} className="cursor-pointer object-contain" />
                ) : (
                    <Image src='/assets/heart-gray.svg' id='heart' alt="heart" width={24} height={24} className="cursor-pointer object-contain"/>
                )}
                
                
            </div>
            

            <Link href={`/thread/${id}`}>
                <Image src='/assets/reply.svg' alt="reply" width={24} height={24} className="cursor-pointer object-contain" />
            </Link>
            
            <Image src='/assets/repost.svg' alt="repost" width={24} height={24} className="cursor-pointer object-contain" />
            <Image src='/assets/share.svg' alt="share" width={24} height={24} className="cursor-pointer object-contain" />
        </div>
    )
}

export default ThreadStat