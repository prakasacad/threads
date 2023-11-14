'use client'
import React, { ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import {ThreadValidation} from '@/lib/validations/thread'
import {addComment} from '@/lib/actions/thread.actions'

interface Props {
    postId: string,
    currentUserImg: string,
    currentUserId: string
}


export  default function Comment({postId, currentUserImg, currentUserId}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: currentUserId,
        }
    })

    const onSubmit = async(values: z.infer<typeof ThreadValidation>) => {
        console.log(currentUserId)
        await addComment(postId, values.thread, currentUserId, pathname)

        form.reset()

    }

    return (
        <div> 
            <h1 className="text-white">Comment Form</h1> 
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                    <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex w-full justify-start items-center gap-5">
                            <FormLabel>
                                <Image src={currentUserImg} alt="Profile Image" width={48} height={48} className="rounded-full object-cover" />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input type='text' placeholder="Write Your Comment" className="no-focus text-light-1 outline-none" {...field}/>
                            </FormControl>
                         
                        </FormItem>
                        )}
                        />
                    <Button type="submit" className="comment-form_btn" >Reply</Button>
                </form>
            </Form>
        </div>
    )
}