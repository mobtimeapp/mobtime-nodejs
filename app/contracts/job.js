import { app } from 'package:bootstrap/app.js';
import Injectable from 'helpers:injectable.js';

export default class Job extends Injectable {
  constructor(dependencies, jobId = null) {
    super(app);


    this.jobId = jobId || `job_${Math.random().toString(36).slice(2)}`;

    this.invoke = this.wrapWithDependencies(this.invoke.bind(this), dependencies);
  }

  async invoke() {
    throw new RuntimeException('Job does not implement invoke');
  }
};
