FROM node:alpine as builder
MAINTAINER daemonsthere@gmail.com

COPY . /opt/app
WORKDIR /opt/app

RUN apk --update add imagemagick parallel &&\
	npm install &&\
	node ./resources/tools/update-icons.js

FROM nginx:alpine
MAINTAINER daemonsthere@gmail.com

COPY --from=builder /opt/app/generator /opt/app/generator/
COPY --from=builder /opt/app/resources /opt/app/resources/
COPY --from=builder /opt/app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
