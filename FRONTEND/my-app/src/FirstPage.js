import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import "./App.css"
function FirstPage() {
    const SERVER = 'http://localhost:8080';
    
    const navigateTo = useNavigate();
    const [descriere, setDescriere] = useState("");
    const [id, setId] = useState("");
    
    const [data, setData] = useState("");



    
    const showPlaylist = async () => {
        const table = document.getElementById("tabelBody");
        table.innerHTML = null;

        const response = await fetch(`${SERVER}/playlist`);
        const data = await response.json()

        try {
            
            for (var i = 0; i < data.length; i++) {

                var row = document.createElement("tr");
                

                const tdataDescriere = document.createElement("td");
                tdataDescriere.innerHTML = data[i].descriere;
                row.appendChild(tdataDescriere);

                const tdataId = document.createElement("td");
                tdataId.innerHTML = data[i].id;
                row.appendChild(tdataId);

                const tdataData = document.createElement("td");
                tdataData.innerHTML = data[i].data;
                row.appendChild(tdataData);

                
                table.appendChild(row);
        
            }

        } catch (err) {
            throw err;
        }
    }

    useEffect(() => {
        showPlaylist()
    }, [])


    const paginaPiese = async () => {
        console.log(id);
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/songs`)       
            if (!response.ok) {
                throw response
            }        
            navigateTo(`/${id}`)
        } catch (err) {
            throw err;        }

    }


    const addPlaylist = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descriere,
                    id,
                    data
                })
            })
            showPlaylist()


        } catch (err) {
            throw err;
        }
    }

    const updatePlaylist = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/modifica`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    descriere:descriere,
                    data:data
                })
            })
            if (!response.ok) {
                throw response
            }
            showPlaylist()


        } catch (err) {
            throw err;
        }
    }

    const stergePlaylist = async()=>{
        try {
            const response = await fetch(`${SERVER}/playlist/${id}/sterge`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw response
            }
            showPlaylist()


        } catch (err) {
            throw err;
        }
    }

    return (
        <div id="div">
            <table>
                <thead>
                    <tr>
                        <th>Descriere</th>
                        <th>ID</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody id="tabelBody">

                </tbody>
            </table>
            

            <div id="div">
            <input type="text" id="descriere" value={descriere} onChange={(e) => setDescriere(e.target.value)} placeholder="Descriere" />
            <br></br>
            <input type="text" id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="ID" />
            <br></br>
            {/* <input type="text" id="data" value={data} onChange={(e) => setData(e.target.value)} placeholder="Data" />
            <br></br> */}

            <input type="date" id="data" value={data} onChange={(e) => setData(e.target.value)} placeholder="Data" />
            <br></br>

            <button onClick={() => addPlaylist()}>Adauga playlist</button>
            <button onClick={() => updatePlaylist()}>Modifica playlist</button>
            <button onClick={() => stergePlaylist()}>Sterge playlist</button>
            <button onClick={() => paginaPiese()}>Afisare piese</button>


            </div>
        </div>



    )
}
export default FirstPage