import React from 'react'
import { NavButton } from '../nav-button'
import { BsPostcard } from 'react-icons/bs'
import { FiUsers } from 'react-icons/fi'
import { FaUser } from 'react-icons/fa'

export const NavBar = () => {
    return (
        <nav>
            <ul className="flex flex-col">
                <li className='gap-y-5'>
                    <NavButton href='/' icon={<BsPostcard />}>
                        Посты
                    </NavButton>
                </li>
                <li className='gap-y-5'>
                    <NavButton href='following' icon={<FiUsers />}>
                        Подписки
                    </NavButton>
                </li>
                <li className='gap-y-5'>
                    <NavButton href='followers' icon={<FaUser />}>
                        Подписчики
                    </NavButton>
                </li>
            </ul>
        </nav>
    )
}
