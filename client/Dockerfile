# Use official Node.js image
FROM node:14

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the application code
COPY . /app

EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
