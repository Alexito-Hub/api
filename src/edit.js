const fs = require('fs/promises');
const path = require('path');

const keysFilePath = path.join(__dirname, './json/keys.json');
const usersFilePath = path.join(__dirname, './json/_user.json');

const getKeys = async () => {
  try {
    const keysData = await fs.readFile(keysFilePath, 'utf-8');
    return JSON.parse(keysData).keys;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las claves');
  }
};

const getKey = async (key) => {
  const keys = await getKeys();
  return keys.find(k => k.key === key) || null;
};

// Agregar una nueva clave
const addKey = async (newKey) => {
  try {
    const keysData = await fs.readFile(keysFilePath, 'utf-8');
    const keys = JSON.parse(keysData);
    keys.keys.push(newKey);
    await fs.writeFile(keysFilePath, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (error) {
    console.error(error);
    throw new Error('Error al agregar la clave');
  }
};

// Modificar una clave existente
const updateKey = async (keyToUpdate) => {
  try {
    const keysData = await fs.readFile(keysFilePath, 'utf-8');
    const keys = JSON.parse(keysData);
    const existingKeyIndex = keys.keys.findIndex(key => key.key === keyToUpdate.key);

    if (existingKeyIndex !== -1) {
      keys.keys[existingKeyIndex] = keyToUpdate;
      await fs.writeFile(keysFilePath, JSON.stringify(keys, null, 2), 'utf-8');
    } else {
      throw new Error('Clave no encontrada');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error al actualizar la clave');
  }
};

// Eliminar una clave
const deleteKey = async (keyToDelete) => {
  try {
    const keysData = await fs.readFile(keysFilePath, 'utf-8');
    const keys = JSON.parse(keysData);
    const filteredKeys = keys.keys.filter(key => key.key !== keyToDelete.key);
    keys.keys = filteredKeys;
    await fs.writeFile(keysFilePath, JSON.stringify(keys, null, 2), 'utf-8');
  } catch (error) {
    console.error(error);
    throw new Error('Error al eliminar la clave');
  }
};
async function getUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(data).users;
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUser(number) {
  try {
    const users = await getUsers();
    const user = users.find(u => u.number === number);
    return user;
  } catch (error) {
    throw error;
  }
}

async function addUser(newUser) {
  try {
    const users = await getUsers();
    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify({ users }, null, 2));
  } catch (error) {
    throw error;
  }
}

async function updateUser(number, updatedUser) {
  try {
    const users = await getUsers();
    const index = users.findIndex(u => u.number === number);

    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      await fs.writeFile(usersFilePath, JSON.stringify({ users }, null, 2));
    }
  } catch (error) {
    throw error;
  }
}

async function deleteUser(number) {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter(u => u.number !== number);
    await fs.writeFile(usersFilePath, JSON.stringify({ users: filteredUsers }, null, 2));
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  getKeys,
  addKey,
  updateKey,
  deleteKey
};
