import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "../Project2/context/SocketContext";
import { Avatar, Button } from "antd";
import { LogoutOutlined, OpenAIOutlined, ScheduleOutlined, UserOutlined } from "@ant-design/icons";
import UserList from "./UserList";
import { useNavigate, useParams } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import "./Chat.css";
import { useAuth } from "../Project2/context/AuthContext";
import Modal from "antd/es/modal/Modal";
import api from "../Project2/utils/axiosInstance";

function ChatPage({ user }) {
    const socket = useSocket();
    const navigate = useNavigate();
    const { conversationId: urlConvId } = useParams();
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [chats, setChats] = useState({});
    const [loading, setLoading] = useState(false);
    const [showProf, setShowProf] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [activeConversations, setActiveConversations] = useState([]);
    const [conversationMap, setConversationMap] = useState({});
    const [unreadStatus, setUnreadStatus] = useState({});
    const [conversationId, setConversationId] = useState(urlConvId || null);
    const conversationMapRef = useRef({});
    const [onlineStatus, setOnlineStatus] = useState({});
    const { logout } = useAuth();
    const activeConvIdRef = useRef(null);
    const isReceiverOnline = activeUser ? onlineStatus[activeUser._id] : false;
    const dummyUser = {
        username: activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : "User",
        profilePic: "/dummy-avatar.png",
    };
    useEffect(() => {
        if (!conversationId) return;
        activeConvIdRef.current = conversationId;
        setMessages(chats[conversationId] || []);
    }, [conversationId, chats]);
    useEffect(() => {
        const timeout = setTimeout(() => {
            const fetchUsers = async () => {
                try {
                    const res = await api.get(
                        searchTerm ? `/users/search?q=${searchTerm}` : "/users"
                    );
                    setSearchResults(res.data);
                } catch (err) {
                    console.error("Failed to fetch users:", err);
                }
            };
            fetchUsers();
        }, 300);


        return () => clearTimeout(timeout);
    }, [searchTerm]);
    useEffect(() => {
        if (!socket) return;

        // --- When a single message's status changes (like "delivered") ---
        const handleMessageStatusUpdate = ({ messageId, status }) => {
            setChats(prev => {
                const copy = { ...prev };
                Object.keys(copy).forEach(convId => {
                    copy[convId] = copy[convId].map(m =>
                        m._id === messageId ? { ...m, status } : m
                    );
                });
                return copy;
            });
        };

        // --- When entire conversation messages are marked as read (blue tick) ---
        const handleConversationStatusUpdate = ({ conversationId, status, messageIds }) => {
            if (status === "read") {
                // mark unread false in sidebar
                setUnreadStatus(prev => ({ ...prev, [conversationId]: false }));
            }

            setChats(prev => {
                const newChats = { ...prev };
                if (newChats[conversationId]) {
                    newChats[conversationId] = newChats[conversationId].map(msg => {
                        if (
                            msg.sender === user._id && // only mark your own sent messages
                            messageIds.includes(msg._id.toString())
                        ) {
                            return { ...msg, status: "read" };
                        }
                        return msg;
                    });
                }
                return newChats;
            });
        };

        // --- When a message is edited or deleted ---
        const handleMessageUpdated = (updatedMsg) => {
            setChats(prev => {
                const newChats = { ...prev };
                const convId = updatedMsg.parentId;
                if (!newChats[convId]) return newChats;

                newChats[convId] = newChats[convId].map(m =>
                    m._id === updatedMsg._id ? updatedMsg : m
                );
                return newChats;
            });
        };

        // Attach all listeners
        socket.on("message-status-update", handleMessageStatusUpdate);
        socket.on("conversation-status-update", handleConversationStatusUpdate);
        socket.on("message-updated", handleMessageUpdated);

        // Cleanup on unmount
        return () => {
            socket.off("message-status-update", handleMessageStatusUpdate);
            socket.off("conversation-status-update", handleConversationStatusUpdate);
            socket.off("message-updated", handleMessageUpdated);
        };
    }, [socket, user]);

    const markMessageAsRead = (convId, messageId) => {
        setChats(prev => {
            const copy = { ...prev };
            if (copy[convId]) {
                copy[convId] = copy[convId].map(m =>
                    m._id === messageId ? { ...m, status: "read" } : m
                );
            }
            return copy;
        });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("message-status-update", ({ messageId, status }) => {
            setChats(prev => {
                const copy = { ...prev };
                Object.keys(copy).forEach(convId => {
                    copy[convId] = copy[convId].map(m =>
                        m._id === messageId ? { ...m, status } : m
                    );
                });
                return copy;
            });
        });

        return () => socket.off("message-status-update");
    }, [socket]);

    useEffect(() => {
        const loadConversationFromUrl = async () => {
            if (!urlConvId || !user) return;

            try {
                const res = await api.get(`/conversations/user/${user._id}`);
                const convs = res.data;

                const conv = convs.find(c => c._id === urlConvId);
                if (!conv) {
                    console.warn("Conversation not found in user conversations");
                    return;
                }

                const otherUser = conv.users.find(u => u._id !== user._id) || user;
                setActiveUser(otherUser);

                const msgRes = await api.get(`/messages/${urlConvId}`);
                setChats(prev => ({ ...prev, [urlConvId]: msgRes.data.messages }));

                setConversationMap(prev => ({ ...prev, [otherUser._id]: urlConvId }));
                conversationMapRef.current = { ...conversationMapRef.current, [otherUser._id]: urlConvId };

                setUnreadStatus(prev => ({ ...prev, [urlConvId]: false }));

            } catch (err) {
                console.error("Failed to load conversation from URL:", err);
            }
        };

        loadConversationFromUrl();
    }, [urlConvId, user]);



    const sortConversations = (convs) => {
        return [...convs].sort(
            (a, b) => new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
        );
    };
    const fetchActiveConversations = useCallback(async () => {
        try {
            const initialUnreadStatus = {};
            const res = await api.get(`/conversations/user/${user._id}`);
            const data = res.data;
            const convs = data
                .map(conv => {
                    let otherUser = conv.users.find(u => u._id !== user._id);
                    if (!otherUser && conv.users.length === 2 && conv.users[0]._id === user._id) {
                        otherUser = conv.users[0];
                    }
                    if (!otherUser) return null;
                    return {
                        user: otherUser,
                        convId: conv._id,
                        lastMessageTime: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
                        isSelfChat: conv.users.every(u => u._id === user._id),
                    };
                })
                .filter(Boolean)
            setActiveConversations(sortConversations(convs));
            for (const conv of convs) {
                const msgRes = await api.get(`/messages/${conv.convId}`);
                const messages = msgRes.data.messages;

                const hasUnread = messages.some(msg => msg.sender !== user._id && msg.status !== 'read');
                if (hasUnread) {
                    initialUnreadStatus[conv.convId] = true;
                }
                setChats(prev => ({ ...prev, [conv.convId]: messages }));

                const lastMessage = messages[messages.length - 1];
                if (lastMessage) {
                    conv.lastMessageTime = new Date(lastMessage.createdAt);
                }
            }

            setActiveConversations(sortConversations(convs));
            setUnreadStatus(initialUnreadStatus);
        } catch (err) {
            console.error("Failed to load active conversations:", err);
        }
    }, [user?._id]);

    useEffect(() => {
        if (user?._id) fetchActiveConversations();
    }, [user?._id, fetchActiveConversations]);
    const fetchActiveConversationsRef = useRef(fetchActiveConversations);

    useEffect(() => {
        fetchActiveConversationsRef.current = fetchActiveConversations;
    }, [fetchActiveConversations]);

    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit("add-user", user._id);

        const interval = setInterval(() => {
            socket.emit("add-user", user._id);
        }, 30000);

        return () => clearInterval(interval);
    }, [socket, user?._id]);

    useEffect(() => {
        if (!socket) return;

        const handleUserStatus = ({ userId, isOnline }) => {
            setOnlineStatus(prev => ({ ...prev, [userId]: isOnline }));
        };

        socket.on('user-status', handleUserStatus);

        return () => {
            socket.off('user-status', handleUserStatus);
        };
    }, [socket]);


    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit("add-user", user._id);


        const handleReceiveMessage = ({ senderId, message }) => {
            let convId =
                conversationMapRef.current[senderId] ||
                message.parentId ||
                message.conversationId;

            const currentActiveConvId = activeConvIdRef.current;

            if (!conversationMapRef.current[senderId]) {
                conversationMapRef.current[senderId] = convId;
                setConversationMap(prev => ({ ...prev, [senderId]: convId }));
            }

            if (convId === currentActiveConvId) {
                message.status = "read";


                setChats(prev => {
                    const updated = { ...prev };
                    const msgs = updated[convId] || [];
                    if (msgs.some(m => m._id === message._id)) {
                        return updated;
                    }
                    if (updated[convId]) {
                        updated[convId] = updated[convId].map(m =>
                            m.status !== "read" && m.sender !== user._id
                                ? { ...m, status: "read" }
                                : m
                        );
                    }

                    updated[convId] = [...(updated[convId] || []), message];
                    return updated;
                });

                if (socket && user?._id) {
                    socket.emit("mark-as-read", {
                        conversationId: convId,
                        readerId: user._id,
                    });
                }
            } else {
                setUnreadStatus(prev => ({ ...prev, [convId]: true }));
                setChats(prev => ({
                    ...prev,
                    [convId]: [...(prev[convId] || []), message],
                }));
            }

            setActiveConversations(prev => {
                const existingIndex = prev.findIndex(ac => ac.user._id === senderId);

                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = {
                        ...copy[existingIndex],
                        lastMessageTime: message.createdAt,
                    };
                    return sortConversations(copy);
                } else {
                    fetchActiveConversationsRef.current();
                    return prev;
                }
            });
        };

        socket.on("receive-message", handleReceiveMessage);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [socket, user?._id]);



    useEffect(() => {
        if (!conversationId) return;
        activeConvIdRef.current = conversationId;

        const fetchChats = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/messages/${conversationId}`);
                setChats((prev) => ({
                    ...prev,
                    [conversationId]: res.data.messages,
                }));
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchChats();
    }, [conversationId]);

    const sendMessage = (text) => {
        if (!conversationId || !activeUser || !socket) return;

        const tempMessage = {
            _id: `temp_${Date.now()}`,
            sender: user._id,
            text,
            conversationId,
            createdAt: new Date().toISOString(),
            status: 'sent',
        };

        setChats(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), tempMessage],
        }));
        socket.emit("send-message", {
            senderId: user._id,
            receiverId: activeUser._id,
            text,
            conversationId,
        }, (savedMessage) => {
            if (savedMessage && !savedMessage.error) {
                setChats(prev => {
                    const currentMessages = prev[conversationId] || [];

                    return {
                        ...prev,
                        [conversationId]: currentMessages.map(msg =>
                            msg._id === tempMessage._id ? savedMessage : msg
                        ),
                    };
                });

                setActiveConversations(prev => {
                    const copy = [...prev];
                    const index = copy.findIndex(ac => ac.convId === conversationId);
                    const lastMessageTime = savedMessage.createdAt ? new Date(savedMessage.createdAt) : new Date();

                    if (index !== -1) {
                        copy[index] = {
                            ...copy[index],
                            lastMessageTime,
                        };
                    } else {
                        copy.push({
                            user: activeUser,
                            convId: conversationId,
                            lastMessageTime,
                        });
                    }

                    return sortConversations(copy);
                });
            }
        });


    };
    const handleStatusUpdate = ({ messageId, status }) => {
        const targetMessageId = messageId.toString();

        setChats(prev => {
            const newChats = { ...prev };

            for (const convId in newChats) {
                newChats[convId] = newChats[convId].map(msg =>
                    (msg._id ? msg._id.toString() : null) === targetMessageId
                        ? { ...msg, status }
                        : msg
                );
            }
            return newChats;
        });
    };
    const handleConversationStatusUpdate = ({ conversationId, status, messageIds, otherUserId }) => {
        if (status === 'read') {
            setUnreadStatus(prev => ({ ...prev, [conversationId]: false }));
        }

        setChats(prev => {
            const newChats = { ...prev };

            if (newChats[conversationId]) {
                newChats[conversationId] = newChats[conversationId].map(msg => {
                    if (msg.sender === user._id && messageIds.includes(msg._id.toString())) {
                        return { ...msg, status: 'read' };
                    }
                    return msg;
                });
            }
            return newChats;
        });
    };
    useEffect(() => {
        if (!socket) return;

        socket.on("message-status-update", handleStatusUpdate);
        socket.on("conversation-status-update", handleConversationStatusUpdate);
        return () => {
            socket.off("message-status-update", handleStatusUpdate);
            socket.off("conversation-status-update", handleConversationStatusUpdate);
        };
    }, [socket]);
    useEffect(() => {
        if (!socket) return;

        // --- When a single message's status changes (like "delivered") ---
        const handleMessageStatusUpdate = ({ messageId, status }) => {
            setChats(prev => {
                const copy = { ...prev };
                Object.keys(copy).forEach(convId => {
                    copy[convId] = copy[convId].map(m =>
                        m._id === messageId ? { ...m, status } : m
                    );
                });
                return copy;
            });
        };

        // --- When entire conversation messages are marked as read (blue tick) ---
        const handleConversationStatusUpdate = ({ conversationId, status, messageIds }) => {
            if (status === "read") {
                // mark unread false in sidebar
                setUnreadStatus(prev => ({ ...prev, [conversationId]: false }));
            }

            setChats(prev => {
                const newChats = { ...prev };
                if (newChats[conversationId]) {
                    newChats[conversationId] = newChats[conversationId].map(msg => {
                        if (
                            msg.sender === user._id && // only mark your own sent messages
                            messageIds.includes(msg._id.toString())
                        ) {
                            return { ...msg, status: "read" };
                        }
                        return msg;
                    });
                }
                return newChats;
            });
        };

        // --- When a message is edited or deleted ---
        const handleMessageUpdated = (updatedMsg) => {
            setChats(prev => {
                const newChats = { ...prev };
                const convId = updatedMsg.parentId;
                if (!newChats[convId]) return newChats;

                newChats[convId] = newChats[convId].map(m =>
                    m._id === updatedMsg._id ? updatedMsg : m
                );
                return newChats;
            });
        };

        // Attach all listeners
        socket.on("message-status-update", handleMessageStatusUpdate);
        socket.on("conversation-status-update", handleConversationStatusUpdate);
        socket.on("message-updated", handleMessageUpdated);

        // Cleanup on unmount
        return () => {
            socket.off("message-status-update", handleMessageStatusUpdate);
            socket.off("conversation-status-update", handleConversationStatusUpdate);
            socket.off("message-updated", handleMessageUpdated);
        };
    }, [socket, user]);


    const editMessage = async (msgId, newText) => {
        try {
            const res = await fetch(`/api/messages/${msgId}/edit`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newText, editorId: user._id })
            });

            if (!res.ok) throw new Error("Failed to edit message");

            const data = await res.json();
            const updatedMsg = data.updatedMessage;

            setChats(prev => ({
                ...prev,
                [conversationId]: prev[conversationId].map(msg =>
                    msg._id === msgId ? updatedMsg : msg
                )
            }));

            setActiveConversations(prev =>
                sortConversations(
                    prev.map(ac =>
                        ac.convId === conversationId
                            ? { ...ac, lastMessageTime: new Date(updatedMsg.updatedAt) }
                            : ac
                    )
                )
            );

        } catch (err) {
            console.error("Failed to edit message:", err);
        }
    };



    const deleteMessage = async (msgId) => {
        try {
            await api.patch(`/messages/${msgId}/delete`);
            setChats(prev => ({
                ...prev,
                [conversationId]: prev[conversationId].map(msg =>
                    msg._id === msgId ? { ...msg, isDeleted: true } : msg
                )
            }));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const handleSelectUser = async (selectedUserId) => {
        const selectedUser = searchResults.find(u => u._id === selectedUserId);
        setActiveUser(selectedUser);

        let convId = conversationMap[selectedUserId];

        if (!convId) {
            try {
                const res = await api.get(`/conversations/byUsers/${user._id}/${selectedUserId}`);
                convId = res.data._id;
            } catch (err) {
                if (err.response?.status === 404) {
                    const createRes = await api.post(`/conversations`, {
                        users: [user._id, selectedUserId],
                    });
                    convId = createRes.data._id;
                } else {
                    console.error("Failed to get/create conversation:", err);
                    return;
                }
            }

            setConversationMap(prev => {
                const newMap = { ...prev, [selectedUserId]: convId };
                conversationMapRef.current = newMap;
                return newMap;
            });
        }

        setConversationId(convId);
        setUnreadStatus(prev => ({ ...prev, [convId]: false }));

        try {
            const msgRes = await api.get(`/messages/${convId}`);
            const messages = msgRes.data.messages;

            setChats(prev => ({ ...prev, [convId]: messages }));

            const lastMessage = messages[messages.length - 1];
            const lastMsgTime = lastMessage?.createdAt ? new Date(lastMessage.createdAt) : new Date();

            setActiveConversations(prev => {
                const existingIndex = prev.findIndex(ac => ac.convId === convId);
                let updatedConversations;

                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = { ...copy[existingIndex], lastMessageTime: lastMsgTime };
                    updatedConversations = copy;
                } else {
                    updatedConversations = [{ user: selectedUser, convId, lastMessageTime: lastMsgTime }, ...prev];
                }

                return updatedConversations;
            });

            setSearchTerm("");
            navigate(`/chat/${convId}`);

        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };




    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ senderId }) => {
            setTypingUsers(prev => prev.includes(senderId) ? prev : [...prev, senderId]);
        };

        const handleStopTyping = ({ senderId }) => {
            setTypingUsers(prev => prev.filter(id => id !== senderId));
        };

        socket.on("typing", handleTyping);
        socket.on("stop-typing", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stop-typing", handleStopTyping);
        };
    }, [socket]);


    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit('get-online-users');

        socket.on('online-users-list', (onlineUsersMap) => {
            setOnlineStatus(onlineUsersMap);
        });

        socket.on('user-connected', (userId) => {
            setOnlineStatus(prev => ({ ...prev, [userId]: true }));
        });

        socket.on('user-disconnected', (userId) => {
            setOnlineStatus(prev => ({ ...prev, [userId]: false }));
        });

        return () => {
            socket.off('online-users-list');
            socket.off('user-connected');
            socket.off('user-disconnected');
        };
    }, [socket, user?._id]);

    if (!user?.email) {
        return <div>Please log in to use chat</div>;
    }

    return (
        <div className="chat-page">
            <div className="chat-navbar">
                <div className="profile-section">
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{ cursor: "pointer", backgroundColor: "#1daa61" }}
                        onClick={() => setShowProf(true)}
                    /><span className="font-bold text-lg">
                        {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "User"}
                    </span>
                </div>
                <Modal
                    open={showProf}
                    footer={null}
                    onCancel={() => setShowProf(false)}
                    centered
                >
                    <Avatar
                        src={dummyUser?.profilePic}
                        icon={<UserOutlined />}
                        size={40}
                        style={{ cursor: "pointer", backgroundColor: "#1daa61" }}

                    />
                    <h3 style={{ textAlign: "center", marginTop: "10px" }}>

                        {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "User"}

                    </h3>
                </Modal>
                <div>
                    <Button
                        className="chatbot-btn"
                        style={{ marginRight: "10px" }}
                        onClick={() =>
                            navigate("/chatbot")
                        }
                    >
                        <OpenAIOutlined />
                        Chatbot
                    </Button>
                    <Button
                        className="chatbot-btn"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                            navigate("/projects");
                        }}
                    >
                        <ScheduleOutlined />
                        Task Manager
                    </Button>
                    <Button
                        type="text"
                        icon={<LogoutOutlined style={{ fontSize: "20px" }} />}
                        onClick={() => {
                            if (socket && user?._id) {
                                socket.emit('user-logout', user._id);
                            }

                            logout();

                        }}
                        className="logout-btn"
                    />
                </div>
            </div>
            <div className="chat-container">

                <UserList
                    users={
                        searchTerm
                            ? searchResults.map(user => ({ user, convId: conversationMap[user._id] }))
                            : activeConversations
                    }
                    onSelectUser={handleSelectUser}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    unreadStatus={unreadStatus}
                    onlineStatus={onlineStatus}
                />
                <ChatWindow
                    markMessageAsRead={markMessageAsRead}
                    activeUser={activeUser}
                    currentUser={user?._id}
                    parentId={conversationId}
                    messages={conversationId ? chats[conversationId] || [] : []}
                    onSendMessage={sendMessage}
                    setMessages={setMessages}
                    onDeleteMessage={deleteMessage}
                    onEditMessage={editMessage}
                    loading={loading}
                    typingUsers={typingUsers}
                    isReceiverOnline={isReceiverOnline}
                />


            </div>
        </div>
    );
}

export default ChatPage;