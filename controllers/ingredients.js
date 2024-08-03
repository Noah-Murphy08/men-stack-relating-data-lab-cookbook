const express = require('express');
const router = express.Router();

const User = require('../models/user.js')
const Ingredient = require('../models/ingredient.js');
const Recipe = require('../models/recipe.js');


router.get('/new', async (req, res) => {
    try{
        res.render('ingredients/new.ejs')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        const newIngredient = new Ingredient(req.body)
        newIngredient.owner = req.session.user._id
        await newIngredient.save()
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})









module.exports = router;