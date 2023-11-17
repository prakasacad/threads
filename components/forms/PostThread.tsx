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
import { Textarea } from "@/components/ui/textarea"
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import * as z from 'zod'
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.actions";
import {ThreadValidation} from '@/lib/validations/thread'
import {createThread} from '@/lib/actions/thread.actions'
import {useOrganization} from '@clerk/nextjs'

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    }; 
    btnTitle: string;
}


export default function PostThread({userId}: {userId: string}) {
    const {organization} = useOrganization()
    const router = useRouter();
    const pathname = usePathname();
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId,
        }
    })

    const onSubmit = async(values: z.infer<typeof ThreadValidation>) => {
        {console.log(organization)}
        await createThread({
            text: values.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname})

        router.push("/")

    }
    
    return (
        <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 flex flex-col justify-start gap-10">
            <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
                <FormItem className="flex flex-col justify-start gap-5">
                    
                    <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                        <Textarea className="account-form_input no-focus" {...field} rows={15}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                )}
                />
            
            <Button type="submit" className="bg-primary-500" >Post Thread</Button>
            </form>
            </Form>
        </>


        
    )
}