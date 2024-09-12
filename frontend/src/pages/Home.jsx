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

    useEffect(() => {
        getNotes();
    }, []);
    
    const getNotes = () => {
        api.get("/api/notes/")
        .then((res) => res.data)
        .then((data) => { setNotes(data); console.log(data) })
        .catch((err) => alert(err));
    }

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then(res => {
            if (res.status === 204) 
                alert("Note deleted successfully")
            else 
                alert("Error deleting note")
            getNotes()
        }).catch(err => alert(err))
    }

    const createNote = (e) => {
        e.preventDefault();
        api.post("api/notes/", {title, content}).then(res => {
            if (res.status === 201) 
                alert("Note created successfully")
            else 
                alert("Error creating note")
        getNotes();
        setTitle("");
        setContent("");
        }).catch(err => alert(err))
    } 

    const updateNote = (e) => {
        e.preventDefault();
        if (!selectedNote) return;

        api.put(`/api/notes/update/${selectedNote.id}/`, {title, content}).then(res => {
            if (res.status === 200) 
                alert("Note updated successfully")
            else 
                alert("Error updating note")
        getNotes();
        setUpdateFormVisible(false);
        setSelectedNote(null);
        setTitle("");
        setContent("");
        }).catch(err => alert(err))
    }

    const showUpdateForm = (note) => {
        setSelectedNote(note);
        setTitle(note.title);
        setContent(note.content);
        setUpdateFormVisible(true);
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
                        <input type="submit" value="Create Note" />
                    </form>
                </div>
            )}
        </div>
    );
}

export default Home;