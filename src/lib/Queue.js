import Bee from 'bee-queue';
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
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    // TODO: Send error to a monitoring application like Sentry
    // eslint-disable-next-line no-console
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
