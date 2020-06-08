const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const bearerToken = require('express-bearer-token');
const app = express();
const { json } = require('express');
const mustAuth = require('../middlewares/mustAuth')
const onlyAdmins = require('../middlewares/onlyAdmins')

app.use(json());
app.use(bearerToken());

router.route('/:deviceID/comments')
    .get(async(req, res) => {
        let commentsList = await Comment.find().exec();

        res.json(commentsList);
    })
    .post( /* mustAuth() ,*/ async(req, res) => {
        try {
            let commentDB = {
                    body: req.body.body,
                    userCreate: req.body.userCreate,
                    smartphoneID: req.body.smartphoneID,
                    creationDate: req.body.creationDate,
                    votes: req.body.votes
                },
                newComment = await new Comment(commentDB).save(),
                commentJSON = newComment.toJSON();

            res.status(201).json(commentJSON);

        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })

router.route('/:deviceID/comments/:id')
    .get(async(req, res) => {
        try {
            let searchId = req.params.id,
                foundComment = await Comment.findById({ _id: searchId }).exec();

            if (!foundComment) {
                res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
                return
            }

            res.json(foundComment)
        } catch (err) {
            res.status(404).json({ message: e.message })
            return
        }
    })
    .put(mustAuth(), async(req, res) => {

        let commentEdited = req.body.votes + 1

        try {
            let searchId = req.params.id
            let updateComment = await Comment.FindAndModify(searchId, commentEdited, { new: true })

            if (!result) {
                res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
                return
            }

            res.json(result)
        } catch (err) {
            res.status(500).json({ 'message': ' No se ha podido resolver la solicitud' })
        }

    })
    .delete(onlyAdmins(), async(req, res) => {
        try {
            let searchId = req.params.id,
                deleteComment = await Comment.deleteOne({ _id: searchId });

            if (deleteComment.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }
            res.status(204).json(`El comentario con id ${searchId} se ha eliminado correctamente.`)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })

module.exports = router