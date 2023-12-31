import {currentUser} from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import {fetchUser, searchUsers } from '@/lib/actions/user.actions'
import { Tabs,  TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image';
import UserCard from '@/components/cards/UserCard'


export default async function Page() {
    const user = await currentUser()

    if(!user) return null
    const userInfo = await fetchUser(user.id)

    if(!userInfo?.onboarded) redirect('/onboarding')

    const result = await searchUsers({userId: user.id, searchString: '', pageNumber: 1, pageSize: 25})

    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>

            <div className='mt-14 flex flex-col gap-9'>
                {result.users.length === 0  ? <p className='no-result'>No Users</p> : (
                    <>
                    {result.users.map( (user:any) => (
                       <UserCard key={user.id} id={user.id} name={user.name} username={user.username} imgUrl={user.image} personType='User' /> 
                    ))}

                    </>
                )}

            </div>
        </section>
    )
}