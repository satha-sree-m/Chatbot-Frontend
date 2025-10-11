import React, { useEffect, useRef, useState } from "react";
import {
    CopyOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, Popconfirm, Spin, message as antMessage } from 'antd';
import Avatar from "antd/es/avatar/Avatar";
import Modal from "antd/es/modal/Modal";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSocket } from "../Project2/context/SocketContext";


function ChatWindow({ activeUser, currentUser, parentId, messages, onSendMessage, onDeleteMessage, loading, onEditMessage, typingUsers, conversationId, setChats, markMessageAsRead, setMessages }) {
    const chatMessagesContainerRef = useRef(null);
    const typingTimeouts = useRef({});
    const messageRefs = useRef({});
    const [input, setInput] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    const [editingMsg, setEditingMsg] = useState(null);
    const [isSeen, setIsSeen] = useState(false);
    const socket = useSocket();
    const observersRef = useRef({});
    useEffect(() => {
        if (chatMessagesContainerRef.current) {
            chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
        }
    }, [messages]);
    useEffect(() => {
        setInput("");
        setEditingMsg(null);
    }, [activeUser, parentId]);

    const handleSend = () => {
        if (!input.trim()) return;

        if (editingMsg) {
            // 1. Update DB & local state
            onEditMessage(editingMsg._id, input);

            // 2. Emit edit-message to socket
            if (socket && activeUser) {
                socket.emit("edit-message", {
                    messageId: editingMsg._id,
                    newText: input,
                    senderId: currentUser,
                    receiverId: activeUser._id,
                    conversationId: parentId,
                });
            }

            setEditingMsg(null);
        } else {
            onSendMessage(input);
        }

        setInput("");

        if (socket && activeUser) {
            socket.emit("stop-typing", {
                senderId: currentUser,
                receiverId: activeUser._id,
            });
        }
    };
    const handleDelete = (msgId) => {
        // 1. Delete from DB & local state
        onDeleteMessage(msgId);

        // 2. Emit to receiver
        if (socket && activeUser && currentUser) {
            socket.emit("delete-message", {
                messageId: msgId,
                senderId: currentUser,
                receiverId: activeUser._id,
                conversationId: parentId,
            });
        }

        if (editingMsg?._id === msgId) {
            setEditingMsg(null);
            setInput("");
        }
    };
    useEffect(() => {
        if (!socket) return;

        // 🔹 When a message is edited
        const handleMessageUpdated = (updatedMsg) => {
            console.log("Socket event: message-updated received:", updatedMsg);
            setMessages((prev) =>
                prev.map((m) => (m._id === updatedMsg._id ? { ...m, ...updatedMsg } : m))
            );
        };

        // 🔹 When a message is deleted
        const handleMessageDeleted = ({ messageId }) => {
            console.log("Socket event: message-deleted received:", messageId);
            setChats((prev) => {
                const updated = { ...prev };
                if (!updated[conversationId]) return updated;

                updated[conversationId] = updated[conversationId].map((msg) =>
                    msg._id.toString() === messageId.toString()
                        ? { ...msg, isDeleted: true, text: "This message was deleted" }
                        : msg
                );

                return updated;
            });

            if (conversationId === conversationIdRef.current) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id.toString() === messageId.toString()
                            ? { ...msg, isDeleted: true, text: "This message was deleted" }
                            : msg
                    )
                );
            }
        };

        // 🔹 When messages are read
        const handleMessageRead = ({ messageIds }) => {
            console.log("Socket event: message-read received:", messageIds);
            setMessages((prev) =>
                prev.map((m) =>
                    messageIds.includes(m._id) ? { ...m, status: "read" } : m
                )
            );
        };

        socket.on("message-updated", handleMessageUpdated);
        socket.on("message-deleted", handleMessageDeleted);
        socket.on("message-read", handleMessageRead);

        // Cleanup on unmount or socket change
        return () => {
            socket.off("message-updated", handleMessageUpdated);
            socket.off("message-deleted", handleMessageDeleted);
            socket.off("message-read", handleMessageRead);
        };
    }, [socket, conversationId, setMessages, setChats]);



    const handleCopyClick = (m) => {
        navigator.clipboard.writeText(m.text)
            .then(() => antMessage.success('Message copied to clipboard'))
            .catch(() => antMessage.error('Failed to copy message'));
    };

    const dummyUser = {
        username: activeUser ? `${activeUser.firstName} ${activeUser.lastName}` : "User",
        profilePic: "/dummy-avatar.png",
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    const handleEditClick = (msg) => {
        setEditingMsg(msg);
        setInput(msg.text);
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInput(text);

        if (!socket || !activeUser || !currentUser) return;

        const timeoutKey = `${currentUser}_${activeUser._id}`;
        console.log('typing');

        socket.emit('typing', {
            senderId: currentUser,
            receiverId: activeUser._id,
        });

        clearTimeout(typingTimeouts.current[timeoutKey]);

        typingTimeouts.current[timeoutKey] = setTimeout(() => {
            console.log('stop-typing');

            socket.emit('stop-typing', {
                senderId: currentUser,
                receiverId: activeUser._id,
            });
        }, 1200);
    };
    useEffect(() => {
        if (!socket || !currentUser?._id || !parentId || !messages?.length) return;

        socket.emit("mark-as-read", {
            conversationId: parentId,
            readerId: currentUser._id,
        });
    }, [socket, currentUser, parentId, messages]);


    useEffect(() => {
        if (!socket || !activeUser || !messages.length) return;

        messages.forEach((m) => {
            if (m.sender === activeUser._id && m.status !== "read") {
                const el = messageRefs.current[m._id];
                if (!el) return; // element not rendered yet
                if (observersRef.current[m._id]) return; // already observing

                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            console.log("mark-as-read for", m._id);

                            socket.emit("mark-as-read", {
                                conversationId: parentId,
                                readerId: currentUser,
                                messageIds: [m._id],
                            });

                            markMessageAsRead(parentId, m._id);
                            observer.unobserve(entry.target);
                            delete observersRef.current[m._id];
                        }
                    },
                    { threshold: 0.7 }
                );

                observer.observe(el);
                observersRef.current[m._id] = observer;
            }
        });

        return () => {
            Object.values(observersRef.current).forEach(obs => obs.disconnect());
            observersRef.current = {};
        };
    }, [messages, activeUser, socket, currentUser, parentId]);




    return (
        <div className="chat-window">
            {!activeUser ? (
                <div className="empty-chat">Select a user to start chatting</div>
            ) : (
                <>
                    <div className="chat-header">
                        <Avatar
                            src={dummyUser.profilePic}
                            icon={<UserOutlined />}
                            size={40}
                            style={{ cursor: "pointer", backgroundColor: "#1daa61" }}
                            onClick={() => setShowProfile(true)}
                        />
                        <span className="chat-username">{dummyUser.username}</span>
                    </div>
                    <Modal
                        open={showProfile}
                        footer={null}
                        onCancel={() => setShowProfile(false)}
                        centered
                    >
                        <Avatar
                            src={dummyUser.profilePic}
                            icon={<UserOutlined />}
                            size={40}
                            style={{ cursor: "pointer", backgroundColor: "#1daa61" }}

                        />
                        <h3 style={{ textAlign: "center", marginTop: "10px" }}>
                            {dummyUser.username}
                        </h3>
                    </Modal>
                    <div className="messages" ref={chatMessagesContainerRef}>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spin size="large" style={{ color: '#1daa61' }} />
                            </div>
                        ) : messages.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888' }}>No messages yet</p>
                        ) : (
                            messages.map((m) => {
                                const isSelfChat = m.sender === currentUser && activeUser?._id === currentUser;
                                const status = isSelfChat ? 'read' : m.status;

                                return (
                                    <div
                                        key={m._id}
                                        ref={el => { if (el) messageRefs.current[m._id] = el; }}
                                        className={`message-bubble ${m.sender === currentUser ? "sent" : "received"}`}
                                    >
                                        <div className={`message-text ${m.isDeleted ? "deleted" : ""}`}>
                                            {m.isDeleted ? "This message is deleted" : m.text}
                                        </div>
                                        <div className="message-time" style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                            {m.edited && <span className="edited-label"><i> Edited </i></span>}
                                            {new Date(m.updatedAt || m.createdAt).toISOString().slice(11, 16)}
                                            {m.sender === currentUser && (
                                                <span>
                                                    <div className="message-status">
                                                        {status === 'sent' && <span style={{ color: 'gray' }}>✓</span>}
                                                        {status === 'delivered' && <span style={{ color: 'gray' }}>✓✓</span>}
                                                        {status === 'read' && <span style={{ color: 'blue' }}>✓✓</span>}
                                                        {status === 'pending' && <ClockCircleOutlined style={{ color: 'gray' }} />}
                                                    </div>
                                                </span>
                                            )}
                                        </div>

                                        {!m.isDeleted && m.sender === currentUser && (
                                            <div className="message-actions">
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            {
                                                                key: "copy",
                                                                label: (
                                                                    <span style={{ color: "#555" }} onClick={() => handleCopyClick(m)}>
                                                                        <CopyOutlined style={{ marginRight: 8, color: "blue" }} />
                                                                        Copy
                                                                    </span>
                                                                ),
                                                            },
                                                            {
                                                                key: "edit",
                                                                label: (
                                                                    <span style={{ color: "#555" }} onClick={() => handleEditClick(m)}>
                                                                        <EditOutlined style={{ marginRight: 8, color: "green" }} />
                                                                        Edit
                                                                    </span>
                                                                ),
                                                            },
                                                            {
                                                                key: "delete",
                                                                label: (
                                                                    <Popconfirm
                                                                        title="Delete this message?"
                                                                        description="This action cannot be undone."
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                        onConfirm={() => handleDelete(m._id)}
                                                                    >
                                                                        <span style={{ color: "#555" }}>
                                                                            <DeleteOutlined style={{ marginRight: 8, color: "red" }} />
                                                                            Delete
                                                                        </span>
                                                                    </Popconfirm>
                                                                ),
                                                            },
                                                        ],
                                                    }}
                                                    trigger={['hover']}
                                                >
                                                    <span className="ellipsis-icon">⋮</span>
                                                </Dropdown>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {typingUsers.includes(activeUser?._id) && (
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    )}
                    <div className="input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSend} disabled={!input.trim()}>
                            {editingMsg ? "✓" : "➤"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ChatWindow;
