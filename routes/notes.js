const express = require('express');
const { body, validationResult } = require('express-validator');

const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes.js')

const router = express.Router();

//Route 1
//Get all notes of a user
router.get('/fetchAll', fetchUser, async(req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', e })
    }

})


//Route2
//adding new note
router.post('/addnote', fetchUser, [
        //validating
        body('title', 'Note cannot be blank').exists(),
        body('description', 'Enter a valid desc').isLength({ min: 5 })
    ],
    async(req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, tag } = req.body;

            const note = new Notes({
                title,
                description,
                tag,
                user: req.user.id,
            });

            const saved = await note.save();

            res.json(saved);

        } catch (e) {
            res.status(500).json({ error: 'Internal server error', e })
        }

    })


//Route 3
//update note
router.put('/updateNote/:id', fetchUser, async(req, res) => {

    try {
        const { title, description, tag } = req.body;

        const newNote = {};
        if (title) {
            newNote.title = title;
        }
        if (description) {
            newNote.description = description;
        }
        if (tag) {
            newNote.tag = tag;
        }

        //finding note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndUpdate(
            req.params.id, { $set: newNote }, { new: true }
        );
        res.json(note);
    } catch (e) {
        res.status(500).json({ error: "Internal server error", e });
    }

})


//Route 4
//Delete note
router.delete('/deleteNote/:id', fetchUser, async(req, res) => {

    try {
        //finding note to be deleted
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ Deleted: note.id });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', e })
    }


})


module.exports = router