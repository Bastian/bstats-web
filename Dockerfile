FROM node:15

WORKDIR /app

COPY . .

# Install app dependencies and build application
RUN npm install

# We have to set the environment variable after install or it will not be able to
# build the project.
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD [ "node", "build/index.js" ]
