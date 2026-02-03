import { Button, Card, Image, useDisclosure } from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { selectCurrent } from '../../features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserByIdQuery, useLazyCurrentQuery, useLazyGetUserByIdQuery } from '../../app/services/userApi'
import { useFollowUserMutation, useUnfollowUserMutation } from '../../app/services/followApi'
import { GoBack } from '../../components/go-back'
import { BASE_URL } from '../../constants'
import { MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled } from 'react-icons/md'
import { CiEdit } from 'react-icons/ci'
import { ProfileInfo } from '../../components/profile-info'
import { formatToClientDate } from '../../utils/format-to-client-date'
import { CountInfo } from '../../components/count-info'
import { EditProfile } from '../../components/edit-profile'
import { hasErrorField } from '../../utils/has-error-field'

export const UserProfile = () => {
  const { id } = useParams<{ id: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = useSelector(selectCurrent)
  const { data } = useGetUserByIdQuery(id ?? '')
  const [followUser] = useFollowUserMutation()
  const [unfollowUser] = useUnfollowUserMutation()
  const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
  const [triggerCurrentQuery] = useLazyCurrentQuery()
  const [error, setError] = useState("")


  const dispatch = useDispatch()

  useEffect(() => () => {
    dispatch
  }, [])

  if (!data) {
    return null
  }

  const handleFollow = async () => {
    try {
      if (id) {
        data?.isFollowing ?
          await unfollowUser(id).unwrap()
          : await followUser({ followingId: id }).unwrap()
        await triggerGetUserByIdQuery(id)

        await triggerCurrentQuery()
      }
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else {
        setError(err as string)
      }
    }
  }

  const handleEdit = async () => {
    try {
      if (id) {
        await triggerGetUserByIdQuery(id)
        await triggerCurrentQuery()
        setIsOpen(!isOpen)
      }

    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      } else {
        setError(err as string)
      }
    }
  }

  return (
    <>
      <GoBack />
      <div className="flex items-center gap-4">
        <Card className='flex flex-col items-center text-center space-y-4 p-5 flex-1 bg-gray-600/35 rounded-4xl'>
          <Image
            src={`${BASE_URL}${data.avatarUrl}`}
            alt={data.name}
            width={200}
            height={200}
            className='border-4 border-white rounded-2xl'
          />
          <div className="flex flex-col text-2xl font-bold gap-4 items-center">
            {data.name}
            {
              currentUser?.id !== id ? (
                <Button
                  color={data.isFollowing ? 'default' : 'primary'}
                  variant='flat'
                  className={'gap-2 flex rounded-xl p-2 ' + (!data.isFollowing ? 'text-primary bg-primary-500/35' : 'bg-gray-500/35')}
                  onClick={handleFollow}
                >
                  {data.isFollowing ? 'Отписаться' : 'Подписаться'}
                  {
                    data.isFollowing ? (
                      <MdOutlinePersonAddDisabled />
                    ) : (
                      <MdOutlinePersonAddAlt1 />
                    )
                  }
                </Button>
              ) : (
                <Button onClick={handleEdit} className='flex bg-gray-400 rounded-xl p-2'>
                  Редактировать {<CiEdit />}
                </Button>
              )
            }
          </div>
        </Card>
        <Card className='flex flex-col space-y-4 p-5 flex-1 bg-gray-600/35 rounded-4xl'>
          <ProfileInfo title='Почта' info={data.email} />
          <ProfileInfo title='Местоположение' info={data.location} />
          <ProfileInfo title='Дата рождения' info={formatToClientDate(data.dateOfBirth)} />
          <ProfileInfo title='Обо мне' info={data.bio} />

          <div className="flex gap-2">
            <CountInfo count={data.followers.length} title='Подписчики' />
            <CountInfo count={data.following.length} title='Подписки' />
          </div>
        </Card>
      </div>
      <EditProfile isOpen={isOpen} handleOpen={handleEdit} user={data} />
    </>
  )
}
