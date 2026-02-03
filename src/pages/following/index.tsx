import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { Link } from 'react-router-dom'
import { Card, CardBody } from '@heroui/react'
import { User } from '../../components/user'
import { GoBack } from '../../components/go-back'

export const Following = () => {
  const currentUser = useSelector(selectCurrent)

  if (!currentUser) {
    return null
  }

  return <>
    <GoBack />
    {
      currentUser.following.length > 0 ? (
        <div className="gap-5 p-2 flex flex-col bg-gray-600/35 rounded-2xl">
          {
            currentUser.following.map(user => (
              <Link to={`/users/${user.following.id}`} key={user.following.id}>
                <Card>
                  <CardBody className='block avatarka'>
                    <User
                      name={user.following.name ?? ''}
                      avatarUrl={user.following.avatarUrl ?? ''}
                    />
                  </CardBody>
                </Card>
              </Link>
            ))
          }
        </div>
      ) : (<h1>Вы ни на кого не подписаны</h1>)
    }
  </>

}
