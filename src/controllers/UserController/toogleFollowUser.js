const User = require("../../models/User");

const toggleFollowUser = async (req, res) => {
    const { userId, targetUserId } = req.body;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const isFollowing = user.followingUsersReference.includes(targetUserId);

        if (isFollowing) {
            user.followingUsersReference = user.followingUsersReference.filter(
                id => id.toString() !== targetUserId
            );
        } else {
            user.followingUsersReference.push(targetUserId);
        }

        await user.save();

        res.status(200).json({
            message: isFollowing
                ? "Usuário deixado de seguir com sucesso!"
                : "Usuário seguido com sucesso!"
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao alternar seguir/deixar de seguir", error });
    }
};

module.exports = toggleFollowUser;