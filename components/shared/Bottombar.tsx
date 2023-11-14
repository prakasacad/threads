'use client'
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import  {usePathname, useRouter } from 'next/navigation'
import React from 'react'

function Bottombar() {

    const router = useRouter()
    const pathname = usePathname()

    return (
        <section className='bottombar'>
            <div className='bottombar_container'>
            {sidebarLinks.map( link => {
                    const isActive = (pathname.includes(link.route) && link.route.length>1 || pathname === link.route)

                    return (
                    <Link className={`bottombar_link ${isActive && 'bg-primary-500'}`}href={link.route} key={link.label}>
                        <Image width={24} height={24} alt={link.label} src={link.imgURL}/>
                        <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(" ")[0]}</p>
                    </Link>
                    )
                }   
                )}

            </div>
        </section>
    )
}

export default Bottombar;