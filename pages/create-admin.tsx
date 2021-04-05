import Head from 'next/head'
import { FormState, useForm } from 'react-hook-form';
import Button from '../components/Button';
import Input from '../components/Input';
import { prisma } from '../prisma/client'
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import FormErrorText from '../components/FormErrorText'

export async function getServerSideProps() {
    const users = await prisma.user.findMany({ take: 1 })
    let hasUsers = false
    if (users.length !== 0) {
        hasUsers = true;
    }

    return {
        props: { hasUsers }
    };
}

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

type FormType = z.infer<typeof formSchema>

interface Props {
    hasUsers: boolean
}

export default function CreateAdmin(props: Props) {
    const { register, handleSubmit, formState } = useForm<FormType>({
        resolver: zodResolver(formSchema)
    })
    const { hasUsers } = props;
    const documentTitle = "Create Admin | JustCommerce!"

    async function submitHandler(data: FormType) {
        console.log(data)
    }

    if (hasUsers) {
        return <>
            <Head>
                <title>{documentTitle}</title>
            </Head>
            <div>Cannot create admin</div></>
    }

    return <div>
        <Head>
            <title>{documentTitle}</title>
        </Head>
        <h1>Create an admin User</h1>
        <form id="form-create-admin-user" onSubmit={handleSubmit(submitHandler)}>
            <label htmlFor="email">Email</label>
            <Input {...register("email", { required: true })} type="email" placeholder="user@example.com" />
            <FormErrorText formState={formState} field="email" />
            <label htmlFor="password">Password</label>
            <Input {...register("password", { required: true })} type="password" placeholder="password" />
            <FormErrorText formState={formState} field="password" />
            <Button>Create...</Button>
        </form>
    </div>

}