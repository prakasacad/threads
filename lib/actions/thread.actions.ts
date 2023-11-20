'use server'
import { connectToDB } from "../mongoose"
import Thread from '../models/thread.model'
import User from '../models/user.model'
import { revalidatePath } from "next/cache"
import { skip } from "node:test"
import Community from "../models/community.model"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

// export async function createThread({text, author, communityId, path}: Params) {
//     console.log("hmm", communityId)
//     connectToDB()

//     const communityIdObject = await Community.findOne(
//         {id: communityId},
//     )
    
//     const createdThread = await Thread.create({
//         text,
//         author,
//         community: communityId,

//     })
//     console.log("checked")
//     await User.findByIdAndUpdate(author, {
//         $push: {threads: createdThread._id}
//     })

//     if (communityIdObject) {
//         await Community.findByIdAndUpdate(communityIdObject, {
//             $push: {threads: createdThread._id}
//         })
       
//     }

//     revalidatePath(path)



// }


export async function createThread({ text, author, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdThread = await Thread.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
      likedBy: null
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

export async function fetchPosts({pageNumber = 1, pageSize=20}) {
    connectToDB()

    const skipAmount = (pageNumber-1) * pageSize
    const postQuery = Thread.find({parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate([
      {path: 'author', model: User},
      {path: 'community', model: Community}])
    .populate({
        path: 'Children', 
        populate:  {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
        })

    const totalPosts = await Thread.countDocuments({parentId: {$in: [null, undefined]}})

    const posts = await postQuery.exec()
    const isNext = (totalPosts > skipAmount + posts.length)

    return {posts, isNext}
    

}


export async function fetchThreadById(postId: string) {
    connectToDB()
    try {
        const post = await Thread.findOne({_id: postId})
        .populate({
            path: 'author',
            model: User,
            select: '_id id name image'
        })
        .populate({
            path: 'Children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name parentId image'
                },
                {
                    path: 'Children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    }
                }
            ]
        }).exec()
        return post
    } 
    catch (error: any) {
        throw new Error(`Failed to Fetch Post: ${error.message}`) 
    }

    
}


export async function addComment(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB()
    try {
        const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.Children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);


    } catch(error: any) {
        throw new Error('Error adding comment')
    }
}


export async function fetchLike(id:string, currentUserId:string) {
    connectToDB()
    try {
        const thread = await Thread.findById(id)
        const a = thread.likedBy?.find((e:string) => e === currentUserId) 

        return a ? true : false

        

    } catch (error:any) {
        throw new Error('hmm error', error.message)

    }
}