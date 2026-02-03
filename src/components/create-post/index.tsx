import React, { useContext } from 'react'
import { useCreateCommentMutation } from '../../app/services/commentsApi'
import { useCreatePostMutation, useLazyGetAllPostsQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea } from '@heroui/react'
import { ErrorMessage } from '../error-message'
import { MdCreate } from 'react-icons/md'
import { ThemeContext } from '../theme-provider'

export const CreatePost = () => {
    const [createPost] = useCreatePostMutation()
    const [triggerAllPosts] = useLazyGetAllPostsQuery()

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm()

    const error = errors?.post?.message as string

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createPost({ content: data.post }).unwrap()
            setValue('post', '')
            await triggerAllPosts().unwrap()
        } catch (error) {
        }
    })
    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <form className='grow flex-col' onSubmit={onSubmit}>
            <Controller
                name='post'
                control={control}
                defaultValue=''
                rules={{
                    required: 'Обязательное поле'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='О чем думаете?'
                        className={`mb-5 h-20 bg-primary-400/50 rounded-xl border-2 border-primary-400`}
                    />
                )}
            />

            {errors && <ErrorMessage error={error} />}

            <Button
                color='success'
                className={`flex-end flex bg-emerald-500  w-l h-9 rounded-2xl text-${theme === 'light' ? 'white' : 'black'}`}
                endContent={<MdCreate />}
                type='submit'

            >
                Добавить пост
            </Button>

        </form>
    )
}
