const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');



router.get('/', async (req, res) => {
    try {
        res.locals.populatedRecipes = await Recipe.find({}).populate('owner')
        if (req.session.user) {
            res.locals.userRecipes = await Recipe.find({ owner: req.session.user._id }).populate('owner')
        } else {
            res.locals.userRecipes = [];
        }

        res.render('recipes/index.ejs')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/new', async (req, res) => {
    res.render('recipes/new.ejs')
})

router.get('/:recipeId', async (req, res) => {
    try {
        const populatedRecipes = await Recipe.findById(req.params.recipeId).populate('owner')
        res.locals.recipe = populatedRecipes
        res.render('recipes/show.ejs', {
            recipe: populatedRecipes
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body)
        newRecipe.owner = req.session.user._id
        await newRecipe.save()
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.delete('/:recipeId', async (req, res) => {
    try {
        const usedRecipe = await Recipe.findById(req.params.recipeId)
        await usedRecipe.deleteOne()
        res.redirect('/recipes')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
    
})



module.exports = router;