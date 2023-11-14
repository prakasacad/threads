'use server'
import { connectToDB } from "../mongoose"
import Thread from '../models/thread.model'
import User from '../models/user.model'
import { revalidatePath } from "next/cache"
import { skip } from "node:test"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({text, author, communityId, path}: Params) {
    connectToDB()

    const createdThread = await Thread.create({
        text,
        author,
        community: null,

    })

    await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
    })

    revalidatePath(path)



}


export async function fetchPosts({pageNumber = 1, pageSize=20}) {
    connectToDB()

    const skipAmount = (pageNumber-1) * pageSize
    const postQuery = Thread.find({parentId: {$in: [null, undefined]}})
    .sort({createdAt: 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path: 'author', model: User})
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