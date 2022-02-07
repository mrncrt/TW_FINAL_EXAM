const express = require('express')
const Sequelize = require('sequelize')
const bodyParser = require('body-parser')

const cors = require('cors')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'examen.db',
    define: {
        timestamps: false
    }
})

const Playlist = sequelize.define('playlist', {
    descriere: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            min:3

        }
    },
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    data:{
        type:Sequelize.DATE,
        allowNull:false
    }
})

const Song = sequelize.define('song', {
    titlu: {
        type: Sequelize.STRING,
        validate: {
            min:5
        }
    },
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    url:{
        type: Sequelize.STRING,
        validate:{
            isURL:true
        },
        allowNull:false
    },
    stil:{
        type:Sequelize.STRING,
        validate:{
            isIn: [['POP', 'ALTERNATIVE','RAP','TRAP']]
        }
    }

})
Playlist.hasMany(Song)
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use((err, req, res, next) => {
    console.warn(err);
    res.status(500).json({ message: err });
})

app.get('/sync', async (req, res, next) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: "Table created" });

    } catch (err) {
        next(err)
    }
})
app.get('/playlist/sortpag', async (req, res, next) => {
    try {
        const playlist = await Playlist.findAll();
        const page = req.query.page
        const limit = req.query.limit
        const sorting = req.query.sort
        const sort = req.query.sortBy
        const order = req.query.order
        const filters = req.query

        if (page && limit) {
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const paginatedPlaylists = playlist.slice(startIndex, endIndex)
            res.status(200).json(paginatedPlaylists)
        }
        else if (sort && order) {
            const playlists =await Playlist.findAll();
            const sortedPlaylists = playlists.sort(function(x, y){
                return x[sort] > y[sort]
            })
            if(order === 'desc'){
                sortedPlaylists.reverse()
            }
            res.status(200).json(sortedPlaylists);
        }
        else if (filters) {
            const playlists = await Playlist.findAll();
            const filteredPlaylists = playlists.filter(playlist => {
                let isValid = true
                for (key in filters) {
                    isValid = isValid && playlist[key] == filters[key]
                }
                return isValid
            });
            res.status(200).json(filteredPlaylists)
        }
        else
            res.status(200).json(playlist)
    } catch (err) {
        next(err);
    }
})

//AFISAM UN PLAYLIST + PIESE
app.get('/playlist', async (req, res, next) => {
    try {
        const playlist = await Playlist.findAll({ include: [Song] });
        res.status(200).json(playlist);

    } catch (err) {
        next(err)
    }
})
//ADAUGAM UN PLAYLIST
app.post('/playlist', async (req, res, next) => {
    try {
        const playlist = req.body;
        const allPlaylist = await Playlist.findAll();
        var validator = true;
        for (var i = 0; i < allPlaylist.length; i++) {
            if (playlist.id === allPlaylist[i].id) {
                res.status(400).json({ message: "Avem deja acest id" });
                validator = false;
            }

        }
        if (playlist.id === null) {
            res.status(400).json({ message: "Nu putem avea id-ul null" });
            validator = false;
        }

        if (Object.keys(playlist).length <= 1) {
            res.status(400).json({ message: "Nu putem avea campuri lipsa" });
            validator = false;
        }

        if (validator === true) {
            await Playlist.create(req.body);
            res.status(200).json({ message: 'added' });
        }

    } catch (err) {
        next(err)
    }
})
//MODIFICAM UN PLAYLIST
app.put('/playlist/:id/modifica',async(req,res,next)=>{
    try{
        const playlist = await Playlist.findOne({where:{id:req.params.id}})
        if(playlist){
            await playlist.update(req.body);
            res.status(201).json("Schimbat");
        }else{
            res.status(404).json({ message: 'Not found the id ' });
        }

    }catch(err){
        next(err)
    }
})
//STEGEM UN PLAYLIST
app.delete('/playlist/:id/sterge',async(req,res,next)=>{
    try{
        const playlist = await Playlist.findOne({where:{id:req.params.id}})
        if(playlist){
            await playlist.destroy();
            res.status(201).json({message: 'Sters' });
        }else{
            res.status(404).json({ message: 'Not found the id ' });
        }

    }catch(err){
        next(err)
    }
})
//ADAUGAM O PIESA
app.post('/playlist/:id/song', async (req, res, next) => {
    try {
        const playlist = await Playlist.findOne({where:{id:req.params.id}});
        const song = req.body;
        if(playlist){
            song.playlistId = playlist.id;
            await Song.create(song);
            res.status(201).json("Adaugat");

        }else{
            res.status(404).json({message:"Not found"});
        }

    } catch (err) {
        next(err)
    }
})
//AFISAM TOATE PIESELE
app.get('/playlist/:id/songs',async(req,res,next)=>{
    try {
        const playlist = await Playlist.findOne({where:{id:req.params.id}});
        if(playlist){
            const songs = await playlist.getSongs();
            res.status(200).json(songs);

        }else{
            res.status(404).json({message:"Not found"});

        }

    } catch (err) {
        next(err)
    }
})
//AFISAM O PIESA PRIN ID
app.get('/playlist/:id/song/:idPiesa',async(req,res,next)=>{
    try {
        const playlist = await Playlist.findOne({where:{id:req.params.id}});
        if(playlist){
            const songs = await playlist.getSongs({where:{id:req.params.idPiesa}});
            const song = songs.shift()
            if(song){
                res.status(200).json(song);
            }else{
                res.status(404).json("Not found")

            }
        }else{
            res.status(404).json({message:"Not found"});

        }

    } catch (err) {
        next(err)
    }
})
//MODIFICAM PRIN ID
app.put('/playlist/:id/song/:id2/modifica',async(req,res,next)=>{
    try {
        const playlist = await Playlist.findOne({where:{id:req.params.id}});
        const ceva = req.body;
        if(playlist){
            const songs = await playlist.getSongs({where:{id:req.params.id2}});
            const song = songs.shift()
            if(song){
                await song.update(ceva,{fields:['titlu','url','stil']})
                res.status(200).json({ message: "Am schimbat" });
            }else{
                res.status(404).json("Not found")

            }
        }else{
            res.status(404).json({message:"Not found"});

        }

    } catch (err) {
        next(err)
    }
})

//STERGEM PIESA PRIN ID
app.delete('/playlist/:id/song/:id2/sterge',async(req,res,next)=>{
    try {
        const playlist = await Playlist.findOne({where:{id:req.params.id}});
        if(playlist){
            const songs = await playlist.getSongs({where:{id:req.params.id2}});
            const song = songs.shift()
            if(song){
                await song.destroy();
                res.status(200).json({ message: "Am sters" });
            }else{
                res.status(404).json("Not found")

            }
        }else{
            res.status(404).json({message:"Not found"});

        }

    } catch (err) {
        next(err)
    }
})


app.listen(8080);