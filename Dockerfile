FROM node:alpine as builder
RUN apk update &&\
	apk add imagemagick &&\
	apk add git
#RUN apk add bash
RUN npm install mv graceful-fs fs-extra request path walk unzipper child_process ncp
COPY . /opt/app
WORKDIR /opt/app
RUN node /opt/app/resources/tools/update-icons.js

FROM nginx:alpine
#RUN apk update && apk add bash
COPY --from=builder /opt/app/generator /opt/app/generator/
COPY --from=builder /opt/app/resources /opt/app/resources/
COPY --from=builder /opt/app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

