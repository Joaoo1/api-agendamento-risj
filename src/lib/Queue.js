import Bee from 'bee-queue';
import { captureException } from '@sentry/node';

import CanceledAppointmentMail from '../app/jobs/CanceledAppointmentMail';
import SuccessAppointmentMail from '../app/jobs/SuccessAppointmentMail';
import redisConfig from '../config/redis';

const jobs = [SuccessAppointmentMail, CanceledAppointmentMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    const customMessage = `Queue ${job.queue.name}: FAILED`;
    captureException({ ...err, customMessage });
  }
}

export default new Queue();
