const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Item = require('../models/Item');
const mongoose = require('mongoose');

const addComment = async(req, res)=>{
    const { itemId, author, comment} = req.body;
    try{
        if(!itemId || !author || !comment){
            return res.status(400).json({ message: 'Not enough information given' });
        }

        if(!mongoose.Types.ObjectId.isValid(itemId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        if(comment.trim()==''){
            return res.status(400).json({ message: 'No comment given' });
        }

        const item = Item.findById(itemId);
        if(!item){
            return res.status(400).json({ message: 'No item with given ID' });
        }

        const newComment = new Comment({ itemId, author, comment});
        await newComment.save();
        
        res.status(200).json({ message: "Saved succesfully"});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const addRating = async(req, res)=>{
    const { itemId, author, rating} = req.body;
    try{
        if(!itemId || !author || !rating){
            return res.status(400).json({ message: 'Not enough information given' });
        }

        if(!mongoose.Types.ObjectId.isValid(itemId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        const item = Item.findById(itemId);

        if(!item){
            return res.status(400).json({ message: 'No item with given ID' });
        }

        if(rating<1 || rating>5){
            return res.status(400).json({ message: 'Rating out of bounds' });
        }
        
        const newRating = new Rating({ itemId, author, rating});
        await newRating.save();
        res.status(200).json({ message: "Ocena zapisana pomyślnie"});
    }
    catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllComments = async (req, res) => {
    const { itemId } = req.query;
    try {
        if(!itemId){
            return res.status(400).json({message: 'No ID given'});
        }

        if(!mongoose.Types.ObjectId.isValid(itemId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        const opinions = await Comment.find({ itemId: new mongoose.Types.ObjectId(itemId) });

        if (opinions.length === 0) {
            return res.status(400).json({ message: 'Brak opinii' });
        }
        
        res.status(200).json({ opinions: opinions });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllRatings = async (req, res) => {
    const { itemId } = req.query;
    try {
        if(!itemId){
            return res.status(400).json({message: 'No ID given'});
        }

        if(!mongoose.Types.ObjectId.isValid(itemId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        const ratings = await Rating.find({ itemId: new mongoose.Types.ObjectId(itemId) });

        if (ratings.length === 0) {
            return res.status(400).json({ message: 'Brak opinii' });
        }
        
        res.status(200).json({ ratings: ratings });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const average = async (req, res) => {
  const { itemId } = req.query;
  
    try {
        if(!itemId){
            return res.status(400).json({message: 'No ID given'});
        }

        if(!mongoose.Types.ObjectId.isValid(itemId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

      const averageRating = await Rating.aggregate([
          { $match: { itemId: new mongoose.Types.ObjectId(itemId) } },
          { $group: { _id: null, average: { $avg: '$rating' } } },
      ]);

      if (averageRating.length === 0) {
          return res.status(404).json({ error: 'No opinions found for the given itemId' });
      }

      res.status(200).json({ average: averageRating[0].average });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.query;

    try {
        if(!commentId){
            return res.status(400).json({message: 'No ID given'});
        }

        if(!mongoose.Types.ObjectId.isValid(commentId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        if (!commentId) {
            return res.status(400).json({ message: 'commentId parameter is required' });
        }

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await Comment.deleteOne(existingComment);

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteRating = async (req, res) => {
    const { ratingId } = req.query;

    try {
        if (!ratingId) {
            return res.status(400).json({ message: 'ratingId parameter is required' });
        }

        if(!mongoose.Types.ObjectId.isValid(ratingId)){
            return res.status(400).json({message: 'Faulty ID given'});
        }

        const existingRating = await Rating.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        await Rating.deleteOne(existingRating);

        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {addComment, addRating, getAllComments, getAllRatings,
    average, deleteComment, deleteRating};