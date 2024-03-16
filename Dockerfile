# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the Next.js app
RUN npm run build

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "start"]
