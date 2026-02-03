import React, { useContext } from 'react'
import { useCreateCommentMutation } from '../../app/services/commentsApi'
import { useCreatePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea } from '@heroui/react'
import { ErrorMessage } from '../error-message'
import { MdCreate } from 'react-icons/md'
import { ThemeContext } from '../theme-provider'
import { useParams } from 'react-router-dom'

export const CreateComment = () => {
    const {id} = useParams<{id: string}>()
    const [createComment] = useCreateCommentMutation()
    const [getPostById] = useLazyGetPostByIdQuery()

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue
    } = useForm()

    const error = errors?.post?.message as string

    const onSubmit = handleSubmit(async (data) => {
        try {
            if(id){
                await createComment({ content: data.comment, postId: id }).unwrap()
                setValue('comment', '')
                await getPostById(id).unwrap()
            }
        } catch (error) {
        }
    })
    const { theme, toggleTheme } = useContext(ThemeContext)

    return (
        <form className='grow flex-col' onSubmit={onSubmit}>
            <Controller
                name='comment'
                control={control}
                defaultValue=''
                rules={{
                    required: 'Обязательное поле'
                }}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        labelPlacement='outside'
                        placeholder='Напиши свой комментарий'
                        className={`mb-5 h-20 bg-primary-400/50 rounded-xl border-2 border-primary-400`}
                    />
                )}
            />

            {errors && <ErrorMessage error={error} />}

            <Button
                color='primary'
                className={`flex-end flex bg-emerald-500  w-l h-9 rounded-2xl text-${theme === 'light' ? 'white' : 'black'}`}
                endContent={<MdCreate />}
                type='submit'

            >
                Добавить комментарий
            </Button>

        </form>
    )
}
