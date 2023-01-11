class Kernel {
  #app = null;

  constructor(app) {
    this.#app = app;
  }

  async handle(commandName, args) {
    try {
      const commandClass = await this.#app.import(`commands:${commandName}.js`, 'default');
      const command = new commandClass(this.#app);
      return command.invoke(commandName, args);
    } catch (error) {
      console.error('Error running carpenter command', commandName, error);
    }
  }
};

export const singleton = (app) => new Kernel(app);
