# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
