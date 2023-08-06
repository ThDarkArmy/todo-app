FROM node:18

# Install required packages
# RUN apt-get update && \
#     apt-get install -y make gcc g++ python3
#     #  && \
#     # rm -rf /var/lib/apt/lists/*

# # RUN apt-get update && \
# #     apt-get install -y make gcc g++

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]