const express = require("express");

const {addComment, addRating, getAllComments, getAllRatings,
     average, deleteComment, deleteRating} = require("../controllers/OpinionController");

const router = express.Router();

router.post('/addComment', addComment);
router.post('/addRating', addRating);
router.get('/all', getAllComments);
router.get('/average', average);
router.get('/allRatings', getAllRatings);
router.delete('/deleteComment', deleteComment);
router.delete('/deleteRating', deleteRating);

module.exports = router;