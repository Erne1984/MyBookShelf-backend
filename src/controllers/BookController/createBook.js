const mongoose = require("mongoose");
const Author = require("../../models/Author");
const Book = require("../../models/Book");

const createBook = async (req, res) => {
  const {
    title,
    authors,
    identifiers,
    numberOfPages,
    bookDescri,
    publishers,
    publish_date,
    subjects,
    cover,
  } = req.body;

  try {
    const newBook = new Book({
      title,
      authors,
      identifiers,
      numberOfPages,
      bookDescri,
      publishers,
      publish_date,
      subjects,
      cover,
      score: 0,
    });
    
    await newBook.save();

    for (let authorData of authors) {
      const authorName = authorData.name;

      let author = await Author.findOne({ name: authorName });

      if (author) {
        author.works.push(newBook._id);
      } else {
        author = new Author({
          name: authorName,
          works: [newBook._id],
        });
      }
      
      await author.save();
    }

    res.status(201).json({ message: "Livro e autor(es) adicionados com sucesso!", book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar o livro e autor(es)." });
  }
};

module.exports = createBook;
