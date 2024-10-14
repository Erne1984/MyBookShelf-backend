const cloudinary = require('../../config/cloudinary');
const User = require("../../models/User");

const uploadUserImg = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'user_profiles',
        public_id: user._id.toString(),
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          console.error('Erro ao fazer upload da imagem:', error);
          return res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
        }
        return result;
      }
    ).end(req.file.buffer);

    user.imgUserUrl = result.secure_url;
    await user.save();

    res.json({ message: 'Imagem enviada com sucesso', imageUrl: result.secure_url });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' });
  }
};

module.exports = uploadUserImg;