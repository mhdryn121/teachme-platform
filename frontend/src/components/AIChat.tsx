
export function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !socket) {
            // Connect to WebSocket
            const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            const wsUrl = API_URL.replace("http:", wsProtocol).replace("https:", wsProtocol).replace("/api/v1", "");
            const ws = new WebSocket(`${wsUrl}/api/v1/ws/chat/room1`);
            ws.close();
            setSocket(null);
        };
    }
    }, [isOpen, socket]);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

const sendMessage = () => {
    if (!input.trim() || !socket) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // Send to server
    socket.send(input);
    setInput("");
};

return (
    <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <MessageSquare className="w-6 h-6" />
            </button>
        )}

        {isOpen && (
            <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <span className="font-semibold">AI Tutor</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            <p>Hello! I'm your AI Tutor.</p>
                            <p className="text-sm">Ask me anything about the course.</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "flex gap-3 max-w-[80%]",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                )}
                            >
                                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div
                                className={clsx(
                                    "p-3 rounded-2xl text-sm",
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask a question..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}
