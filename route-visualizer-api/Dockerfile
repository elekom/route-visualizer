# ==== CONFIGURE =====
# Use a Node 19 base image
FROM node:19-alpine 

# Set the working directory to /app inside the container
WORKDIR /app

# ==== REGULAR NODE APP ====
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .firebaserc ./
COPY firebase.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Start the app
##CMD ["npm", "start" ]

# ==== FIREBASE FUNCTION FOR LOCAL ====
# firebase
RUN yarn global add firebase-tools
RUN yarn add --dev firebase-tools

# firebase function 
#COPY functions /app/functions
# Bundle app source
COPY . .

# functions用のモジュールをインストールしておく。
RUN cd /app/functions && NODE_ENV=development npm install -y

# ローカルでfunctionを実行するために必要
#RUN yarn global add @google-cloud/functions-emulator --ignore-engines

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 5001 4000

# Start the app
#CMD [ "npx", "serve", "build" ]
CMD ["firebase", "emulators:start", "--only", "functions"]