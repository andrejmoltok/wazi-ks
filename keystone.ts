// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from '@keystone-6/core';

import { lists } from './schema';

import { withAuth, session } from './auth';

import dotenv from 'dotenv';

dotenv.config();

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: `${process.env.DATABASE_URL}`,
    },
    lists,
    session,
    server: {
      cors: { origin: ['http://localhost:8000'], credentials: true },
      port: 3000,
    }
  })
);
