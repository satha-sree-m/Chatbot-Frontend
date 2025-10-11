import React from "react";
import { Avatar, Badge } from "antd";
import SearchBar from "./SearchBar";

function UserList({ users, onSelectUser, searchTerm, setSearchTerm, onlineStatus, unreadStatus }) {
    return (
        <div
            className="user-list"
            style={{
                width: "300px",
                border: "1px solid #ccc",
                padding: "15px",
            }}
        >
            <h3>Users</h3>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            <ul style={{ listStyleType: "none", padding: 0, maxHeight: "400px", overflowY: "auto" }}>
                {users.length === 0 ? (
                    <li>No users found</li>
                ) : (
                    users.map((u, i) => {
                        const userObj = u.user || u;
                        const displayName = `${userObj.firstName || "Unknown"} ${userObj.lastName || "User"}`;
                        const isOnline = !!onlineStatus[userObj._id];
                        const convId = u.convId;
                        const isUnread = unreadStatus[convId];
                        return (
                            <li
                                key={userObj._id || i}
                                onClick={() => onSelectUser(userObj._id)}
                                style={{
                                    cursor: "pointer",
                                    padding: "8px 5px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <Badge
                                    dot
                                    offset={[-9, 37]}
                                    color={isOnline ? "#76da45ff" : "orange"}
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                    }}
                                >
                                    <Avatar
                                        size={40}
                                        style={{
                                            backgroundColor: "#1daa61",
                                            color: "#fff",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {userObj.initials || `${(userObj.firstName?.[0] || "").toUpperCase()}${(userObj.lastName?.[0] || "").toUpperCase()}`}
                                    </Avatar>
                                </Badge>
                                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                                    {displayName}
                                </span>

                                {isUnread && (
                                    <span
                                        className="unread-dot"
                                        style={{
                                            marginLeft: 'auto',
                                            width: '8px',
                                            height: '8px',
                                            backgroundColor: 'blue',
                                            borderRadius: '50%',
                                            display: 'block'
                                        }} />
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}

export default UserList;
