# FROM node:22.14.0
FROM public.ecr.aws/docker/library/node:22.14.0-alpine3.20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
COPY yarn.lock ./

# Install production dependencies.
RUN yarn install --only=production

# Copy local code to the container image.
COPY . .

# Build the NestJS application
RUN yarn build

# Start the NestJS application
CMD ["yarn", "start:prod"]