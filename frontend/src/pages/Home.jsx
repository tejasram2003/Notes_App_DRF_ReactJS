import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [reminder, setReminder] = useState(false); // State for the reminder checkbox
    const [reminderTime, setReminderTime] = useState(""); // State for the reminder time
    const [reminderError, setReminderError] = useState(""); // State for reminder validation error

    useEffect(() => {
        getNotes();
    }, []);

    // a function to send notification alert if the reminder time is 1 minute before current time

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            console.log("current time");
            console.log(currentTime);
    
            notes.forEach((note) => {
                if (note.reminder_time) {
                    const reminderTime = new Date(note.reminder_time);
    
                    // Check if the reminder time is within the next 1 minute
                    const timeDifference = reminderTime.getTime() - currentTime.getTime();
                    console.log(timeDifference);
                    if (timeDifference > 0 && timeDifference <= 60000) {
                        alert(`Reminder: ${note.title}`);
                    }
                }
            });
        }, 60000);
        
        return () => clearInterval(interval);
    }, [notes]);



    const getNotes = () => {
        api.get("/api/notes/")
            .then((res) => res.data)
            .then((data) => { setNotes(data); console.log(data) })
            .catch((err) => alert(err));
    }

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then(res => {
            // if (res.status === 204) 
            //     alert("Note deleted successfully");
            // else 
            //     alert("Error deleting note");
            getNotes();
        }).catch(err => alert(err));
    }

    const createNote = (e) => {
        e.preventDefault();
        if (reminder && !reminderTime) {
            setReminderError("Please set a valid reminder time.");
            return;
        }

        const noteData = {
            title,
            content,
            reminder,
            reminder_time: reminder ? reminderTime : null
        };

        api.post("api/notes/", noteData)
            .then(res => {
                getNotes();
                setTitle("");
                setContent("");
                setReminder(false);
                setReminderTime("");
                setReminderError(""); // Clear error after successful creation
            })
            .catch(err => alert(err));
    }

    const updateNote = (e) => {
        e.preventDefault();
        if (!selectedNote) return;

        if (reminder && !reminderTime) {
            setReminderError("Please set a valid reminder time.");
            return;
        }

        const updatedData = {
            title,
            content,
            reminder,
            reminder_time: reminder ? reminderTime : null
        };

        api.put(`/api/notes/update/${selectedNote.id}/`, updatedData)
            .then(res => {
                // if (res.status === 200) 
                //     alert("Note updated successfully");
                // else 
                //     alert("Error updating note");
                getNotes();
                setUpdateFormVisible(false);
                setSelectedNote(null);
                setTitle("");
                setContent("");
                setReminder(false);
                setReminderTime("");
                setReminderError(""); // Clear error after successful update
            })
            .catch(err => alert(err));
    }

    const showUpdateForm = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setReminder(note.reminder);
        setReminderTime(note.reminder_time || "");
        setUpdateFormVisible(true);
    }

    const handleReminderTimeChange = (e) => {
        const selectedTime = new Date(e.target.value);
        const currentTime = new Date();

        if (selectedTime < currentTime) {
            setReminderError("Reminder time cannot be in the past.");
        } else {
            setReminderError("");
            setReminderTime(e.target.value);
        }
    }

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note 
                        note={note} 
                        onDelete={deleteNote} 
                        onUpdate={() => showUpdateForm(note)} 
                        key={note.id}
                    />
                ))}
            </div>

            {updateFormVisible ? (
                <div>
                    <h2>Update Note</h2>
                    <form onSubmit={updateNote}>
                        <label htmlFor="updateTitle">Title:</label><br/>
                        <input 
                            type="text" 
                            id="updateTitle" 
                            name="updateTitle" 
                            required 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                        <br/>
                        <label htmlFor="updateContent">Content:</label><br/>
                        <textarea 
                            id="updateContent" 
                            name="updateContent" 
                            required 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                        />
                        <br/>
                        <label>
                            <input
                                type="checkbox"
                                checked={reminder}
                                onChange={() => setReminder(!reminder)}
                            />
                            Set Reminder
                        </label>
                        <br/>
                        {reminder && (
                            <>
                                <label htmlFor="updateReminderTime">Reminder Time:</label><br/>
                                <input
                                    type="datetime-local"
                                    id="updateReminderTime"
                                    name="updateReminderTime"
                                    value={reminderTime}
                                    onChange={handleReminderTimeChange}
                                />
                                <br/>
                                {reminderError && <p className="error">{reminderError}</p>}
                            </>
                        )}
                        <input type="submit" value="Update Note" />
                        <button onClick={() => setUpdateFormVisible(false)}>Cancel</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Create a Note</h2>
                    <form onSubmit={createNote}>
                        <label htmlFor="title">Title:</label><br/>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            required 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                        />
                        <br/>
                        <label htmlFor="content">Content:</label><br/>
                        <textarea 
                            id="content" 
                            name="content" 
                            required 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                        />
                        <br/>
                        <label>
                            <input
                                type="checkbox"
                                checked={reminder}
                                onChange={() => setReminder(!reminder)}
                            />
                            Set Reminder
                        </label>
                        <br/>
                        {reminder && (
                            <>
                                <label htmlFor="reminderTime">Reminder Time:</label><br/>
                                <input
                                    type="datetime-local"
                                    id="reminderTime"
                                    name="reminderTime"
                                    value={reminderTime}
                                    onChange={handleReminderTimeChange}
                                />
                                <br/>
                                {reminderError && <p className="error">{reminderError}</p>}
                            </>
                        )}
                        <input type="submit" value="Create Note" />
                    </form>
                </div>
            )}
        </div>
    );
}

export default Home;
