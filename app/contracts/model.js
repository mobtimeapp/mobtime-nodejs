import Binding from 'helpers:binding.js';

class Query {
  #options = {};

  constructor(modelInstance) {
    this.#modelInstance = modelInstance;
  }

  where({ key, operator = '=', value }) {
    switch (operator) {
      case '=':
        this.#options.where ||= {};
        this.#options.where[key] = value;
        break;
    }

    return this;
  }

  async update(attrs) {
    this.#options.data ||= {};
    this.#options.data = { ...this.#options.data, ...attrs };

    const table = await this.#modelInstance.getTable();
    const attrs = await table.update(this.#options);

    if (!attrs) {
      return null;
    }

    this.#modelInstance.replaceAttrs(attrs);
    return this.#modelInstace;
  }
}

export default class Model {
  #attrs = {};

  table = null;
  primaryKey = 'id';

  fillable = null;

  constructor(attrs = {}) {
    this.#attrs = attrs;

    new Binding(this, 'refresh', ['@prisma/client']);
    new Binding(this, 'fresh', ['@prisma/client']);
  }

  get attrs() {
    return this.#attrs;
  }

  replaceAttrs(attrs) {
    this.#attrs = attrs;
  }

  getTable(db) {
    return db[this.table];
  }

  async refresh(db) {
    if (!this.table) {
      throw new ReferenceError('Model must have a table set to refresh');
    }
    this.#attrs = await db[this.table]
      .findFirst({
        where: {
          id: this.#attrs[this.primaryKey],
        },
      });
    return this;
  }

  query() {
    return new Query(this);
  }

  async update(mergeAttrs, db) {
    if (!this.table || !this.primaryKey) {
      throw new ReferenceError('Model must have a table and primaryKey set to update');
    }
    
    const newAttrs = Array.isArray(this.fillable)
      ? this.fillable.reduce((memo, key) => (key in mergeAttrs ? { ...memo, [key]: mergeAttrs[key] } : memo), {})
      : mergeAttrs;

    this.#attrs = db[table].update({
      where: { id: this.#attrs[this.primaryKey] },
      data: newAttrs,
    });

    return this;
  }
}

Model.wire = (definition) => {
  definition.find = (id) => {
    const instance = new definition({ id });
    return instance.refresh();
  };
};
