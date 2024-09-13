import React from "react";
import "../styles/Note.css";

function Note({note, onDelete, onUpdate}) {
    
    const formattedDate = new Date(note.created_at).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const formattedReminderTime = new Date(note.reminder).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
    });

    // console.log(note);

    return (
        <div className="note-container">
            <h2 className="note-title">{note.title}</h2>
            <p className="note-content">{note.content}</p>
            {note.reminder && formattedReminderTime && (
                // console.log(note.reminder),
                <p className="note-reminder">Reminder: {formattedReminderTime}</p>
            )}
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button>
            <button className="update-button" onClick={() => onUpdate(note.id)}>
                Update
            </button>
        </div>
    );
}

export default Note;