import React from 'react'
import './UserChat.css'
import { LuBotMessageSquare } from 'react-icons/lu'
import { FaUserEdit } from 'react-icons/fa'
const UserChat = ({ chat }) => {
  return (
    <section className='chat-sec'>
      <article className={(chat.who === "user") ? "chat user-chat" : "chat bot-chat"}>
        <span className='icon'>{(chat.who === "bot") ? <LuBotMessageSquare /> : <FaUserEdit />} :</span>
        <div>
        {
          chat.text.split("\n").map((txt, index) => (
            <p className="text" key={index}>{`${txt}`}</p>
          ))
        }
        </div>
        
      </article>

    </section>
  )
}

export default UserChat