const express=require("express")
const router=express.Router()
const { body, validationResult } = require("express-validator");
const Note=require('../models/Note');
const fetchuser=require('../middleware/fetchuser');


//Route1: Get all the notes using: GET "/api/notes/getuser". Login required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    const notes=await Note.find({user:req.user.id})
    res.json(notes)
})


//Route2: Add a new note using: POST "/api/auth/addnote". Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','Description must be atleast 5 characters').isLength({min:5})
],async (req,res)=>{

    //1.If there are errors in validationResult, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    //2.(a) TRY-BLOCK
    try{
        const {title,description,tag}=req.body
        const note=new Note({
            title,description,tag,user:req.user.id
         })
         const savedNote=await note.save();
     
         res.json(savedNote)
    }
    //2.(b) CATCH-BLOCK
    catch(error){
        //If there is Internal Server Error
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    } 
})



//Route3: Update an existing note using: PUT "/api/notes/updatenote". Login required
// The params-id is note-id
router.put('/updatenote/:id',fetchuser,async(req,res)=>{

    //3.(a) TRY-BLOCK
    try{
        const {title,description,tag}=req.body;

        //Create a newNote object
        const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag};

        //Find the note to be updated and update it
        let note=await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({note})
    }

    //3.(b) CATCH-BLOCK
    catch(error){
        //If there is Internal Server Error
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})


//Route4: Delete an existing note using: DELETE "/api/notes/deletenote". Login required
// The params-id is note-id
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{

    //4.(a) TRY-BLOCK
    try{
        //Find the note to be updated and delete it
        let note=await Note.findById(req.params.id)
        if(!note){
            return res.status(404).send("Not Found");
        }

        //Allows deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
        note=await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note:note})
    }

    //4.(b) CATCH-BLOCK
    catch(error){
        //If there is Internal Server Error
         console.log(error.message);
         res.status(500).send("Internal Server Error");
    }
   
})



module.exports=router;