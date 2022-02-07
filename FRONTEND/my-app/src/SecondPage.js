import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function SecondPage(){

    const {id} = useParams();
    const SERVER = 'http://localhost:8080';

    const[titlu,setTitlu] = useState("");
    const[idPiesa,setIdPiesa] = useState("");
    const[URL,setURL] = useState("");
    const[stil,setStil] = useState("");

    const showSongs = async () => {
        const table = document.getElementById("tabelBody");
        table.innerHTML = null;

        const response = await fetch(`${SERVER}/playlist/${id}/songs`);
        const data = await response.json()
        console.log(id);
        try {
            
            for (var i = 0; i < data.length; i++) {
                //console.log(data[i].songs.length);
                
                var row = document.createElement("tr");
                
                

                const tdataTitlu = document.createElement("td");
                tdataTitlu.innerHTML = data[i].titlu;
                row.appendChild(tdataTitlu);

                const tdataId = document.createElement("td");
                tdataId.innerHTML = data[i].id;
                row.appendChild(tdataId);
                
                const tdataURL = document.createElement("td");
                tdataURL.innerHTML = data[i].url;
                row.appendChild(tdataURL);
               
                const tdataStil = document.createElement("td");
                tdataStil.innerHTML = data[i].stil;
                row.appendChild(tdataStil);

                
                table.appendChild(row);
                
        
            }

        } catch (err) {
            throw err;
        }
    }

    useEffect(() => {
        showSongs()
    }, [])

    const addSong = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/song`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titlu,
                    id:idPiesa,
                    url:URL,
                    stil
                })
            })
            showSongs()


        } catch (err) {
            throw err;
        }
    }

    const updateSong = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/song/${idPiesa}/modifica`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    titlu,
                    id:idPiesa,
                    url:URL,
                    stil
                })
            })
            showSongs()


        } catch (err) {
            throw err;
        }
    }

    const deleteSong = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/song/${idPiesa}/sterge`, {
                method: 'DELETE'
            })
            showSongs()


        } catch (err) {
            throw err;
        }
    }

    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Titlu</th>
                        <th>ID</th>
                        <th>URL</th>
                        <th>Stil</th>
                    </tr>
                </thead>
                <tbody id="tabelBody">

                </tbody>
            </table>

            <div id="div">
            <input type="text" id="titlu" value={titlu} onChange={(e) => setTitlu(e.target.value)} placeholder="Titlu" />
            <br></br>
            <input type="text" id="id" value={idPiesa} onChange={(e) => setIdPiesa(e.target.value)} placeholder="ID" />
            <br></br>
            <input type="text" id="url" value={URL} onChange={(e) => setURL(e.target.value)} placeholder="URL" />
            <br></br>
            {/* <input type="text" id="stil" value={stil} onChange={(e) => setStil(e.target.value)} placeholder="Stil" />
            <br></br> */}
            <select name="stil" id="stil" value={stil} onChange={(e) => setStil(e.target.value)}>
                <option >POP</option>
                <option >ALTERNATIVE</option>
                <option >RAP</option>
                <option >TRAP</option>
            </select>
            <br></br>
            <button onClick={() => addSong()}>Adauga playlist</button>
            <button onClick={() => updateSong()}>Modifica playlist</button>
            <button onClick={() => deleteSong()}>Sterge piesa</button>

            </div>
        </div>
    )
}
export default SecondPage