const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const bearerToken = require('express-bearer-token');
const config = require('../config.js');
const app = express();
const { json } = require('express');
const mustAuth = require('../middlewares/mustAuth')

app.use(json());
app.use(bearerToken());

router.route('/comments')
    .get(async(req, res) => {
        let commentsList = await Comment.find().exec();

        res.json(commentsList);
    })
    .post(mustAuth(), async(req, res) => {
        try {
            let commentDB = {
                title: req.body.title,
                body: req.body.body,
                votes: req.body.votes
            }

            let newComment = await new Comment(commentDB).save()
            let commentJSON = newComment.toJSON()

            res.status(201).json(commentJSON);

        } catch (e) {
            res.status(404).json({ message: e.message })
            return
        }
    })

router.route('/comments/:id')
    .get(async(req, res) => {
        try {
            let commentsList = req.app.get('comments')
            let searchId = req.params.id

            let foundComment = await Comment.findById({ _id: searchId }).exec()

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
        try {
            let searchId = req.params.id

            let commentUpdated = {
                title: req.body.title,
                body: req.body.body,
                votes: req.body.votes
            }

            let updateComment = await Comment.findOneAndUpdate(searchId, commentUpdated, { new: true })

            if (!updateComment) {
                res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
                return
            }
            res.json(updateComment)
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })
    .delete(mustAuth(), async(req, res) => {
        try {
            let searchId = req.params.id
            let deleteComment = await Comment.deleteOne({ _id: searchId })

            if (deleteComment.deleteCount === 0) {
                res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
                return
            }

            res.status(204).json({ 'message': 'El usuario se ha eliminado correctamente.' })
            return
        } catch (err) {
            res.status(500).json({ 'message': 'No se ha podido resolver la solicitud' })
        }
    })

module.exports = router