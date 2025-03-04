import React, { useEffect, useRef, useState } from 'react'
import './ChatBox.css'
import UserChat from './UserChat'
import { RiVoiceprintLine } from 'react-icons/ri'

const ChatBox = () => {

    const [input, setInput] = useState("")
    const [numbers, setNumbers] = useState([])
    const [history, setHistory] = useState([])
    const [currentOperation, setOperation] = useState("")
    const [isRemoveDuplicate, setIsRemoveDuplicate] = useState(false) //to know remove duplicate process working or not
    const [loading, setLoading] = useState(false)
    const [chatList, setChatList] = useState([{ "who": "bot", "text": " Hello! I’m your assistant! How can I help you today?" }])
    const lastMessageRef = useRef(null);

    useEffect(() => {
        // Scroll to the last message when new messages are added
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            lastMessageRef.current.scrollTop = lastMessageRef.current.scrollHeight
        }

    }, [chatList]);

    // Call manipulate list when numbers state changes
    useEffect(() => {
        if (numbers.length > 0) {

            if(isRemoveDuplicate) setChatList(prevList => [...prevList, {
                "who": "bot", "text": `Updated List:[ ${numbers}]`
            }])

            manipulateList()

            if (findDuplicates().length > 0) {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "would you like to remove duplicates? yes/no" }])
                setIsRemoveDuplicate(true)
            } else {
                setOperation("")
                setIsRemoveDuplicate(false)
                setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
            }
        }
    }, [numbers])

    const dateTime = () => {
        const date = new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }); // Only Date
        const time = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }); // Only Time

        setChatList(prevList => [...prevList, { "who": "bot", "text": `Date: ${date}, Time: ${time}` }])
        setHistory(prevList => [...prevList, { "user": "can u let me know todays date/time?", "bot": `Date: ${date}, Time: ${time}` }])
        setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
    }

    function findDuplicates() {
        let seen = new Set();
        let duplicates = new Set();

        if (numbers.length > 0) {
            for (let num of numbers) {
                if (seen.has(num)) {
                    duplicates.add(num); // If already seen, it's a duplicate
                } else {
                    seen.add(num);
                }
            }
        }


        return [...duplicates]; // Convert Set to Array
    }

    function removeFirstOccurrenceOfDuplicates() {
        const countMap = new Map(); // Step 1: Create a Map to store counts

        // Step 2: Count occurrences of each number
        numbers.forEach(num => countMap.set(num, (countMap.get(num) || 0) + 1));

        const seen = new Set(); // Step 3: Track first duplicate removals
        return numbers.filter(num => {
            if (countMap.get(num) > 1 && !seen.has(num)) {
                seen.add(num); // Step 4: Mark first occurrence for removal
                return false;  // Step 5: Remove this first occurrence
            }
            return true; // Step 6: Keep the rest of the elements
        });
    }

    const manipulateList = () => {

        if (numbers.length > 0) {
            const sum = numbers.reduce((acc, curr) => acc + curr, 0);
            const reverse = numbers.slice().reverse()
            const max = numbers.reduce((acc, curr) => (curr > acc ? curr : acc), numbers[0]);

            setChatList(prevList => [...prevList, {
                "who": "bot", "text": `sum: ${sum}\nmax: ${max}\nreverse:[ ${reverse}]`
            }])

            setHistory(prevList => [...prevList, {
                "user": "list operations", "bot":
                    `sum: ${sum}\n 

            max: ${max}\n 

            reverse: [${reverse}]`
            }])

        } else {
            console.log("No numbers found");

        }

    }

    const listOperations = (message) => {

        setOperation("list operations")

        if (!currentOperation) {
            setChatList(prevList => [...prevList, {
                "who": "bot", "text": "Please enter a list of integers(comma separated integer) e.g: 7,93,2 or 8",
            }])
            return
        }

        const regex = /^[0-9]+(,[0-9]+)*$/

        if (regex.test(message)) {

            if (!isRemoveDuplicate) {

                let strNumbers = message.split(',')
                setNumbers(strNumbers.map(Number));

                return
            }
        } else if (!isRemoveDuplicate) {
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: list values must have only integers" }])
        }

        //Remove Duplicate elements
        if (message === 'yes' && isRemoveDuplicate) {
            setNumbers((value) => { return removeFirstOccurrenceOfDuplicates() })
            setHistory(prevList => [...prevList, { "user": "list operations", "bot": "would you like to remove duplicates? yes" }])

        } else if (message === 'no' && isRemoveDuplicate) {
            setOperation("")
            setIsRemoveDuplicate(false)
            setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
        } else if (isRemoveDuplicate) {
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter yes or no only" }])
        }

    }

    const isPrime = (num) => {
        if (num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
    };

    const generatePrimes = (start, end) => {
        let primes = [];
        for (let i = start; i <= end; i++) {
            if (isPrime(i)) {
                primes.push(i);
            }
        }
        return primes;
    };


    const primeOperations = (message) => {
        setOperation("prime operation")

        if (!currentOperation) {
            setChatList(prevList => [...prevList, {
                "who": "bot", "text": "Enter a range start and end (comma separated integer)",
            }])
            return
        }

        const regex = /^[0-9]+,[0-9]+$/

        if (regex.test(message)) {
            let strNumbers = message.split(',')
            let primeRange = strNumbers.map(Number)

            if (primeRange[0] < 2) {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Start value must be at least 2." }])
                return;
            }
            if (primeRange[0] > primeRange[1]) {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Start value must be less than or equal to End value." }])
                return;
            }
            const primeNumbers = generatePrimes(primeRange[0], primeRange[1])
            setChatList(prevList => [...prevList, { "who": "bot", "text": `Prime Numbers: [${primeNumbers}]` }])
            setHistory(prevList => [...prevList, { "user": "generate prime", "bot": `Prime Number: [${primeNumbers}]` }])
            setOperation("")
            setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])

        } else {
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: start and end values must have integers" }])
        }

    }

    const searchOperation = (message) => {
        setOperation("search operation")

        if (!currentOperation) {
            setChatList(prevList => [...prevList, {
                "who": "bot", "text": "Enter the keyword to search in chat history",
            }])
            return
        }


        if (message.length > 0) {
            message = message.toLowerCase()
            const searchChat = history.filter(value => { return (value.user.toLowerCase().includes(message)) })
            

            if (searchChat.length > 0) {
                let printSearch = searchChat.reduce((acc, curr) => acc +`\n-User: ${curr.user}`+ "\n-Chat Bot: " + curr.bot, "")
                setChatList(prevList => [...prevList, { "who": "bot", "text": `Found the following lines: ${printSearch}` }])
                setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
            } else {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "No match found!" }])
                setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
            }
            setOperation("")

        } else {
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter a search word" }])
        }
    }

    const findFrequentCommand = () => {

        if (history.length > 0) {
            let countMap = new Map()
            let freqObj = null
            let maxCount = 0

            history.forEach(value => {
                countMap.set(value.user, (countMap.get(value.user) || 0) + 1)
                if (countMap.get(value.user) > maxCount) {
                    maxCount = countMap.get(value.user)
                    freqObj = value
                }
            })
            return freqObj
        }
        return 0
    }

    async function saveFile(textContent) {
        const options = {
            suggestedName: "chatbot_summary.txt",
            types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }]
        };
    
        try {
            const fileHandle = await window.showSaveFilePicker(options);
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(textContent);
            await writableStream.close();
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Summary saved. Bye, have a good day!!" }])
            return true
        } catch (error) {
            console.error("File save failed:", error);
            return false
        }
    }

    const byeOperation = (message) => {
        
        if (message.length > 0) {
            setOperation("bye operation")

            if (history.length > 0) {
                const operation = history.filter(item => !item.bot.includes("would you like to"))
                setChatList(prevList => [...prevList, { "who": "bot", "text": `Here's a summary of your session:\n-Commands used: ${operation.length}\n-Most frequent command: ${findFrequentCommand().user}` }])
                
                    setChatList(prevList => [...prevList, {
                        "who": "bot", "text": "Do you want to save this summary?(yes/no)",
                    }])                
            } else {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "No operation found!" }])
                setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
                setOperation("")
                return
            }

            if(message === "yes" && currentOperation){
                setChatList(prevList => [...prevList, { "who": "bot", "text": "Goodbye! Have a great day!" }])
                let summary = history.map((item, index) => `${index+1}. User: ${item.user}\nChatBot: ${item.bot.replace(/\n/g, "")}`).join("\n")
                if(saveFile(summary)){
                    setOperation("")
                } else {
                    console.log("failed");
                }
               
            } else if(message === "no" && currentOperation){
                setChatList(prevList => [...prevList, { "who": "bot", "text": "How else can I assist you?" }])
                setOperation("")

            } else if(currentOperation) {
                setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter yes or no only" }])
            }

        } else {
            setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter a correct keyword" }])
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const message = input.trim().toLowerCase()

        if (message) {
            setChatList(prevList => [...prevList, { "who": "user", "text": input }])
            setTimeout(() => {
                setLoading(false)

                if (currentOperation) {

                    switch (currentOperation) {
                        case "list operations": listOperations(message)
                            break;

                        case "prime operation": primeOperations(message)
                            break;

                        case "search operation": searchOperation(message)
                            break;

                        case "bye operation": byeOperation(message)
                            break;

                        default: setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter correct keyword" }])
                            break;
                    }
                } else {

                    switch (message) {
                        case "hi": {
                            setChatList(prevList => [...prevList, { "who": "bot", "text": "Hi there! How can I help you today?" }])
                        }
                            break;

                        case "hello": {
                            setChatList(prevList => [...prevList, { "who": "bot", "text": "Hi there! How can I help you today?" }])
                        }
                            break;

                        case "can u let me know todays date/time?": dateTime()
                            break;

                        case "list operations": listOperations(message)
                            break;

                        case "generate prime": primeOperations(message)
                            break;

                        case "search history": searchOperation(message)
                            break;

                        case "bye": byeOperation(message)
                            break;

                        default: setChatList(prevList => [...prevList, { "who": "bot", "text": "Keyword mistmatch: Enter correct keyword" }])
                            break;
                    }

                }

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
                {(loading) &&
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