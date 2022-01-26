FROM node:alpine

RUN mkdir /codesomDashboard
WORKDIR /codesomDashboard
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "start"]

EXPOSE 3001

# docker build -t codesom-dashboard .
# docker run -it --rm -d -p 3001 codesom-dashboard