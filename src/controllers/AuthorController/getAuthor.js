const Author = require("../../models/Author");

const getAuthorPhoto = async (authorKey) => {
    try {
        const authorPhotoUrl = `https://covers.openlibrary.org/a/olid/${authorKey}-S.jpg`;

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
        const authorKey = req.query.authorKey;

        const response = await fetch(`https://openlibrary.org/authors/${authorKey}.json`);

        if (!response.ok) throw new Error("Failed to fetch author data: " + response.statusText);

        const authorData = await response.json();

        const authorImg = await getAuthorPhoto(authorKey);

        authorData.photo = authorImg;

        const existingAuthorReference = await Author.findOne({ keyOpenLibrary: authorKey })

        if (existingAuthorReference) {
            authorData.followers = existingAuthorReference.followers;
            authorData.bio = existingAuthorReference.bio;
        } else {
            const newAuthorReference = new Author({
                keyOpenLibrary: authorKey,
                followers: [],
                bio: authorData.bio
            })

            await newAuthorReference.save();

            authorData.followers = newAuthorReference.followers;
        }

        res.status(200).send(authorData);
    } catch (err) {
        console.error("Error in fetching author: ", err.message);
        res.status(500).send({ error: err.message });
    }
};

module.exports = getAuthor;