import React from 'react'
import './UserChat.css'
import { LuBotMessageSquare } from 'react-icons/lu'
import { FaUserEdit } from 'react-icons/fa'
const UserChat = ({chat}) => {
  return (
    <section className='chat-sec'>
    <article className={(chat.who === "user") ? "chat user-chat" : "chat bot-chat"}>
      <span className='icon'>{(chat.who === "bot") ? <LuBotMessageSquare /> : <FaUserEdit />} :</span>
      <p className="text">{`${chat.text}`}</p>
      
      </article>

    </section>
  )
}

export default UserChat