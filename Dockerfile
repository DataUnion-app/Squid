FROM node:latest

RUN mkdir squid

# ADD . /parse
COPY package*.json ./squid/

WORKDIR /squid

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]
