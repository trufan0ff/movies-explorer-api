module.exports.addOwnerToMovie = (data, ownerId) => {
    const newData = data;
    newData.owner = ownerId;
    return newData;
};