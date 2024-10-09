const cloudinary = require('../../config/cloudinary');
const User = require("../../models/User");

const uploadUserImg = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'user_profiles',
    });

    const imageUrl = result.secure_url;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.imgUserUrl = imageUrl;
    await user.save();

    res.json({ message: 'Imagem enviada com sucesso', imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
};

module.exports = uploadUserImg;