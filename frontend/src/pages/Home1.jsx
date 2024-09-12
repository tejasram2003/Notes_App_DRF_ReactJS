import { useState,useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css"; 

function Home() {
    const [notes, setNotes] = useState([]);
    const [content,setContent] = useState("");
    const [title,setTitle] = useState("");
    const [noteDetails, setNoteDetails] = useState({});

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
        }
            ).catch(err => alert(err))
            
    }

    const createNote = (e) => {
        e.preventDefault();
        api.post("api/notes/", {title, content}).then(res => {
            if (res.status === 201) 
                alert("Note created successfully")
            else 
                alert("Error creating note")
        getNotes();
        }).catch(err => alert(err))
        
    } 

    const updateNote = (id) => {
        api.put(`/api/notes/update/${id}/`, {title, content}).then(res => {
            if (res.status === 200) 
                alert("Note updated successfully")
            else 
                alert("Error updating note")
        getNotes();
        }).catch(err => alert(err))
    }

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => <Note note={note} onDelete={deleteNote} onUpdate={updateNote} key={note.id}/>)}
                {/* add onDetail={detailNote} later  */}
            </div>

            <h2>Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label><br/>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} />
                <br/>
                <label htmlFor="content">Content:</label><br/>
                <textarea 
                    id="content" 
                    name="content" 
                    required 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} />
                <br/>
                <input type="submit" value="Create Note" />
            </form>


        </div>
    );
}

export default Home;