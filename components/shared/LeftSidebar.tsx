'use client'
import React from 'react'
import {sidebarLinks} from '@/constants/index'
import Link from 'next/link';
import Image from 'next/image';
import  {usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from '@clerk/clerk-react';


function LeftSidebar() {

    const router = useRouter()
    const pathname = usePathname()
    const {userId} = useAuth()

    return (

        <section className='custom-scrollbar leftsidebar'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {sidebarLinks.map( link => {
                    const isActive = (pathname.includes(link.route) && link.route.length>1 || pathname === link.route)
                    if (link.route === '/profile') link.route = `${link.route}/${userId}`
                    return (
                    <Link className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}href={link.route} key={link.label}>
                        <Image width={24} height={24} alt={link.label} src={link.imgURL}/>
                        <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                    </Link>
                    )
                }   
                )}
            </div>
            <div className='mt-10 px-6'>
                
                <SignedIn>
                        <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                            <div className='flex cursor-pointer gap-4 p-4'>
                                <Image alt='logout' src='/assets/logout.svg' width={24} height={24}/>
                                <p className='text-light-2 max-lg:hidden'>Logout</p>
                            </div>
                        </SignOutButton>
                </SignedIn>

            </div>

        </section>
    )
}

export default LeftSidebar;