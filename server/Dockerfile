FROM node:14

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json /app/
RUN npm install && npm install -g nodemon  # Install nodemon globally

# Copy application files
COPY . /app

EXPOSE 3001

# Start the server with nodemon
CMD ["nodemon", "server.js"]
