const fs = require('fs/promises');
const path = require('path');

const keysFilePath = path.join(__dirname, './keys.json');

// Obtener todas las claves
const getKeys = async () => {
  try {
    const keysData = await fs.readFile(keysFilePath, 'utf-8');
    return JSON.parse(keysData).keys;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener las claves');
  }
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

module.exports = {
  getKeys,
  addKey,
  updateKey,
  deleteKey
};
