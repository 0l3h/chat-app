#!/bin/bash

npx prisma generate &&
npx prisma migrate dev &&
npm run build