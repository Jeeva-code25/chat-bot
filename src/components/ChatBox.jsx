import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import UserChat from './UserChat'
import { RiVoiceprintLine } from 'react-icons/ri'

const ChatBox = () => {

    const responses = {
        "hi": "Hello there! How can I help you?",
        "hello": "Hi, How can i assist you?",
        "how are you": "I'm just a bot, but I'm doing great! How about you?",
        "bye": "Goodbye! Have a great day!",
        "integer": "Please enter a list of integers(comma separated) e.g: 7,93,2 or 8",
        "default": "I'm not sure how to respond to that. Can you try something else?"
    }

    const [input, setInput] = useState("")
    const [isInteger, setIsInteger] = useState(false)
    const [loading, setLoading] = useState(false)
    const [chatList, setChatList] = useState([{ "who": "bot", "text": "Hi, How can i assist you?" }])
    const lastMessageRef = useRef(null);

    useEffect(() => {
        // Scroll to the last message when new messages are added
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight
        }
    }, [chatList]);

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const message = input.trim().toLowerCase()
        const regex = /^[0-9]+(,[0-9]+)*$/

        if (message) {
            setChatList(prevList => [...prevList, { "who": "user", "text": input }])
            setTimeout(() => {
                setLoading(false)
                if (message === "integer") setIsInteger(true);

                //check user input pattern and user gives integer as input
                if (isInteger && regex.test(message)) {
                    let strNumbers = message.split(',')
                    let numbers = strNumbers.map(Number)

                    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
                    const reverse = numbers.slice().reverse()
                    const max = numbers.reduce((acc, curr) => (curr > acc ? curr : acc), numbers[0]);

                    setIsInteger(false)
                    setChatList(prevList => [...prevList, {
                        "who": "bot", "text":
                            `sum: ${sum}\n 

                        max: ${max}\n 

                        reverse: ${reverse}`
                    }])
                    return
                }

                const reply = responses[message] || responses['default']
                setChatList(prevList => [...prevList, { "who": "bot", "text": reply }])

            }, 2000)
            setInput("")
        }
    }

    return (
        <section className="chat-container">
            <h2 className="title">Chat Bot</h2>
            <div ref={lastMessageRef} className="chats-box">
                {
                    chatList.map((chat, index) => {
                        return (
                            <UserChat key={index} chat={chat} />
                        )

                    })
                }
                { (loading) &&
                    <div className="dots-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                }

            </div>
            <form className="input-box" onSubmit={handleSubmit}>
                <input type="text" name="user-input" id="user-input" placeholder='Ask anything' className="user-input" value={input} onChange={e => setInput(e.target.value)} />
                <button type="submit" className="ask-btn" onClick={handleSubmit}><RiVoiceprintLine /></button>
            </form>
        </section>
    )
}

export default ChatBox