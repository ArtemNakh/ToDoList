import AppDBSource from '../config/dataSource.config.js';
import { fillingUser } from './1_users-filling.seed.js';
import { fillingNotes } from './2_notes-filling.seed.js';

async function runAllSeeds() {
  try {
    await AppDBSource.initialize();

    const runSeed = async (fn: Function, ...args: any[]) => {
      try {
        await fn(...args);
        console.log(`${fn.name} succesfully`);
      } catch (err: any) {
        console.error(`Error ${fn.name}:`, err.message || err);
      }
    };

    await runSeed(fillingUser, AppDBSource, 100);
    await runSeed(fillingNotes, AppDBSource, 0, 100);

    console.log('All seeds successfully');
  } catch (err) {
    console.error(`error during on of seed:`, err);
  } finally {
    await AppDBSource.destroy();
  }
}
runAllSeeds();
