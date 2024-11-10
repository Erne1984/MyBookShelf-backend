const mongoose = require("mongoose");
const Author = require("../../models/Author");

const getAuthorPhoto = async (authorKey) => {
    try {
        const authorPhotoUrl = `https://covers.openlibrary.org/a/olid/${authorKey}-M.jpg`;
        const response = await fetch(authorPhotoUrl);

        if (!response.ok) throw new Error("Failed to fetch author photo: " + response.statusText);

        return authorPhotoUrl;
    } catch (err) {
        console.error("Error in fetching author photo: ", err.message);
        return null;
    }
};

const getAuthor = async (req, res) => {
    try {
        const authorName = req.query.name;

        const existingAuthor = await Author.findOne({ name: authorName }).populate("followers works");

        if (existingAuthor) {
            res.status(200).send(existingAuthor);
        } else {
            const authorKey = req.query.authorKey;
            const response = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);

            if (!response.ok) throw new Error("Failed to fetch author data: " + response.statusText);

            const authorData = await response.json();

            const authorImg = await getAuthorPhoto(authorKey);
            authorData.photo = authorImg;

            const bio = authorData.bio && authorData.bio.value ? authorData.bio.value : '';

            const newAuthor = new Author({
                name: authorData.name,
                keyOpenLibrary: authorKey,
                followers: [],
                bio: bio,
                imageUrl: authorImg,
                works: [], 
                dateBirth: authorData.birth_date,
                dateDeath: authorData.death_date
            });

            await newAuthor.save();
            res.status(200).send(newAuthor);
        }
    } catch (err) {
        console.error("Error in fetching author: ", err.message);
        res.status(500).send({ error: err.message });
    }
};

module.exports = getAuthor;