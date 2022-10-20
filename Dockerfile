FROM node:lts AS builder

RUN npm install -g @angular/cli

ARG ENV
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN ng build -c ${ENV}


FROM httpd:2.4-alpine

COPY --from=builder /usr/src/app/dist/CallCenter/ /usr/local/apache2/htdocs/
COPY ./apache/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./apache/.htaccess /usr/local/apache2/htdocs/

EXPOSE 80