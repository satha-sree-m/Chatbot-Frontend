import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Skeleton } from "antd";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { token, logout } = useAuth();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch all user conversations (ignore soft-deleted)
  const fetchConversations = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/chatbot/conversations");
      const activeConversations = res.data.filter((c) => !c.isDeleted);
      setConversations(activeConversations);

      if (!conversationId && activeConversations.length > 0) {
        navigate(`/app/chatbot/${activeConversations[0]._id}`, { replace: true });
      }
    } catch (err) {
      console.error("❌ Failed to load conversations:", err);
      setConversations([]);
    }
  }, [token, conversationId, navigate]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async () => {
    if (!token || !conversationId) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/chatbot/conversations/${conversationId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("❌ Failed to load messages:", err);
      setMessages([]);
    }
  }, [token, conversationId]);

  // Logout function
  const handleLogout = () => {
    setMessages([]);
    setConversations([]);
    logout();
    navigate("/login");
  };

  // Start new chat
  const handleNewChat = async () => {
    if (!token) return;

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/conversations");
      await fetchConversations();
      navigate(`/app/chatbot/${res.data.conversationId}`);
      setMessages([]);
    } catch (err) {
      console.error("❌ New chat error:", err);
    }
  };

  // Soft delete function
  const handleSoftDelete = async (chatId) => {
    try {
      await axios.put(`http://localhost:5000/api/chatbot/conversations/${chatId}/soft-delete`);
      setConversations((prev) => prev.filter((c) => c._id !== chatId)); // remove from UI
    } catch (error) {
      console.error("❌ Error performing soft delete:", error);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !token || !conversationId) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/ask", {
        message: input,
        conversationId,
      });
      const botMessage = { text: res.data.reply || "Bot reply", sender: "ai" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ Message send error:", err);
      setMessages((prev) => [...prev, { text: "Error: Bot not responding", sender: "ai" }]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch conversations/messages whenever token or conversation changes
  useEffect(() => {
    if (token) {
      fetchConversations();
      fetchMessages();
    }
  }, [token, conversationId, fetchConversations, fetchMessages]);

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#add8e6",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handleNewChat}
          style={{
            padding: "10px",
            marginBottom: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + New Chat
        </button>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {conversations.length === 0 ? (
            <div style={{ padding: "10px", color: "#555" }}>No conversations</div>
          ) : (
            conversations.map((conv, index) => {
              const isActive = conv._id === conversationId;
              return (
                <div
                  key={conv._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: isActive ? "2px solid #007bff" : "1px solid #ccc",
                    background: isActive ? "#e0f0ff" : "#fff",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                >
                  <div
                    onClick={() => navigate(`/app/chatbot/${conv._id}`)}
                    style={{ flex: 1 }}
                  >
                    Chat {conversations.length - index}
                  </div>
                 <i
  className="fa fa-trash"
  onClick={(e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (confirmDelete) {
      handleSoftDelete(conv._id);
    }
  }}
  style={{
    color: "red",
    fontSize: "15px",
    marginLeft: "8px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
></i>

                </div>
              );
            })
          )}
        </div>

        <div
          onClick={handleLogout}
          style={{
            padding: "10px 0",
            cursor: "pointer",
            display: "flex",
            gap: "10px",
            alignItems: "center",
            borderTop: "1px solid #333",
          }}
        >
          <i
            className="fa fa-user"
            style={{
              fontSize: "24px",
              padding: "8px",
              borderRadius: "50%",
              background: "#fff",
              border: "2px solid #000",
            }}
          ></i>
          <span>Logout</span>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#fff", minHeight: 0 }}>
        <div style={{ flex: 1, padding: "20px", overflowY: "auto", minHeight: 0 }}>
          {messages.length === 0 && !loading && (
            <div style={{ textAlign: "center", color: "#888" }}>Start chatting...</div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "10px 0" }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  background: msg.sender === "user" ? "#007bff" : "#e0e0e0",
                  color: msg.sender === "user" ? "white" : "black",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                {msg.sender === "ai" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
              </span>
            </div>
          ))}

          {loading && <Skeleton active paragraph={{ rows: 2 }} />}

          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: "10px", borderTop: "1px solid #ddd", display: "flex" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              background: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
