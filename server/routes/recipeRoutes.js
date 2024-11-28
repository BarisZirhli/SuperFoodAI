// routes/recipeRoutes.js

const express = require('express');
const router = express.Router();
const { Recipe } = require('../models');

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.findAll(); // Tüm tarifleri al
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id); // ID ile tarif getir
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const newRecipe = await Recipe.create(req.body); 
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (recipe) {
            await recipe.update(req.body); 
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error });
    }
});

// 5. Bir tarifi sil
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (recipe) {
            await recipe.destroy(); 
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error });
    }
});

module.exports = router;
