// Geschäftslogik für Alias-Operationen

export class AliasManager {
  constructor(database) {
    this.database = database;
    this.shuffledIndices = [];
  }

  async addAlias(name) {
    return await this.database.addAlias(name);
  }

  async clearAll() {
    await this.database.clearAllAliases();
    this.shuffledIndices = [];
  }

  async getAllAliases() {
    return await this.database.getAllAliases();
  }

  async getAlias(id) {
    return await this.database.getAlias(id);
  }

  async shuffleAliases() {
    const aliases = await this.database.getAllAliases();
    this.shuffledIndices = aliases.map(alias => alias.id);
    AliasManager.shuffle(this.shuffledIndices);
    return this.shuffledIndices;
  }

  getShuffledIndices() {
    return this.shuffledIndices;
  }

  // Fisher-Yates Shuffle-Algorithmus (aus mq.js Zeilen 248-259)
  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
