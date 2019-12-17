FROM node:alpine as builder
RUN apk --update add imagemagick parallel
COPY . /opt/app
WORKDIR /opt/app
RUN npm install
RUN node /opt/app/resources/tools/update-icons.js

FROM nginx:alpine
COPY --from=builder /opt/app/generator /opt/app/generator/
COPY --from=builder /opt/app/resources /opt/app/resources/
COPY --from=builder /opt/app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
